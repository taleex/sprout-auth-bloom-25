import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, AlertCircle, CheckCircle, X, Download, ArrowRight, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  category?: string;
  category_id?: string;
  merchant?: string;
  confidence?: number;
}

interface TransactionImportProps {
  accountId: string;
  onClose: () => void;
  open: boolean;
}

type ImportStep = 'upload' | 'preview' | 'integration' | 'processing';

const TransactionImport: React.FC<TransactionImportProps> = ({ accountId, onClose, open }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [integrationType, setIntegrationType] = useState<'openai' | 'manual'>('openai');
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<number>>(new Set());

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setProgress(10);
    setFileName(file.name);

    try {
      // Read file content only
      const content = await readFileContent(file);
      setFileContent(content);
      setProgress(100);
      setCurrentStep('preview');

      toast({
        title: "File Uploaded",
        description: `Successfully uploaded ${file.name}`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to read file",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setUploading(false);
    }

    // Reset file input
    event.target.value = '';
  }, [user, toast]);

  const handleNext = () => {
    setCurrentStep('integration');
  };

  const handleProcessFile = async () => {
    if (!fileContent) return;

    setProcessing(true);
    setCurrentStep('processing');
    setProgress(0);

    try {
      setProgress(50);

      const { data, error } = await supabase.functions.invoke('process-transaction-import', {
        body: {
          fileContent,
          fileName,
          accountId,
          integrationType
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setParsedTransactions(data.transactions || []);
      // Select all transactions by default
      setSelectedTransactions(new Set(data.transactions.map((_: any, index: number) => index)));
      setProgress(100);

      toast({
        title: "Success",
        description: `Parsed ${data.count} transactions from ${fileName}`,
      });

    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
      setParsedTransactions([]);
      setProgress(0);
      setCurrentStep('integration');
    } finally {
      setProcessing(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const toggleTransactionSelection = (index: number) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedTransactions(newSelected);
  };

  const handleImportTransactions = async () => {
    if (!user || selectedTransactions.size === 0) return;

    setImporting(true);
    try {
      const transactionsToImport = Array.from(selectedTransactions).map(index => {
        const transaction = parsedTransactions[index];
        return {
          user_id: user.id,
          account_id: accountId,
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date,
          category_id: transaction.category_id,
          type: transaction.amount > 0 ? 'income' : 'expense',
          transaction_type: 'imported'
        };
      });

      const { error } = await supabase
        .from('transactions')
        .insert(transactionsToImport);

      if (error) throw error;

      // Update account balance
      const totalAmount = transactionsToImport.reduce((sum, t) => sum + t.amount, 0);
      if (totalAmount !== 0) {
        const { error: balanceError } = await supabase
          .rpc('update_account_balance', {
            account_id: accountId,
            amount_change: totalAmount
          });

        if (balanceError) {
          console.error('Failed to update account balance:', balanceError);
        }
      }

      toast({
        title: "Import Successful",
        description: `Imported ${selectedTransactions.size} transactions`,
      });

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });

      // Reset state and close
      setParsedTransactions([]);
      setSelectedTransactions(new Set());
      setProgress(0);
      setFileName('');
      onClose();

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import transactions",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'bg-gray-500';
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleClose = () => {
    // Reset all state when closing
    setCurrentStep('upload');
    setUploading(false);
    setProcessing(false);
    setImporting(false);
    setProgress(0);
    setFileName('');
    setFileContent('');
    setIntegrationType('openai');
    setParsedTransactions([]);
    setSelectedTransactions(new Set());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Transactions
          </DialogTitle>
          <DialogDescription>
            Upload a bank statement (CSV or PDF) to automatically import and categorize your transactions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Upload Step */}
          {currentStep === 'upload' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Bank Statement</CardTitle>
                <CardDescription>
                  Supported formats: CSV, PDF. Upload your file to get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".csv,.pdf,.txt"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`cursor-pointer inline-flex flex-col items-center gap-4 ${
                      uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FileText className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {uploading ? 'Uploading...' : 'Click to upload file'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        CSV, PDF, or TXT files up to 10MB
                      </p>
                    </div>
                  </label>
                </div>

                {uploading && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{fileName}</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-muted-foreground">Uploading file...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Preview Step */}
          {currentStep === 'preview' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  File Preview - {fileName}
                </CardTitle>
                <CardDescription>
                  Review your file content below. Click "Next" when you're satisfied with the upload.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {fileContent.length > 2000 
                      ? `${fileContent.substring(0, 2000)}...\n\n[Content truncated - showing first 2000 characters]`
                      : fileContent
                    }
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integration Step */}
          {currentStep === 'integration' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Choose Integration Type
                </CardTitle>
                <CardDescription>
                  Select how you want to process your transactions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      integrationType === 'openai' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setIntegrationType('openai')}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={integrationType === 'openai'}
                        onChange={() => setIntegrationType('openai')}
                        className="w-4 h-4"
                      />
                      <div>
                        <h3 className="font-medium">AI Processing (OpenAI)</h3>
                        <p className="text-sm text-muted-foreground">
                          Automatically parse and categorize transactions using AI. Requires OpenAI API key.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      integrationType === 'manual' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setIntegrationType('manual')}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={integrationType === 'manual'}
                        onChange={() => setIntegrationType('manual')}
                        className="w-4 h-4"
                      />
                      <div>
                        <h3 className="font-medium">Manual Processing</h3>
                        <p className="text-sm text-muted-foreground">
                          Parse transactions using basic rules. No AI processing required.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing Step */}
          {currentStep === 'processing' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Processing Transactions</CardTitle>
                <CardDescription>
                  {integrationType === 'openai' 
                    ? 'AI is parsing and categorizing your transactions...' 
                    : 'Processing transactions with basic rules...'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{fileName}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    {processing ? 'Processing transactions...' : 'Complete!'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Parsed Transactions */}
          {parsedTransactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Parsed Transactions ({parsedTransactions.length})</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTransactions(new Set(parsedTransactions.map((_, i) => i)))}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTransactions(new Set())}
                    >
                      Deselect All
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Review and select transactions to import. Selected: {selectedTransactions.size}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Import</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Confidence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedTransactions.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedTransactions.has(index)}
                              onChange={() => toggleTransactionSelection(index)}
                              className="w-4 h-4"
                            />
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{transaction.description}</div>
                              {transaction.merchant && (
                                <div className="text-xs text-muted-foreground">{transaction.merchant}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatAmount(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            {transaction.category && (
                              <Badge variant="outline">{transaction.category}</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {transaction.confidence && (
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getConfidenceColor(transaction.confidence)}`} />
                                <span className="text-xs">{Math.round(transaction.confidence * 100)}%</span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={importing || processing}>
            Cancel
          </Button>
          
          {currentStep === 'preview' && (
            <Button onClick={handleNext} className="flex items-center gap-2">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          
          {currentStep === 'integration' && (
            <Button onClick={handleProcessFile} disabled={processing}>
              {processing ? 'Processing...' : 'Process File'}
            </Button>
          )}
          
          {parsedTransactions.length > 0 && (
            <Button onClick={handleImportTransactions} disabled={selectedTransactions.size === 0 || importing}>
              {importing ? 'Importing...' : `Import ${selectedTransactions.size} Transactions`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionImport;
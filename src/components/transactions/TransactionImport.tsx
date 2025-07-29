import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, AlertCircle, CheckCircle, X, Download } from 'lucide-react';
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

const TransactionImport: React.FC<TransactionImportProps> = ({ accountId, onClose, open }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<number>>(new Set());

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setProgress(10);
    setFileName(file.name);

    try {
      // Read file content
      const fileContent = await readFileContent(file);
      setProgress(30);

      // Process with AI
      setProcessing(true);
      setProgress(50);

      const { data, error } = await supabase.functions.invoke('process-transaction-import', {
        body: {
          fileContent,
          fileName: file.name,
          accountId
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
        description: `Parsed ${data.count} transactions from ${file.name}`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
      setParsedTransactions([]);
      setProgress(0);
    } finally {
      setUploading(false);
      setProcessing(false);
    }

    // Reset file input
    event.target.value = '';
  }, [user, accountId, toast]);

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Bank Statement</CardTitle>
              <CardDescription>
                Supported formats: CSV, PDF. The AI will automatically parse and categorize your transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv,.pdf,.txt"
                  onChange={handleFileUpload}
                  disabled={uploading || processing}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer inline-flex flex-col items-center gap-4 ${
                    uploading || processing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {uploading ? 'Uploading...' : processing ? 'Processing...' : 'Click to upload file'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      CSV, PDF, or TXT files up to 10MB
                    </p>
                  </div>
                </label>
              </div>

              {(uploading || processing) && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{fileName}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    {uploading ? 'Uploading file...' : 'AI is parsing your transactions...'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

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
          <Button variant="outline" onClick={onClose} disabled={importing}>
            Cancel
          </Button>
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
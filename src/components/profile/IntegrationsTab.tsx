import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, EyeOff, Plus, Key, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SimpleAuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ApiKey {
  id: string;
  service_name: string;
  created_at: string;
  is_active: boolean;
}

const IntegrationsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [newServiceName, setNewServiceName] = useState('openai');
  const [saving, setSaving] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const supportedServices = [
    { 
      id: 'openai', 
      name: 'OpenAI', 
      description: 'Required for intelligent transaction import and categorization',
      icon: '🤖'
    },
    { 
      id: 'bank_api', 
      name: 'Bank API', 
      description: 'Connect to your bank for automatic transaction import',
      icon: '🏦'
    }
  ];

  useEffect(() => {
    fetchApiKeys();
  }, [user]);

  const fetchApiKeys = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('id, service_name, created_at, is_active')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddApiKey = async () => {
    if (!user || !newApiKey.trim() || !newServiceName) return;

    setSaving(true);
    try {
      // First encrypt the API key
      const { data: encryptedKey, error: encryptError } = await supabase
        .rpc('encrypt_api_key', { api_key: newApiKey.trim() });

      if (encryptError) throw encryptError;

      // Then store it
      const { error } = await supabase
        .from('user_api_keys')
        .upsert({
          user_id: user.id,
          service_name: newServiceName,
          api_key_encrypted: encryptedKey,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${supportedServices.find(s => s.id === newServiceName)?.name} API key added successfully`,
      });

      setNewApiKey('');
      setIsAddDialogOpen(false);
      fetchApiKeys();
    } catch (error) {
      console.error('Error adding API key:', error);
      toast({
        title: "Error",
        description: "Failed to add API key",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "API key deleted successfully",
      });

      fetchApiKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const getServiceInfo = (serviceName: string) => {
    return supportedServices.find(s => s.id === serviceName) || {
      id: serviceName,
      name: serviceName.toUpperCase(),
      description: 'Third-party service integration',
      icon: '🔗'
    };
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading integrations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Integrations</h2>
        <p className="text-muted-foreground">
          Manage your API keys and third-party service integrations for enhanced functionality.
        </p>
      </div>

      {/* Add New Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Integration
          </CardTitle>
          <CardDescription>
            Connect external services to unlock powerful features like automatic transaction import and AI-powered categorization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add API Key</DialogTitle>
                <DialogDescription>
                  Add an API key for external service integration. Your keys are stored securely and encrypted.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <select
                    id="service"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    {supportedServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.icon} {service.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-muted-foreground">
                    {getServiceInfo(newServiceName).description}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apikey">API Key</Label>
                  <Input
                    id="apikey"
                    type="password"
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    placeholder="Enter your API key..."
                    className="font-mono"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddApiKey} disabled={!newApiKey.trim() || saving}>
                  {saving ? 'Adding...' : 'Add API Key'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Existing API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Your API Keys
          </CardTitle>
          <CardDescription>
            Manage your stored API keys and their access permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No API keys configured yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add an API key to enable advanced features like transaction import.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => {
                const serviceInfo = getServiceInfo(apiKey.service_name);
                return (
                  <div
                    key={apiKey.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{serviceInfo.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{serviceInfo.name}</h4>
                          <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                            {apiKey.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Added {new Date(apiKey.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete your {serviceInfo.name} API key. 
                              Features that depend on this integration will stop working.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteApiKey(apiKey.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>
            Services you can integrate with your financial app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {supportedServices.map((service) => {
              const hasKey = apiKeys.some(key => key.service_name === service.id);
              return (
                <div key={service.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{service.icon}</div>
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      {hasKey && <Badge variant="outline" className="text-xs">Configured</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsTab;

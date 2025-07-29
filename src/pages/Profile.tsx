
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProfileForm from '@/components/profile/ProfileForm';
import ReportsTab from '@/components/profile/ReportsTab';
import NotificationSettings from '@/components/profile/NotificationSettings';
import CategoriesTab from '@/components/profile/CategoriesTab';
import IntegrationsTab from '@/components/profile/IntegrationsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, BarChart3, Bell, Tags, Plug } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile Tab Navigation */}
          <div className="lg:hidden mb-6">
            <TabsList className="grid w-full grid-cols-3 bg-card border border-border rounded-xl p-1 h-auto">
              <TabsTrigger 
                value="account" 
                className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3 px-2"
              >
                <User className="h-4 w-4" />
                <span className="text-xs font-medium">Account</span>
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3 px-2"
              >
                <Tags className="h-4 w-4" />
                <span className="text-xs font-medium">Categories</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3 px-2"
              >
                <Bell className="h-4 w-4" />
                <span className="text-xs font-medium">Alerts</span>
              </TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-2 bg-card border border-border rounded-xl p-1 h-auto mt-2">
              <TabsTrigger 
                value="integrations" 
                className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3 px-2"
              >
                <Plug className="h-4 w-4" />
                <span className="text-xs font-medium">Integrations</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3 px-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="text-xs font-medium">Reports</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Desktop Tab Navigation */}
          <TabsList className="hidden lg:grid w-full grid-cols-5 mb-8 bg-card border border-border rounded-2xl p-1 h-14">
            <TabsTrigger 
              value="account" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl py-3 px-4"
            >
              <User className="h-4 w-4" />
              <span className="font-medium">Account</span>
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl py-3 px-4"
            >
              <Tags className="h-4 w-4" />
              <span className="font-medium">Categories</span>
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl py-3 px-4"
            >
              <Plug className="h-4 w-4" />
              <span className="font-medium">Integrations</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl py-3 px-4"
            >
              <Bell className="h-4 w-4" />
              <span className="font-medium">Notifications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl py-3 px-4"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-0">
            <ProfileForm />
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <CategoriesTab />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="integrations" className="mt-0">
            <IntegrationsTab />
          </TabsContent>

          <TabsContent value="reports" className="mt-0">
            <ReportsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;

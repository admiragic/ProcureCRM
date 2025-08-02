
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { UserTable } from "@/components/admin/user-table";
import { AddUserForm } from "@/components/admin/add-user-form";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileText, UserPlus, FileUp, FileDown } from "lucide-react";
import type { User } from "@/lib/users";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useData } from '@/context/data-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditUserDialog } from '@/components/admin/edit-user-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

/**
 * Converts an array of objects into a CSV string.
 * @template T - The type of objects in the array.
 * @param {T[]} data - The array of objects to convert.
 * @param {boolean} [headerOnly=false] - If true, only the header row is returned.
 * @returns {string} The CSV formatted string.
 */
const convertToCSV = <T extends object>(data: T[], headerOnly = false): string => {
    if (data.length === 0) return '';
    
    // Filter out complex objects for CSV header
    const simpleObject = data[0];
    const header = Object.keys(simpleObject).filter(key => typeof (simpleObject as any)[key] !== 'object');

    if (headerOnly) {
        return header.join(',');
    }
    
    // Replacer function to handle null or undefined values in JSON.stringify
    const replacer = (key: string, value: any) => value === null || value === undefined ? '' : value
    let csv = data.map(row => header.map(fieldName => JSON.stringify((row as any)[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    return csv.join('\r\n');
};

/**
 * Triggers a file download for the given CSV string.
 * @param {string} csvString - The CSV content to download.
 * @param {string} filename - The name of the file to be downloaded.
 */
const downloadCSV = (csvString: string, filename: string) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};


/**
 * The main component for the Admin page.
 * It allows administrators to manage users, and import/export data.
 * @returns {React.ReactElement} The rendered admin page.
 */
export default function AdminPage() {
  const { deleteUser } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  // Fetching all necessary data from the DataContext
  const { clients, interactions, opportunities, tasks, users, setUsers, loading } = useData();

  // State for managing the user editing and deletion dialogs
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);

  /**
   * Handles the action to edit a user.
   * It sets the user to be edited and opens the edit dialog.
   * @param {User} user - The user object to be edited.
   */
  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsEditUserDialogOpen(true);
  };

  /**
   * Handles the deletion of a user.
   * It calls the deleteUser function from the AuthContext and updates the local state.
   */
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
        await deleteUser(userToDelete.id);
        // Optimistically update the UI by removing the user from the local state
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        toast({
            title: "User Deleted",
            description: `User ${userToDelete.name} has been deleted.`,
        });
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to delete user.",
            variant: "destructive",
        });
    } finally {
        setUserToDelete(null); // Close the confirmation dialog
    }
  };

  if (loading) {
    return <div>{t('login_page.loading')}</div>
  }

  /**
   * Handles the export of data to a CSV file.
   * @param {'clients' | 'interactions' | 'opportunities' | 'tasks'} dataType - The type of data to export.
   */
  const handleExport = (dataType: 'clients' | 'interactions' | 'opportunities' | 'tasks') => {
    let data: any[] = [];
    let filename = `${dataType}.csv`;

    switch (dataType) {
        case 'clients':
            data = clients;
            break;
        case 'interactions':
            data = interactions;
            break;
        case 'opportunities':
            data = opportunities;
            break;
        case 'tasks':
            data = tasks;
            break;
    }

    if (data.length > 0) {
        const csvString = convertToCSV(data);
        downloadCSV(csvString, filename);
    } else {
        toast({
            title: "Export Failed",
            description: "No data available to export.",
            variant: "destructive",
        })
    }
  };

  /**
   * Triggers the download of a CSV template for a specific data type.
   * This helps users format their data correctly for import.
   * @param {'clients' | 'opportunities' | 'interactions' | 'tasks'} dataType - The type of data for the template.
   */
  const handleDownloadTemplate = (dataType: 'clients' | 'opportunities' | 'interactions' | 'tasks') => {
    let headers: string[] = [];
    let filename = `${dataType}_template.csv`;
    
    // Define headers based on your data structure, excluding complex objects/IDs
    switch (dataType) {
        case 'clients':
            headers = ["companyName", "contactPerson", "email", "phone", "address", "industry", "status", "type"];
            break;
        case 'opportunities':
            headers = ["clientId", "stage", "value", "closingDate"];
            break;
        case 'interactions':
            headers = ["clientId", "type", "notes", "salesperson"];
            break;
        case 'tasks':
            headers = ["clientId", "title", "dueDate", "assignedTo", "status", "timeEstimate"];
            break;
    }

    downloadCSV(headers.join(','), filename);
  };
  
  /**
   * Handles the file upload event for importing data.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({ title: "No file selected", variant: "destructive" });
      return;
    }
    
    if (file.type !== 'text/csv') {
        toast({ title: "Invalid File Type", description: "Please upload a CSV file.", variant: "destructive" });
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result;
        console.log("Uploaded CSV content:\n", text);
        // Here you would parse the CSV and call the appropriate service to add data
        toast({
            title: "File Uploaded",
            description: "Check the console to see the imported data. Import logic not implemented yet.",
        });
    };
    reader.readAsText(file);
  };

  return (
    <>
      <PageHeader
        title={t('admin_page.title')}
        description="Upravljajte korisnicima i postavkama sustava."
      />
      <div className="space-y-8">
        {/* User table is displayed above the tabs */}
        <UserTable 
            data={users}
            onEdit={handleEditUser}
            onDelete={(user) => setUserToDelete(user)}
        />
        
        {/* Tabs for organizing admin actions */}
        <Tabs defaultValue="add-user">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="add-user">
              <UserPlus className="mr-2" />
              {t('admin_page.form_title')}
            </TabsTrigger>
            <TabsTrigger value="export">
              <FileDown className="mr-2" />
              Export Data
            </TabsTrigger>
            <TabsTrigger value="import">
              <FileUp className="mr-2" />
              Import Data
            </TabsTrigger>
          </TabsList>
          
          {/* Content for the "Add User" tab */}
          <TabsContent value="add-user" className="mt-6">
            <AddUserForm onUserAdded={() => { /* Data will be refreshed by onValue listener in DataContext */ }} />
          </TabsContent>
          
          {/* Content for the "Export Data" tab */}
          <TabsContent value="export" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Export Data</CardTitle>
                    <CardDescription>Download all application data as CSV files.</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button onClick={() => handleExport('clients')}>
                        <Download className="mr-2" />
                        Export Clients
                    </Button>
                    <Button onClick={() => handleExport('opportunities')}>
                        <Download className="mr-2" />
                        Export Opportunities
                    </Button>
                    <Button onClick={() => handleExport('interactions')}>
                        <Download className="mr-2" />
                        Export Interactions
                    </Button>
                    <Button onClick={() => handleExport('tasks')}>
                        <Download className="mr-2" />
                        Export Tasks
                    </Button>
                </CardContent>
            </Card>
          </TabsContent>
          
          {/* Content for the "Import Data" tab */}
          <TabsContent value="import" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>Import Data</CardTitle>
                    <CardDescription>Upload CSV files to add data to the application.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                    {/* Section for downloading CSV templates */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium">1. Download Template</h4>
                        <p className="text-sm text-muted-foreground">Start by downloading a template to ensure your data is in the correct format.</p>
                         <div className="grid sm:grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate('clients')}>
                                <FileText className="mr-2" /> Clients
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate('opportunities')}>
                                <FileText className="mr-2" /> Opportunities
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate('interactions')}>
                                <FileText className="mr-2" /> Interactions
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate('tasks')}>
                                <FileText className="mr-2" /> Tasks
                            </Button>
                        </div>
                    </div>
                    {/* Section for uploading the filled CSV file */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium">2. Upload File</h4>
                        <p className="text-sm text-muted-foreground">Once you've filled out the template, upload the CSV file here.</p>
                        <div className="flex gap-2">
                            <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="cursor-pointer" />
                        </div>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog for editing user information */}
      {userToEdit && (
        <EditUserDialog
            isOpen={isEditUserDialogOpen}
            setIsOpen={setIsEditUserDialogOpen}
            user={userToEdit}
            onUserUpdated={(updatedUser) => {
                // Optimistically update the UI
                setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
                setUserToEdit(null);
            }}
        />
      )}

      {/* Alert dialog for confirming user deletion */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user account
                for {userToDelete?.name} and remove their data from our servers.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
}

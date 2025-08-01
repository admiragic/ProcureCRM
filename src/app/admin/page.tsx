
'use client';

import { PageHeader } from "@/components/page-header";
import { UserTable } from "@/components/admin/user-table";
import { AddUserForm } from "@/components/admin/add-user-form";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileText } from "lucide-react";
import { clients, interactions, opportunities, tasks } from "@/lib/data";
import type { Client, Interaction, Opportunity, Task } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import React from "react";

// Helper function to convert array of objects to CSV
const convertToCSV = <T extends object>(data: T[], headerOnly = false): string => {
    if (data.length === 0) return '';
    
    const header = Object.keys(data[0]);
    if (headerOnly) {
        return header.join(',');
    }
    
    const replacer = (key: string, value: any) => value === null || value === undefined ? '' : (typeof value === 'object' ? JSON.stringify(value) : value)
    let csv = data.map(row => header.map(fieldName => JSON.stringify((row as any)[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    return csv.join('\r\n');
};

// Helper function to trigger CSV download
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


export default function AdminPage() {
  const { getUsers } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const users = getUsers();

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

  const handleDownloadTemplate = (dataType: 'clients' | 'opportunities' | 'interactions' | 'tasks') => {
    let headers: string[] = [];
    let filename = `${dataType}_template.csv`;

    switch (dataType) {
        case 'clients':
            headers = Object.keys(clients[0]);
            break;
        case 'opportunities':
            headers = Object.keys(opportunities[0]).filter(k => k !== 'client');
            break;
        case 'interactions':
            headers = Object.keys(interactions[0]).filter(k => k !== 'client');
            break;
        case 'tasks':
            headers = Object.keys(tasks[0]).filter(k => k !== 'client');
            break;
    }

    downloadCSV(headers.join(','), filename);
  };
  
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
        toast({
            title: "File Uploaded",
            description: "Check the console to see the imported data.",
        });
    };
    reader.readAsText(file);
  };

  return (
    <>
      <PageHeader
        title={t('admin_page.title')}
        description={t('admin_page.description')}
      />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            <UserTable data={users} />
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Export Data</CardTitle>
                        <CardDescription>Download all application data as CSV files.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4">
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
                 <Card>
                    <CardHeader>
                        <CardTitle>Import Data</CardTitle>
                        <CardDescription>Upload CSV files to add data to the application.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Download Templates</h4>
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
                        <div className="space-y-2">
                            <Label htmlFor="csv-upload" className="text-sm font-medium">Upload File</Label>
                            <div className="flex gap-2">
                                <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="cursor-pointer" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        <div>
            <AddUserForm />
        </div>
      </div>
    </>
  );
}

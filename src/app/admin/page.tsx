
'use client';

import { PageHeader } from "@/components/page-header";
import { UserTable } from "@/components/admin/user-table";
import { AddUserForm } from "@/components/admin/add-user-form";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { clients, interactions, opportunities, tasks } from "@/lib/data";
import type { Client, Interaction, Opportunity, Task } from "@/lib/types";

// Helper function to convert array of objects to CSV
const convertToCSV = <T extends object>(data: T[]): string => {
    if (data.length === 0) return '';
    
    const replacer = (key: string, value: any) => value === null || value === undefined ? '' : (typeof value === 'object' ? JSON.stringify(value) : value)
    const header = Object.keys(data[0]);
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
        alert('No data to export.');
    }
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
            <Card>
                <CardHeader>
                    <CardTitle>Export Data</CardTitle>
                    <CardDescription>Download all application data as CSV files.</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button onClick={() => handleExport('clients')}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Clients
                    </Button>
                    <Button onClick={() => handleExport('opportunities')}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Opportunities
                    </Button>
                    <Button onClick={() => handleExport('interactions')}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Interactions
                    </Button>
                    <Button onClick={() => handleExport('tasks')}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Tasks
                    </Button>
                </CardContent>
            </Card>
        </div>
        <div>
            <AddUserForm />
        </div>
      </div>
    </>
  );
}

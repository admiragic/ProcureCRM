
'use client';

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { PlusCircle } from "lucide-react";
import { ClientTable } from "@/components/client-table";
import Link from "next/link";
import { useData } from "@/context/data-context";
import { useLanguage } from "@/context/language-context";

/**
 * The main page for displaying and managing clients.
 * It shows a list of clients in a table and provides a button to add a new client.
 * @returns {React.ReactElement} The rendered clients page.
 */
export default function ClientsPage() {
  // Fetching clients data and loading state from the DataContext
  const { clients, loading } = useData();
  const { t } = useLanguage();

  // Display a loading indicator while data is being fetched
  if (loading) {
    return <div>{t('login_page.loading')}</div>
  }

  return (
    <>
      <PageHeader
        title="Klijenti"
        description="Upravljajte svojim potencijalnim klijentima, izgledima i kupcima."
      >
        <Button asChild>
          <Link href="/clients/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Dodaj klijenta
          </Link>
        </Button>
      </PageHeader>
      {/* The ClientTable component is responsible for rendering the list of clients */}
      <ClientTable data={clients} />
    </>
  );
}


'use client';

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { PlusCircle } from "lucide-react";
import { ClientTable } from "@/components/client-table";
import Link from "next/link";
import { useData } from "@/context/data-context";
import { useLanguage } from "@/context/language-context";

export default function ClientsPage() {
  const { clients, loading } = useData();
  const { t } = useLanguage();

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
      <ClientTable data={clients} />
    </>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { PlusCircle } from "lucide-react";
import { getClients } from "@/services/clientService";
import { ClientTable } from "@/components/client-table";
import Link from "next/link";
import type { Client } from '@/lib/types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      const clientsData = await getClients();
      setClients(clientsData);
      setLoading(false);
    }
    fetchClients();
  }, []);

  if (loading) return <div>Loading...</div>;

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

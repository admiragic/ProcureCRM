import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { PlusCircle } from "lucide-react";
import { clients } from "@/lib/data";
import { ClientTable } from "@/components/client-table";
import Link from "next/link";

export default function ClientsPage() {
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

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { PlusCircle } from "lucide-react";
import { clients } from "@/lib/data";
import { ClientTable } from "@/components/client-table";

export default function ClientsPage() {
  return (
    <>
      <PageHeader
        title="Clients"
        description="Manage your leads, prospects, and customers."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </PageHeader>
      <ClientTable data={clients} />
    </>
  );
}

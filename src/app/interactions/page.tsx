import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { PlusCircle } from "lucide-react";
import { interactions } from "@/lib/data";
import { InteractionTable } from "@/components/interaction-table";

export default function InteractionsPage() {
  return (
    <>
      <PageHeader
        title="Interactions"
        description="Log every call, email, meeting, and demo."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Interaction
        </Button>
      </PageHeader>
      <InteractionTable data={interactions} />
    </>
  );
}

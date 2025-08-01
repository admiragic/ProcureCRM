import { PageHeader } from "@/components/page-header";
import { ClientForm } from "@/components/client-form";

export default function NewClientPage() {
  return (
    <>
      <PageHeader
        title="Novi klijent"
        description="Ispunite obrazac za dodavanje novog klijenta."
      />
      <ClientForm />
    </>
  );
}

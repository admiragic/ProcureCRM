import { PageHeader } from "@/components/page-header";
import { ClientForm } from "@/components/client-form";
import { useLanguage } from "@/context/language-context";

export default function NewClientPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageHeader
        title={t('client_form.add_title')}
        description={t('client_form.add_description')}
      />
      <ClientForm />
    </>
  );
}

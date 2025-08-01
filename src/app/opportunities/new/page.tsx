import { PageHeader } from "@/components/page-header";
import { OpportunityForm } from "@/components/opportunity-form";
import { useLanguage } from "@/context/language-context";


export default function NewOpportunityPage() {
    const { t } = useLanguage();
  return (
    <>
      <PageHeader
        title={t('opportunity_form.add_title')}
        description={t('opportunity_form.add_description')}
      />
      <OpportunityForm />
    </>
  );
}

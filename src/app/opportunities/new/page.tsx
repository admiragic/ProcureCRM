
'use client';

import { PageHeader } from "@/components/page-header";
import { OpportunityForm } from "@/components/opportunity-form";
import { useLanguage } from "@/context/language-context";

/**
 * The page component for creating a new sales opportunity.
 * It renders the page header and the opportunity form.
 * @returns {React.ReactElement} The rendered page.
 */
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

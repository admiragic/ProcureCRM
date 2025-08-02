
'use client';

import { PageHeader } from "@/components/page-header";
import { InteractionForm } from "@/components/interaction-form";
import { useLanguage } from "@/context/language-context";

/**
 * The page component for logging a new interaction.
 * It renders the page header and the interaction form.
 * @returns {React.ReactElement} The rendered page.
 */
export default function NewInteractionPage() {
    const { t } = useLanguage();
  return (
    <>
      <PageHeader
        title={t('interaction_form.add_title')}
        description={t('interaction_form.add_description')}
      />
      <InteractionForm />
    </>
  );
}

import { PageHeader } from "@/components/page-header";
import { InteractionForm } from "@/components/interaction-form";
import { useLanguage } from "@/context/language-context";

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

import { PageHeader } from "@/components/page-header";
import { EmailGeneratorForm } from "@/components/email-generator-form";

export default function AiEmailGeneratorPage() {
  return (
    <>
      <PageHeader
        title="AI-Powered Email Suggestions"
        description="Generate a personalized follow-up email based on client data."
      />
      <EmailGeneratorForm />
    </>
  );
}

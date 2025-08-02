/**
 * @file This file defines the page component for the AI Email Generator tool.
 * It renders the page header and the main form for generating emails.
 */

import { PageHeader } from "@/components/page-header";
import { EmailGeneratorForm } from "@/components/email-generator-form";

/**
 * The page component for the AI Email Generator.
 * @returns {React.ReactElement} The rendered page.
 */
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

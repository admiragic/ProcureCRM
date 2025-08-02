
'use client';

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { PlusCircle } from "lucide-react";
import { InteractionTable } from "@/components/interaction-table";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useData } from "@/context/data-context";

/**
 * The main page for displaying and managing client interactions.
 * It shows a list of interactions in a table and provides a button to log a new one.
 * @returns {React.ReactElement} The rendered interactions page.
 */
export default function InteractionsPage() {
  const { t } = useLanguage();
  // Fetching interactions data and loading state from the DataContext
  const { interactions, loading } = useData();

  // Display a loading indicator while data is being fetched
  if (loading) {
    return <div>{t('login_page.loading')}</div>
  }

  return (
    <>
      <PageHeader
        title={t('sidebar.interactions')}
        description={t('interactions_page.description')}
      >
        <Button asChild>
          <Link href="/interactions/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('interactions_page.add_button')}
          </Link>
        </Button>
      </PageHeader>
      {/* The InteractionTable component is responsible for rendering the list of interactions */}
      <InteractionTable data={interactions} />
    </>
  );
}

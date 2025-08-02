
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { PlusCircle } from "lucide-react";
import { getInteractions } from "@/services/interactionService";
import { InteractionTable } from "@/components/interaction-table";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import type { Interaction } from "@/lib/types";

export default function InteractionsPage() {
  const { t } = useLanguage();
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  useEffect(() => {
    const fetchInteractions = async () => {
      const interactionsData = await getInteractions();
      setInteractions(interactionsData);
    };
    fetchInteractions();
  }, []);

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
      <InteractionTable data={interactions} />
    </>
  );
}


'use client';

import { PageHeader } from "@/components/page-header";
import { TaskForm } from "@/components/task-form";
import { useLanguage } from "@/context/language-context";

/**
 * The page component for creating a new task.
 * It renders the page header and the task form.
 * @returns {React.ReactElement} The rendered page.
 */
export default function NewTaskPage() {
    const { t } = useLanguage();
  return (
    <>
      <PageHeader
        title={t('task_form.add_title')}
        description={t('task_form.add_description')}
      />
      <TaskForm />
    </>
  );
}

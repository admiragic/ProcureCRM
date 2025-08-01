
'use client';

import { PageHeader } from "@/components/page-header";
import { TaskForm } from "@/components/task-form";
import { useLanguage } from "@/context/language-context";

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

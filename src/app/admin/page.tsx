
'use client';

import { PageHeader } from "@/components/page-header";
import { UserTable } from "@/components/admin/user-table";
import { AddUserForm } from "@/components/admin/add-user-form";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

export default function AdminPage() {
  const { getUsers } = useAuth();
  const { t } = useLanguage();
  const users = getUsers();

  return (
    <>
      <PageHeader
        title={t('admin_page.title')}
        description={t('admin_page.description')}
      />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <UserTable data={users} />
        </div>
        <div>
            <AddUserForm />
        </div>
      </div>
    </>
  );
}

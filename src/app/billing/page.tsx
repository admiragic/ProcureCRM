
'use client';

import { PageHeader } from "@/components/page-header";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function BillingPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader
        title={t('user_nav.billing')}
        description="Manage your subscription and view payment history."
      />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the Professional plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="border rounded-lg p-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">Professional</h3>
                    <p><span className="text-4xl font-bold">$99</span>/month</p>
                </div>
                <p className="text-muted-foreground mt-2">Our most popular plan for growing teams.</p>
                <ul className="mt-6 space-y-3">
                    <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Up to 10 users</span>
                    </li>
                     <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Unlimited Clients & Opportunities</span>
                    </li>
                     <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>AI Email Generation</span>
                    </li>
                     <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Advanced Reporting</span>
                    </li>
                </ul>
            </div>
            <div className="flex justify-between items-center">
                <Button variant="outline">Cancel Subscription</Button>
                <Button>Upgrade Plan</Button>
            </div>
        </CardContent>
      </Card>
    </>
  );
}

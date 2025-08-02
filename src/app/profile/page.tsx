
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

/**
 * The user profile page.
 * It displays user information and provides a form to change the password.
 * @returns {React.ReactElement | null} The rendered profile page, or null if user is not available.
 */
export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  // Zod schema for password change form validation
  const profileFormSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required." }),
    newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
  });

  type ProfileFormValues = z.infer<typeof profileFormSchema>;

  // Initialize react-hook-form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  /**
   * Handles the submission of the change password form.
   * @param {ProfileFormValues} values - The form values.
   */
  const onSubmit = (values: ProfileFormValues) => {
    // This is a mock implementation. In a real app, you'd call an API
    // that securely verifies the current password and updates it.
    console.log("Changing password for:", user?.username, "with values:", values);
    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed.",
    });
    form.reset();
  };

  // If the user data is not yet available, don't render anything.
  if (!user) return null;

  return (
    <>
      <PageHeader
        title={t('user_nav.profile')}
        description="View and manage your profile details."
      />
      <div className="grid gap-8 md:grid-cols-3">
        {/* User Information Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground"><strong>{t('admin_page.table_role')}:</strong> <span className="capitalize">{user.role}</span></p>
            </CardContent>
          </Card>
        </div>
        {/* Change Password Card */}
        <div className="md:col-span-2">
           <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Enter your current and new password to update it.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                    <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                    <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                <Button type="submit">
                                    <Save className="mr-2 h-4 w-4" />
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
           </Card>
        </div>
      </div>
    </>
  );
}

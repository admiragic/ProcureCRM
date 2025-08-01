
"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

export function AddUserForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { addUser } = useAuth();

  const userFormSchema = z.object({
    name: z.string().min(2, "Name is required."),
    email: z.string().email("Invalid email address."),
    username: z.string().min(4, "Username must be at least 4 characters."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    role: z.enum(["admin", "user"]),
  });
  
  type UserFormValues = z.infer<typeof userFormSchema>;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
        name: "",
        email: "",
        username: "",
        password: "",
        role: "user",
    },
  });

  function onSubmit(values: UserFormValues) {
    addUser({
        ...values,
        id: '' // ID will be generated in auth context
    });
    toast({
        title: t('admin_page.toast_success_title'),
        description: t('admin_page.toast_success_description', { name: values.name }),
    });
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin_page.form_title')}</CardTitle>
        <CardDescription>
          {t('admin_page.form_description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin_page.form_name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('admin_page.form_name_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin_page.form_email')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('admin_page.form_email_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin_page.form_username')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('admin_page.form_username_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin_page.form_password')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin_page.form_role')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">{t('admin_page.form_role_user')}</SelectItem>
                        <SelectItem value="admin">{t('admin_page.form_role_admin')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="flex justify-end pt-4">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {t('admin_page.form_save_button')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


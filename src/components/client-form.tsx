
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
import { addClient } from "@/services/clientService";
import { useRouter } from "next/navigation";

/**
 * A form component for creating or editing a client.
 * It uses react-hook-form for form state management and Zod for validation.
 * @returns {React.ReactElement} The rendered client form.
 */
export function ClientForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  // Zod schema for client form validation, with localized error messages.
  const clientFormSchema = z.object({
    companyName: z.string().min(2, t('client_form.company_name_required')),
    contactPerson: z.string().min(2, t('client_form.contact_person_required')),
    email: z.string().email(t('client_form.email_invalid')),
    phone: z.string().min(6, t('client_form.phone_required')),
    address: z.string().min(5, t('client_form.address_required')),
    industry: z.string().min(2, t('client_form.industry_required')),
    type: z.enum(["lead", "prospect", "customer"]),
    status: z.enum(["active", "inactive", "archived"]),
  });
  
  type ClientFormValues = z.infer<typeof clientFormSchema>;

  // Initialize the form with react-hook-form.
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      industry: "",
      type: "lead",
      status: "active",
    },
  });

  /**
   * Handles the form submission.
   * It calls the `addClient` service, shows a toast notification, and redirects on success.
   * @param {ClientFormValues} values - The validated form values.
   */
  async function onSubmit(values: ClientFormValues) {
    try {
      await addClient(values);
      toast({
          title: t('client_form.toast_success_title'),
          description: t('client_form.toast_success_description', { companyName: values.companyName }),
      });
      router.push('/clients'); // Redirect to the client list page
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save client.",
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('client_form.title')}</CardTitle>
        <CardDescription>
          {t('client_form.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client_form.company_name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('client_form.company_name_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client_form.contact_person')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('client_form.contact_person_placeholder')} {...field} />
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
                    <FormLabel>{t('client_form.email')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('client_form.email_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client_form.phone')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('client_form.phone_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client_form.address')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('client_form.address_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client_form.industry')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('client_form.industry_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client_form.type')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('client_form.select_type')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lead">{t('client_form.lead')}</SelectItem>
                        <SelectItem value="prospect">{t('client_form.prospect')}</SelectItem>
                        <SelectItem value="customer">{t('client_form.customer')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client_form.status')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('client_form.select_status')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">{t('client_form.active')}</SelectItem>
                        <SelectItem value="inactive">{t('client_form.inactive')}</SelectItem>
                        <SelectItem value="archived">{t('client_form.archived')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {t('client_form.save_button')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

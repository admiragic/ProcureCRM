
"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { getClients } from "@/services/clientService";
import { addInteraction } from "@/services/interactionService";
import type { Client } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function InteractionForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const clientsData = await getClients();
      setClients(clientsData);
    };
    fetchClients();
  }, []);

  const interactionFormSchema = z.object({
    clientId: z.string().min(1, t('interaction_form.client_required')),
    type: z.enum(["call", "email", "meeting", "demo"]),
    salesperson: z.string().min(2, t('interaction_form.salesperson_required')),
    notes: z.string().min(10, t('interaction_form.notes_required')),
  });
  
  type InteractionFormValues = z.infer<typeof interactionFormSchema>;

  const form = useForm<InteractionFormValues>({
    resolver: zodResolver(interactionFormSchema),
    defaultValues: {
      clientId: "",
      type: "email",
      salesperson: "",
      notes: ""
    },
  });

  async function onSubmit(values: InteractionFormValues) {
    try {
        await addInteraction(values);
        toast({
            title: t('interaction_form.toast_success_title'),
            description: t('interaction_form.toast_success_description'),
        });
        router.push('/interactions');
    } catch(e) {
        toast({
            title: "Error",
            description: "Failed to save interaction.",
            variant: "destructive"
        })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('interaction_form.title')}</CardTitle>
        <CardDescription>{t('interaction_form.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('interaction_form.client')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('interaction_form.select_client')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>{client.companyName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('interaction_form.type')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('interaction_form.select_type')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="call">{t('interaction_form.type_call')}</SelectItem>
                        <SelectItem value="email">{t('interaction_form.type_email')}</SelectItem>
                        <SelectItem value="meeting">{t('interaction_form.type_meeting')}</SelectItem>
                        <SelectItem value="demo">{t('interaction_form.type_demo')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesperson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('interaction_form.salesperson')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('interaction_form.salesperson_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <div className="md:col-span-2">
                 <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('interaction_form.notes')}</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder={t('interaction_form.notes_placeholder')}
                            className="resize-none"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {t('interaction_form.save_button')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

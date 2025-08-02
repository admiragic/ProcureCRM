
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, CalendarIcon } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import type { Client } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { addOpportunity } from "@/services/opportunityService";
import { useRouter } from "next/navigation";
import { useData } from "@/context/data-context";

export function OpportunityForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const { clients } = useData();

  const opportunityFormSchema = z.object({
    clientId: z.string().min(1, t('opportunity_form.client_required')),
    stage: z.enum(["lead", "prospecting", "proposal", "negotiation", "won", "lost"]),
    value: z.coerce.number().min(0, t('opportunity_form.value_required')),
    closingDate: z.date({
        required_error: t('opportunity_form.closing_date_required'),
    }),
  });
  
  type OpportunityFormValues = z.infer<typeof opportunityFormSchema>;

  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: {
      clientId: "",
      stage: "lead",
      value: 0,
    },
  });

  async function onSubmit(values: OpportunityFormValues) {
    try {
      await addOpportunity({
        ...values,
        closingDate: format(values.closingDate, 'yyyy-MM-dd')
      });
      toast({
          title: t('opportunity_form.toast_success_title'),
          description: t('opportunity_form.toast_success_description'),
      });
      router.push('/opportunities');
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to save opportunity.",
            variant: "destructive"
        })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('opportunity_form.title')}</CardTitle>
        <CardDescription>{t('opportunity_form.description')}</CardDescription>
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
                    <FormLabel>{t('opportunity_form.client')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('opportunity_form.select_client')} />
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
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('opportunity_form.stage')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('opportunity_form.select_stage')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lead">{t('opportunity_form.stage_lead')}</SelectItem>
                        <SelectItem value="prospecting">{t('opportunity_form.stage_prospecting')}</SelectItem>
                        <SelectItem value="proposal">{t('opportunity_form.stage_proposal')}</SelectItem>
                        <SelectItem value="negotiation">{t('opportunity_form.stage_negotiation')}</SelectItem>
                        <SelectItem value="won">{t('opportunity_form.stage_won')}</SelectItem>
                        <SelectItem value="lost">{t('opportunity_form.stage_lost')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('opportunity_form.value')}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="closingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('opportunity_form.closing_date')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t('opportunity_form.pick_a_date')}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {t('opportunity_form.save_button')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

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

const clientFormSchema = z.object({
  companyName: z.string().min(2, "Naziv tvrtke je obavezan."),
  contactPerson: z.string().min(2, "Kontakt osoba je obavezna."),
  email: z.string().email("Neispravna email adresa."),
  phone: z.string().min(6, "Broj telefona je obavezan."),
  address: z.string().min(5, "Adresa je obavezna."),
  industry: z.string().min(2, "Industrija je obavezna."),
  type: z.enum(["lead", "prospect", "customer"]),
  status: z.enum(["active", "inactive", "archived"]),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

export function ClientForm() {
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

  function onSubmit(values: ClientFormValues) {
    console.log(values);
    // TODO: Implement saving logic
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Podaci o klijentu</CardTitle>
        <CardDescription>
          Unesite detalje i kliknite na spremi.
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
                    <FormLabel>Naziv tvrtke</FormLabel>
                    <FormControl>
                      <Input placeholder="npr. Inovacije d.o.o." {...field} />
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
                    <FormLabel>Kontakt osoba</FormLabel>
                    <FormControl>
                      <Input placeholder="npr. Ana Horvat" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="npr. ana.h@inovacije.com" {...field} />
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
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input placeholder="npr. 123-456-7890" {...field} />
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
                    <FormLabel>Adresa</FormLabel>
                    <FormControl>
                      <Input placeholder="npr. Tehnološki park 123, Zagreb" {...field} />
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
                    <FormLabel>Industrija</FormLabel>
                    <FormControl>
                      <Input placeholder="npr. Tehnologija" {...field} />
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
                    <FormLabel>Tip</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Odaberite tip klijenta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lead">Potencijalni klijent</SelectItem>
                        <SelectItem value="prospect">Izgled</SelectItem>
                        <SelectItem value="customer">Kupac</SelectItem>
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
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Odaberite status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Aktivan</SelectItem>
                        <SelectItem value="inactive">Neaktivan</SelectItem>
                        <SelectItem value="archived">Arhiviran</SelectItem>
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
                Spremi klijenta
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

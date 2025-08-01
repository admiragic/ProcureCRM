
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
import { Save, CalendarIcon, Upload, X, Paperclip } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { clients } from "@/lib/data";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useRef } from "react";

export function TaskForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const taskFormSchema = z.object({
    title: z.string().min(5, t('task_form.title_required')),
    clientId: z.string().nullable(),
    assignedTo: z.string().min(2, t('task_form.assigned_to_required')),
    dueDate: z.date({
        required_error: t('task_form.due_date_required'),
    }),
  });
  
  type TaskFormValues = z.infer<typeof taskFormSchema>;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      clientId: null,
      assignedTo: ""
    },
  });

  function onSubmit(values: TaskFormValues) {
    console.log({ ...values, files });
     toast({
        title: t('task_form.toast_success_title'),
        description: t('task_form.toast_success_description'),
    });
    setFiles([]);
    form.reset();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('task_form.title')}</CardTitle>
        <CardDescription>{t('task_form.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('task_form.task_title')}</FormLabel>
                        <FormControl>
                        <Input placeholder={t('task_form.title_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
               <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('task_form.client')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('task_form.select_client')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">{t('task_form.no_client')}</SelectItem>
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
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('task_form.assigned_to')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('task_form.assigned_to_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('task_form.due_date')}</FormLabel>
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
                              <span>{t('task_form.pick_a_date')}</span>
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormLabel>Documents</FormLabel>
                <div className="mt-2 flex flex-col gap-4">
                  <Input 
                    type="file" 
                    multiple 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Button>
                  {files.length > 0 && (
                    <div className="space-y-2 rounded-md border p-2">
                      <p className="text-sm font-medium">Attached Files:</p>
                      <ul className="divide-y divide-border">
                        {files.map((file, index) => (
                          <li key={index} className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-2">
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{file.name}</span>
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFile(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {t('task_form.save_button')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

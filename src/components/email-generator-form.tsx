"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateFollowUpEmail,
  GenerateFollowUpEmailOutput,
} from '@/ai/flows/generate-follow-up-email';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Clipboard, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  clientName: z.string().min(2, 'Client name is required.'),
  recentInteractions: z.string().min(10, 'Please describe recent interactions.'),
  opportunityStage: z.enum(['lead', 'prospect', 'customer']),
  assignedSalesperson: z.string().min(2, 'Salesperson name is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function EmailGeneratorForm() {
  const [result, setResult] = useState<GenerateFollowUpEmailOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      recentInteractions: '',
      opportunityStage: 'prospect',
      assignedSalesperson: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateFollowUpEmail(values);
      setResult(response);
    } catch (error) {
      console.error('Error generating email:', error);
      // You could add a toast notification here
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCopy = () => {
    if (result?.emailContent) {
      navigator.clipboard.writeText(result.emailContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>Provide details to personalize the email.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe from Innovate Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="opportunityStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opportunity Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="prospect">Prospect</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recentInteractions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recent Interactions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Had a 30-min demo call yesterday, they were interested in feature X..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignedSalesperson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Salesperson</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                    'Generating...'
                ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" /> Generate Email
                    </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Generated Email</CardTitle>
                <CardDescription>Review and copy the AI-generated content.</CardDescription>
            </div>
            {result && (
                 <Button variant="outline" size="icon" onClick={handleCopy}>
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                </Button>
            )}
        </CardHeader>
        <CardContent>
            {isLoading && (
                <div className="space-y-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-full mt-4" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            )}
            {!isLoading && result && (
                <Textarea
                    readOnly
                    value={result.emailContent}
                    className="h-80 resize-none font-code text-sm"
                />
            )}
            {!isLoading && !result && (
                 <div className="flex items-center justify-center h-80 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Your generated email will appear here.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

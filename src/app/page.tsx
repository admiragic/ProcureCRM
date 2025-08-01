
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PageHeader } from "@/components/page-header";
import { getClients } from '@/services/clientService';
import { getOpportunities } from '@/services/opportunityService';
import { getTasks } from '@/services/taskService';
import { getInteractions } from '@/services/interactionService';
import type { Client, Opportunity, Task, Interaction } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign, Users, Briefcase, Activity, CheckCircle, Clock } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { useLanguage } from "@/context/language-context";

export default function DashboardPage() {
  const { t } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [clientsData, opportunitiesData, tasksData, interactionsData] = await Promise.all([
        getClients(),
        getOpportunities(),
        getTasks(),
        getInteractions(),
      ]);
      setClients(clientsData);
      setOpportunities(opportunitiesData);
      setTasks(tasksData);
      setInteractions(interactionsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalClients = clients.length;
  const activeDeals = opportunities.filter(o => o.stage !== 'won' && o.stage !== 'lost').length;
  const totalRevenue = opportunities.filter(o => o.stage === 'won').reduce((sum, o) => sum + o.value, 0);
  const overdueTasks = tasks.filter(t => t.status !== 'closed' && new Date(t.dueDate) < new Date()).length;

  const opportunitiesByStage = opportunities.reduce((acc, opp) => {
    const stage = opp.stage.charAt(0).toUpperCase() + opp.stage.slice(1);
    const existing = acc.find(item => item.stage === stage);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ stage, count: 1 });
    }
    return acc;
  }, [] as { stage: string, count: number }[]);

  const chartConfig = {
    count: {
      label: "Deals",
      color: "hsl(var(--primary))",
    },
  };
  
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <PageHeader title={t('dashboard.title')} description={t('dashboard.description')} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.total_revenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} EUR</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.from_all_won_deals')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.clients')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.total_managed_clients')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.active_deals')}</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.opportunities_in_pipeline')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.overdue_tasks')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.require_immediate_attention')}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>{t('dashboard.sales_overview')}</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
               <BarChart accessibilityLayer data={opportunitiesByStage} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="stage" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t('dashboard.upcoming_tasks')}</CardTitle>
            <CardDescription>{t('dashboard.tasks_due_in_next_7_days')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.filter(t => t.status !== 'closed').slice(0, 4).map(task => (
                <div key={task.id} className="flex items-center">
                  {task.status === 'closed' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{t('dashboard.due_date', { date: format(parseISO(task.dueDate), 'dd.MM.yyyy') })}</p>
                  </div>
                  <div className="ml-auto font-medium text-sm">{task.client?.companyName}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
       <div className="grid gap-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.recent_activity')}</CardTitle>
              <CardDescription>{t('dashboard.log_of_recent_client_interactions')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Klijent</TableHead>
                    <TableHead>Vrsta</TableHead>
                    <TableHead>Prodavač</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead className="text-right">Bilješke</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interactions.slice(0,5).map(interaction => (
                     <TableRow key={interaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                             <AvatarImage src={`https://avatar.vercel.sh/${interaction.client?.email}.png`} alt={interaction.client?.contactPerson} />
                            <AvatarFallback>{interaction.client?.companyName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{interaction.client?.companyName}</div>
                            <div className="text-xs text-muted-foreground">{interaction.client?.contactPerson}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{interaction.type}</Badge>
                      </TableCell>
                      <TableCell>{interaction.salesperson}</TableCell>
                      <TableCell>{format(parseISO(interaction.date), "dd.MM.yyyy")}</TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs truncate max-w-xs">{interaction.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      </div>
    </>
  );
}

'use client';

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
import { clients, opportunities, tasks, interactions } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign, Users, Briefcase, Activity, CheckCircle, Clock } from "lucide-react";
import { format, parseISO } from 'date-fns';

export default function DashboardPage() {
  const totalClients = clients.length;
  const activeDeals = opportunities.filter(o => o.stage !== 'won' && o.stage !== 'lost').length;
  const totalRevenue = opportunities.filter(o => o.stage === 'won').reduce((sum, o) => sum + o.value, 0);
  const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length;

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

  return (
    <>
      <PageHeader title="Nadzorna ploča" description="Dobrodošli natrag, evo pregleda vaše prodaje." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ukupni prihod</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Od svih dobivenih poslova</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Klijenti</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">Ukupno upravljanih klijenata</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktivni poslovi</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals}</div>
            <p className="text-xs text-muted-foreground">Prilike u pripremi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zakašnjeli zadaci</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">Zahtijevaju hitnu pažnju</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Prodajni lijevak</CardTitle>
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
            <CardTitle>Nadolazeći zadaci</CardTitle>
            <CardDescription>Zadaci koji dospijevaju u sljedećih 7 dana.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.filter(t => !t.completed).slice(0, 4).map(task => (
                <div key={task.id} className="flex items-center">
                  {task.completed ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{task.title}</p>
                    <p className="text-sm text-muted-foreground">Rok: {format(parseISO(task.dueDate), 'dd.MM.yyyy')}</p>
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
              <CardTitle>Nedavna aktivnost</CardTitle>
              <CardDescription>Zapis posljednjih interakcija s klijentima.</CardDescription>
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

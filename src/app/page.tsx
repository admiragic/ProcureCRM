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
      <PageHeader title="Dashboard" description="Welcome back, here's your sales overview." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all won deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">Total managed clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals}</div>
            <p className="text-xs text-muted-foreground">Opportunities in pipeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Opportunities Pipeline</CardTitle>
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
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks due in the next 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.filter(t => !t.completed).slice(0, 4).map(task => (
                <div key={task.id} className="flex items-center">
                  {task.completed ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{task.title}</p>
                    <p className="text-sm text-muted-foreground">Due: {format(parseISO(task.dueDate), 'MMM dd, yyyy')}</p>
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
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>A log of the latest interactions with clients.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Salesperson</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Notes</TableHead>
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
                      <TableCell>{format(parseISO(interaction.date), "MMM dd, yyyy")}</TableCell>
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
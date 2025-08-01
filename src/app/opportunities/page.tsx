import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { opportunities } from "@/lib/data";
import { PlusCircle, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import type { Opportunity } from "@/lib/types";

const stageProgress: Record<Opportunity['stage'], number> = {
  lead: 10,
  prospecting: 25,
  proposal: 50,
  negotiation: 75,
  won: 100,
  lost: 100,
};

const stageColor: Record<Opportunity['stage'], string> = {
    lead: "bg-gray-500",
    prospecting: "bg-blue-500",
    proposal: "bg-purple-500",
    negotiation: "bg-yellow-500",
    won: "bg-green-500",
    lost: "bg-red-500",
}

export default function OpportunitiesPage() {
  return (
    <>
      <PageHeader
        title="Opportunities"
        description="Track your deals and sales pipeline."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Opportunity
        </Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {opportunities.map((opp) => (
          <Card key={opp.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{opp.client?.companyName}</CardTitle>
                    <CardDescription>Value: ${opp.value.toLocaleString()}</CardDescription>
                  </div>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Client</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <Badge variant={opp.stage === 'won' ? 'default' : (opp.stage === 'lost' ? 'destructive' : 'secondary')} className="capitalize">{opp.stage}</Badge>
                <span className="text-sm text-muted-foreground">{stageProgress[opp.stage]}%</span>
              </div>
              <Progress value={stageProgress[opp.stage]} aria-label={`${stageProgress[opp.stage]}% complete`} />
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Est. Close Date: {format(parseISO(opp.closingDate), "MMM dd, yyyy")}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

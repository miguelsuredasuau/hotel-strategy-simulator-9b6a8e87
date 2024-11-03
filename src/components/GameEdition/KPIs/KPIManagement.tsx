import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialKPIs } from "./FinancialKPIs";
import { OperationalKPIs } from "./OperationalKPIs";

interface KPIManagementProps {
  gameId: string;
}

export const KPIManagement = ({ gameId }: KPIManagementProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KPI Management</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <FinancialKPIs gameId={gameId} />
          <OperationalKPIs gameId={gameId} />
        </CardContent>
      </Card>
    </div>
  );
};
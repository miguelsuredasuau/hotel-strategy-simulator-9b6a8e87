import { KPI } from "@/types/kpi";
import { Separator } from "@/components/ui/separator";
import FinancialMetric from "./FinancialMetric";

interface FinancialStatementSectionProps {
  kpis: KPI[];
  onEdit: (kpi: KPI) => void;
  onDelete: (kpi: KPI) => void;
}

const FinancialStatementSection = ({ kpis, onEdit, onDelete }: FinancialStatementSectionProps) => {
  // Helper function to find KPI by name pattern
  const findKPI = (pattern: string) => 
    kpis.find(kpi => kpi.name.toLowerCase().includes(pattern.toLowerCase()));

  // Calculate derived values
  const rooms = findKPI('rooms')?.default_value || 0;
  const occupiedRooms = findKPI('occupied')?.default_value || 0;
  const adr = findKPI('adr')?.default_value || 0;
  const extras = findKPI('extras')?.default_value || 0;
  
  const revenue = (occupiedRooms * adr) + extras;
  const variableCostsPercent = findKPI('variable costs percentage')?.default_value || 0;
  const variableCosts = revenue * (variableCostsPercent / 100);
  const fixedCosts = findKPI('fixed costs')?.default_value || 0;
  const operatingProfit = revenue - variableCosts - fixedCosts;
  const investments = findKPI('investments')?.default_value || 0;
  const freeCashFlow = operatingProfit - investments;

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg text-center border-b pb-2">Financial Statement</h3>
      
      {/* Operational Metrics */}
      <div className="space-y-3">
        <FinancialMetric 
          label="Number of Rooms"
          kpi={findKPI('rooms')}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <FinancialMetric 
          label="Occupied Rooms"
          kpi={findKPI('occupied')}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <FinancialMetric 
          label="Average Daily Rate (ADR)"
          kpi={findKPI('adr')}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <FinancialMetric 
          label="Extras Revenue"
          kpi={findKPI('extras')}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <Separator />

      {/* Revenue */}
      <div className="space-y-3">
        <FinancialMetric 
          label="Total Revenue"
          value={revenue}
          isEditable={false}
          className="font-semibold"
        />
      </div>

      <Separator />

      {/* Costs */}
      <div className="space-y-3">
        <FinancialMetric 
          label="Variable Costs %"
          kpi={findKPI('variable costs percentage')}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <FinancialMetric 
          label="Variable Costs Amount"
          value={variableCosts}
          isEditable={false}
        />
        <FinancialMetric 
          label="Fixed Costs"
          kpi={findKPI('fixed costs')}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <Separator />

      {/* Profits */}
      <div className="space-y-3">
        <FinancialMetric 
          label="Operating Profit"
          value={operatingProfit}
          isEditable={false}
          className="font-semibold"
        />
        <FinancialMetric 
          label="Investments"
          kpi={findKPI('investments')}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <FinancialMetric 
          label="Free Cash Flow"
          value={freeCashFlow}
          isEditable={false}
          className="font-semibold text-hotel-primary"
        />
      </div>
    </div>
  );
};

export default FinancialStatementSection;
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

  // Get customizable values
  const rooms = findKPI('rooms');
  const occupiedRooms = findKPI('occupied');
  const adr = findKPI('adr');
  const extras = findKPI('extras');
  const variableCostsPercent = findKPI('variable costs percentage');
  const fixedCosts = findKPI('fixed costs');
  const investments = findKPI('investments');

  // Calculate derived values
  const roomsValue = rooms?.default_value || 0;
  const occupiedRoomsValue = Math.min(occupiedRooms?.default_value || 0, roomsValue);
  const adrValue = adr?.default_value || 0;
  const extrasValue = extras?.default_value || 0;
  
  const roomRevenue = occupiedRoomsValue * adrValue;
  const totalRevenue = roomRevenue + extrasValue;
  
  const variableCostsPercentValue = variableCostsPercent?.default_value || 0;
  const variableCostsAmount = totalRevenue * (variableCostsPercentValue / 100);
  const fixedCostsValue = fixedCosts?.default_value || 0;
  
  const operatingProfit = totalRevenue - variableCostsAmount - fixedCostsValue;
  const investmentsValue = investments?.default_value || 0;
  const freeCashFlow = operatingProfit - investmentsValue;

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg text-center border-b pb-2">Financial Statement</h3>
      
      <div className="grid gap-3">
        {/* Customizable Inputs */}
        <FinancialMetric 
          label="Number of Rooms"
          kpi={rooms}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <FinancialMetric 
          label="Occupied Rooms"
          kpi={occupiedRooms}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <FinancialMetric 
          label="ADR"
          kpi={adr}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <FinancialMetric 
          label="Extras Revenue"
          kpi={extras}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <Separator />

        {/* Revenue Section */}
        <FinancialMetric 
          label="Room Revenue"
          value={roomRevenue}
          isEditable={false}
        />
        <FinancialMetric 
          label="Total Revenue"
          value={totalRevenue}
          isEditable={false}
          className="font-semibold"
        />

        <Separator />

        {/* Costs Section */}
        <FinancialMetric 
          label="Variable Costs %"
          kpi={variableCostsPercent}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <FinancialMetric 
          label="Variable Costs Amount"
          value={variableCostsAmount}
          isEditable={false}
        />
        <FinancialMetric 
          label="Fixed Costs"
          kpi={fixedCosts}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <Separator />

        {/* Bottom Line */}
        <FinancialMetric 
          label="Operating Profit"
          value={operatingProfit}
          isEditable={false}
          className="font-semibold"
        />
        <FinancialMetric 
          label="Investments"
          kpi={investments}
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
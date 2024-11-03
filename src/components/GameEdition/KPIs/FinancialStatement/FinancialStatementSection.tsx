import { KPI } from "@/types/kpi";
import { Separator } from "@/components/ui/separator";
import FinancialMetric from "./FinancialMetric";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useFinancialCalculations } from "./hooks/useFinancialCalculations";
import { useKPIValueUpdates } from "./hooks/useKPIValueUpdates";

interface FinancialStatementSectionProps {
  kpis: KPI[];
  onEdit: (kpi: KPI) => void;
  onDelete: (kpi: KPI) => void;
  gameId: string;
  turnId?: string;
}

const FinancialStatementSection = ({ 
  kpis, 
  onEdit, 
  onDelete, 
  gameId, 
  turnId 
}: FinancialStatementSectionProps) => {
  const { toast } = useToast();
  const { handleKPIValueChange } = useKPIValueUpdates(gameId, turnId);
  const { 
    kpiValues,
    findKPI,
    getKPIValue,
    calculatedValues
  } = useFinancialCalculations(kpis, gameId, turnId);

  const {
    roomsValue,
    occupiedRoomsValue,
    adrValue,
    extrasValue,
    roomRevenue,
    totalRevenue,
    variableCostsPercentValue,
    variableCostsAmount,
    fixedCostsValue,
    operatingProfit,
    investmentsValue,
    freeCashFlow
  } = calculatedValues;

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm max-w-md">
      <h3 className="font-semibold text-base text-center border-b pb-2 mb-2">
        Financial Statement
      </h3>
      
      <div className="space-y-0.5">
        <FinancialMetric 
          label="Number of Rooms"
          kpi={findKPI('rooms')}
          value={roomsValue}
          onEdit={onEdit}
          onDelete={onDelete}
          onChange={(value) => handleKPIValueChange(findKPI('rooms')?.uuid, value)}
          isEditable={true}
        />
        <FinancialMetric 
          label="Occupied Rooms"
          kpi={findKPI('occupied_rooms')}
          value={occupiedRoomsValue}
          onEdit={onEdit}
          onDelete={onDelete}
          onChange={(value) => handleKPIValueChange(findKPI('occupied_rooms')?.uuid, value)}
          isEditable={true}
        />
        <FinancialMetric 
          label="ADR"
          kpi={findKPI('adr')}
          value={adrValue}
          onEdit={onEdit}
          onDelete={onDelete}
          onChange={(value) => handleKPIValueChange(findKPI('adr')?.uuid, value)}
          isEditable={true}
        />

        <Separator className="my-1" />

        <FinancialMetric 
          label="Room Revenue"
          value={roomRevenue}
          isEditable={false}
        />
        <FinancialMetric 
          label="Extras Revenue"
          kpi={findKPI('extras_revenue')}
          value={extrasValue}
          onEdit={onEdit}
          onDelete={onDelete}
          onChange={(value) => handleKPIValueChange(findKPI('extras_revenue')?.uuid, value)}
          isEditable={true}
        />
        <FinancialMetric 
          label="Total Revenue"
          value={totalRevenue}
          isEditable={false}
          className="font-semibold"
        />

        <Separator className="my-1" />

        <FinancialMetric 
          label="Variable Costs %"
          kpi={findKPI('variable_costs_percent')}
          value={variableCostsPercentValue}
          onEdit={onEdit}
          onDelete={onDelete}
          onChange={(value) => handleKPIValueChange(findKPI('variable_costs_percent')?.uuid, value)}
          isEditable={true}
        />
        <FinancialMetric 
          label="Variable Costs Amount"
          value={variableCostsAmount}
          isEditable={false}
        />
        <FinancialMetric 
          label="Fixed Costs"
          kpi={findKPI('fixed_costs')}
          value={fixedCostsValue}
          onEdit={onEdit}
          onDelete={onDelete}
          onChange={(value) => handleKPIValueChange(findKPI('fixed_costs')?.uuid, value)}
          isEditable={true}
        />

        <Separator className="my-1" />

        <FinancialMetric 
          label="Operating Profit"
          value={operatingProfit}
          isEditable={false}
          className="font-semibold"
        />
        <FinancialMetric 
          label="Investments"
          kpi={findKPI('investments')}
          value={investmentsValue}
          onEdit={onEdit}
          onDelete={onDelete}
          onChange={(value) => handleKPIValueChange(findKPI('investments')?.uuid, value)}
          isEditable={true}
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
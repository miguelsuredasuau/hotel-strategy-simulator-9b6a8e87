import { KPI } from "@/types/kpi";
import { Separator } from "@/components/ui/separator";
import FinancialMetric from "./FinancialMetric";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FinancialStatementSectionProps {
  kpis: KPI[];
  onEdit: (kpi: KPI) => void;
  onDelete: (kpi: KPI) => void;
  gameId: string;
  turnId?: string;
}

const FinancialStatementSection = ({ kpis, onEdit, onDelete, gameId, turnId }: FinancialStatementSectionProps) => {
  const queryClient = useQueryClient();

  // Fetch KPI values for this game/turn
  const { data: kpiValues } = useQuery({
    queryKey: ['kpi-values', gameId, turnId],
    queryFn: async () => {
      const query = supabase
        .from('kpi_values')
        .select('*')
        .eq('game_uuid', gameId);
      
      // Only add turn_uuid filter if turnId is provided
      if (turnId) {
        query.eq('turn_uuid', turnId);
      } else {
        query.is('turn_uuid', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!gameId
  });

  // Helper function to find KPI by financial type
  const findKPI = (type: string) => 
    kpis.find(kpi => kpi.financial_type === type);

  // Helper function to get KPI value
  const getKPIValue = (kpiUuid: string) => {
    const kpiValue = kpiValues?.find(v => v.kpi_uuid === kpiUuid);
    return kpiValue?.value ?? findKPI(kpiUuid)?.default_value ?? 0;
  };

  // Get KPIs by their financial types
  const rooms = findKPI('rooms');
  const occupiedRooms = findKPI('occupied_rooms');
  const adr = findKPI('adr');
  const extras = findKPI('extras_revenue');
  const variableCostsPercent = findKPI('variable_costs_percent');
  const fixedCosts = findKPI('fixed_costs');
  const investments = findKPI('investments');

  // Calculate derived values using actual KPI values
  const roomsValue = getKPIValue(rooms?.uuid || '');
  const occupiedRoomsValue = Math.min(getKPIValue(occupiedRooms?.uuid || ''), roomsValue);
  const adrValue = getKPIValue(adr?.uuid || '');
  const extrasValue = getKPIValue(extras?.uuid || '');
  
  const roomRevenue = occupiedRoomsValue * adrValue;
  const totalRevenue = roomRevenue + extrasValue;
  
  const variableCostsPercentValue = getKPIValue(variableCostsPercent?.uuid || '');
  const variableCostsAmount = totalRevenue * (variableCostsPercentValue / 100);
  const fixedCostsValue = getKPIValue(fixedCosts?.uuid || '');
  
  const operatingProfit = totalRevenue - variableCostsAmount - fixedCostsValue;
  const investmentsValue = getKPIValue(investments?.uuid || '');
  const freeCashFlow = operatingProfit - investmentsValue;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm max-w-md">
      <h3 className="font-semibold text-base text-center border-b pb-2 mb-3">Financial Statement</h3>
      
      <div className="space-y-1">
        {/* Customizable Inputs */}
        <FinancialMetric 
          label="Number of Rooms"
          kpi={rooms}
          value={roomsValue}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <FinancialMetric 
          label="Occupied Rooms"
          kpi={occupiedRooms}
          value={occupiedRoomsValue}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <FinancialMetric 
          label="ADR"
          kpi={adr}
          value={adrValue}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <FinancialMetric 
          label="Extras Revenue"
          kpi={extras}
          value={extrasValue}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <Separator className="my-2" />

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

        <Separator className="my-2" />

        {/* Costs Section */}
        <FinancialMetric 
          label="Variable Costs %"
          kpi={variableCostsPercent}
          value={variableCostsPercentValue}
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
          value={fixedCostsValue}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <Separator className="my-2" />

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
          value={investmentsValue}
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
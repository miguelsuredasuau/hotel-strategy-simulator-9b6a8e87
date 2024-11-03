import { KPI } from "@/types/kpi";
import { Separator } from "@/components/ui/separator";
import FinancialMetric from "./FinancialMetric";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FinancialStatementSectionProps {
  kpis: KPI[];
  onEdit: (kpi: KPI) => void;
  onDelete: (kpi: KPI) => void;
  gameId: string;
  turnId?: string;
}

const FinancialStatementSection = ({ kpis, onEdit, onDelete, gameId, turnId }: FinancialStatementSectionProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: kpiValues } = useQuery({
    queryKey: ['kpi-values', gameId, turnId],
    queryFn: async () => {
      const query = supabase
        .from('kpi_values')
        .select('*')
        .eq('game_uuid', gameId);
      
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

  const findKPI = (type: string) => 
    kpis.find(kpi => kpi.financial_type === type);

  const getKPIValue = (kpiUuid: string) => {
    const kpiValue = kpiValues?.find(v => v.kpi_uuid === kpiUuid);
    return kpiValue?.value ?? findKPI(kpiUuid)?.default_value ?? 0;
  };

  const handleValueChange = async (kpiUuid: string, newValue: number) => {
    try {
      const { error } = await supabase
        .from('kpi_values')
        .upsert({
          kpi_uuid: kpiUuid,
          game_uuid: gameId,
          turn_uuid: turnId,
          value: newValue
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['kpi-values', gameId, turnId] });
      
      toast({
        title: "Success",
        description: "Value updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const rooms = findKPI('rooms');
  const occupiedRooms = findKPI('occupied_rooms');
  const adr = findKPI('adr');
  const extras = findKPI('extras_revenue');
  const variableCostsPercent = findKPI('variable_costs_percent');
  const fixedCosts = findKPI('fixed_costs');
  const investments = findKPI('investments');

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
    <div className="bg-white p-3 rounded-lg shadow-sm max-w-md">
      <h3 className="font-semibold text-base text-center border-b pb-2 mb-2">Financial Statement</h3>
      
      <div className="space-y-0.5">
        <FinancialMetric 
          label="Number of Rooms"
          kpi={rooms}
          value={roomsValue}
          onEdit={onEdit}
          onDelete={onDelete}
          onChange={(value) => rooms && handleValueChange(rooms.uuid, value)}
          isEditable={true}
        />
        <FinancialMetric 
          label="Occupied Rooms"
          kpi={occupiedRooms}
          value={occupiedRoomsValue}
          onEdit={onEdit}
          onDelete={onDelete}
          onChange={(value) => occupiedRooms && handleValueChange(occupiedRooms.uuid, value)}
          isEditable={true}
        />
        <FinancialMetric 
          label="ADR"
          kpi={adr}
          value={adrValue}
          onEdit={onEdit}
          onDelete={onDelete}
          onChange={(value) => adr && handleValueChange(adr.uuid, value)}
          isEditable={true}
        />
        <FinancialMetric 
          label="Extras Revenue"
          kpi={extras}
          value={extrasValue}
          onEdit={onEdit}
          onDelete={onDelete}
          onChange={(value) => extras && handleValueChange(extras.uuid, value)}
          isEditable={true}
        />

        <Separator className="my-1" />

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

        <Separator className="my-1" />

        <FinancialMetric 
          label="Variable Costs %"
          kpi={variableCostsPercent}
          value={variableCostsPercentValue}
          onEdit={onEdit}
          onDelete={onDelete}
          onChange={(value) => variableCostsPercent && handleValueChange(variableCostsPercent.uuid, value)}
          isEditable={true}
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
          onChange={(value) => fixedCosts && handleValueChange(fixedCosts.uuid, value)}
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
          kpi={investments}
          value={investmentsValue}
          onEdit={onEdit}
          onDelete={onDelete}
          onChange={(value) => investments && handleValueChange(investments.uuid, value)}
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
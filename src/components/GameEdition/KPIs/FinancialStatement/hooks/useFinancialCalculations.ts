import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";

export const useFinancialCalculations = (gameId: string, turnId?: string) => {
  const { data: kpis = [] } = useQuery({
    queryKey: ['kpis', gameId],
    queryFn: async () => {
      if (!gameId) throw new Error('Game ID is required');
      
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('game_uuid', gameId)
        .eq('type', 'financial');

      if (error) throw error;
      return data as KPI[];
    },
    enabled: !!gameId
  });

  const findKPI = (name: string) => 
    kpis.find(kpi => kpi.name === name);

  const getKPIValue = (kpiUuid: string) => {
    const kpi = kpis.find(k => k.uuid === kpiUuid);
    return kpi?.default_value ?? 0;
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

  return {
    kpis,
    findKPI,
    getKPIValue,
    calculatedValues: {
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
    }
  };
};
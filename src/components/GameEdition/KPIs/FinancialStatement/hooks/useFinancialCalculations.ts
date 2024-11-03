import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/types/kpi";

export const useFinancialCalculations = (kpis: KPI[], gameId: string, turnId?: string) => {
  const { data: kpiValues = [] } = useQuery({
    queryKey: ['kpi-values', gameId, turnId],
    queryFn: async () => {
      if (!gameId) throw new Error('Game ID is required');
      
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
      console.log('Fetched KPI values:', data); // Debug log
      return data;
    },
    enabled: !!gameId
  });

  const findKPI = (type: string) => 
    kpis.find(kpi => kpi.financial_type === type);

  const getKPIValue = (kpiUuid: string) => {
    const kpiValue = kpiValues?.find(v => v.kpi_uuid === kpiUuid);
    const kpi = kpis.find(k => k.uuid === kpiUuid);
    console.log('Getting KPI value for:', kpiUuid, 'Value:', kpiValue?.value, 'Default:', kpi?.default_value); // Debug log
    return kpiValue?.value ?? kpi?.default_value ?? 0;
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
    kpiValues,
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
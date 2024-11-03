import { Separator } from "@/components/ui/separator";
import FinancialMetric from "./FinancialMetric";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FinancialStatementSectionProps {
  gameId: string;
  turnId?: string;
}

const FinancialStatementSection = ({ gameId, turnId }: FinancialStatementSectionProps) => {
  const { data: options = [] } = useQuery({
    queryKey: ['options', turnId, gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Options')
        .select('*')
        .eq('turn_uuid', turnId)
        .eq('game_uuid', gameId)
        .order('optionnumber');

      if (error) throw error;
      return data;
    },
    enabled: !!turnId && !!gameId
  });

  // Calculate financial metrics from options
  const roomsValue = 100; // Default value
  const occupiedRoomsValue = 80; // Default value
  const adrValue = 150; // Default value
  const extrasValue = 50; // Default value
  
  const roomRevenue = occupiedRoomsValue * adrValue;
  const totalRevenue = roomRevenue + extrasValue;
  
  const variableCostsPercentValue = 30; // Default percentage
  const variableCostsAmount = totalRevenue * (variableCostsPercentValue / 100);
  const fixedCostsValue = 5000; // Default value
  
  const operatingProfit = totalRevenue - variableCostsAmount - fixedCostsValue;
  const investmentsValue = 1000; // Default value
  const freeCashFlow = operatingProfit - investmentsValue;

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm max-w-md">
      <h3 className="font-semibold text-base text-center border-b pb-2 mb-2">
        Financial Statement
      </h3>
      
      <div className="space-y-0.5">
        <FinancialMetric 
          label="Number of Rooms"
          value={roomsValue}
          isEditable={false}
        />
        <FinancialMetric 
          label="Occupied Rooms"
          value={occupiedRoomsValue}
          isEditable={false}
        />
        <FinancialMetric 
          label="ADR"
          value={adrValue}
          isEditable={false}
        />

        <Separator className="my-1" />

        <FinancialMetric 
          label="Room Revenue"
          value={roomRevenue}
          isEditable={false}
        />
        <FinancialMetric 
          label="Extras Revenue"
          value={extrasValue}
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
          value={variableCostsPercentValue}
          isEditable={false}
        />
        <FinancialMetric 
          label="Variable Costs Amount"
          value={variableCostsAmount}
          isEditable={false}
        />
        <FinancialMetric 
          label="Fixed Costs"
          value={fixedCostsValue}
          isEditable={false}
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
          value={investmentsValue}
          isEditable={false}
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
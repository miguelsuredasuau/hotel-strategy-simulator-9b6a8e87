import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, ChevronDown, ChevronRight } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { KPI } from "@/types/kpi";
import KPICard from './KPICard';
import KPIEditDialog from './KPIEditDialog';
import DeleteConfirmDialog from '../DeleteConfirmDialog';

interface KPIsSectionProps {
  gameId: string;
}

const KPIsSection = ({ gameId }: KPIsSectionProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: kpis = [], isLoading } = useQuery({
    queryKey: ['kpis', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('game_uuid', gameId)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as KPI[];
    },
  });

  const handleDeleteKPI = async () => {
    if (!selectedKPI) return;

    try {
      const { error } = await supabase
        .from('kpis')
        .delete()
        .eq('uuid', selectedKPI.uuid);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['kpis', gameId] });
      toast({
        title: "Success",
        description: "KPI deleted successfully",
      });
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const operationalKPIs = kpis.filter(kpi => kpi.category === 'operational');
  const financialKPIs = kpis.filter(kpi => kpi.category === 'financial');

  return (
    <Card className="mt-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger className="hover:opacity-75">
              {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </CollapsibleTrigger>
            <Target className="h-5 w-5" />
            <CardTitle>KPIs Management</CardTitle>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New KPI
          </Button>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {operationalKPIs.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Operational KPIs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {operationalKPIs.map((kpi) => (
                        <KPICard
                          key={kpi.uuid}
                          kpi={kpi}
                          onEdit={(kpi) => {
                            setSelectedKPI(kpi);
                            setIsCreateDialogOpen(true);
                          }}
                          onDelete={(kpi) => {
                            setSelectedKPI(kpi);
                            setIsDeleteDialogOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {financialKPIs.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Financial KPIs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {financialKPIs.map((kpi) => (
                        <KPICard
                          key={kpi.uuid}
                          kpi={kpi}
                          onEdit={(kpi) => {
                            setSelectedKPI(kpi);
                            setIsCreateDialogOpen(true);
                          }}
                          onDelete={(kpi) => {
                            setSelectedKPI(kpi);
                            setIsDeleteDialogOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {kpis.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No KPIs created yet
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <KPIEditDialog
        kpi={selectedKPI}
        gameId={gameId}
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setSelectedKPI(null);
          }
        }}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteKPI}
      />
    </Card>
  );
};

export default KPIsSection;
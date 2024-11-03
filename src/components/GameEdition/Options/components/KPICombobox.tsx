import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface KPI {
  uuid: string;
  name: string;
}

interface KPIComboboxProps {
  value: string;
  gameId: string;
  kpis?: KPI[];
  onChange: (value: string) => void;
  onCreateNew?: () => void;
}

export function KPICombobox({ 
  value = '', 
  gameId, 
  kpis = [], 
  onChange, 
  onCreateNew 
}: KPIComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const { toast } = useToast();

  const handleCreateNewKPI = async () => {
    if (!search.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('kpis')
        .insert([
          { 
            name: search,
            game_uuid: gameId,
            impact_type: 'value',
            weight: 1,
            default_value: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "New KPI created successfully",
      });

      onChange(search);
      setOpen(false);
      onCreateNew?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Ensure kpis is always an array of valid KPIs
  const safeKpis = React.useMemo(() => {
    return kpis?.filter((kpi): kpi is KPI => 
      kpi !== null && 
      typeof kpi === 'object' && 
      typeof kpi.name === 'string' && 
      typeof kpi.uuid === 'string'
    ) ?? [];
  }, [kpis]);

  const filteredKpis = React.useMemo(() => {
    if (!search) return safeKpis;
    return safeKpis.filter(kpi => 
      kpi.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [safeKpis, search]);

  const displayValue = React.useMemo(() => {
    if (!value) return "Select KPI...";
    const kpi = safeKpis.find(k => k.name === value);
    return kpi ? kpi.name : value;
  }, [value, safeKpis]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search KPI..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>
            <div className="p-2">
              <p className="text-sm text-muted-foreground mb-2">No KPI found</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCreateNewKPI}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create "{search}"
              </Button>
            </div>
          </CommandEmpty>
          <CommandGroup>
            {filteredKpis.map((kpi) => (
              <CommandItem
                key={kpi.uuid}
                value={kpi.name}
                onSelect={() => {
                  onChange(kpi.name);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === kpi.name ? "opacity-100" : "opacity-0"
                  )}
                />
                {kpi.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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

interface KPIAutocompleteProps {
  value: string;
  gameId: string;
  kpis?: KPI[];
  onChange: (value: string) => void;
  onKPICreate?: () => void;
}

export function KPIAutocomplete({ 
  value = '', 
  gameId, 
  kpis = [], 
  onChange,
  onKPICreate 
}: KPIAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const { toast } = useToast();

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const safeKpis = React.useMemo(() => {
    return kpis?.filter((kpi): kpi is KPI => 
      kpi !== null && 
      typeof kpi === 'object' && 
      typeof kpi.name === 'string' && 
      typeof kpi.uuid === 'string'
    ) ?? [];
  }, [kpis]);

  const filteredKpis = React.useMemo(() => {
    if (!inputValue) return safeKpis;
    return safeKpis.filter(kpi => 
      kpi.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [safeKpis, inputValue]);

  const handleCreateKPI = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('kpis')
        .insert([
          { 
            name,
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

      onChange(name);
      setOpen(false);
      onKPICreate?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSelect = async (selectedValue: string) => {
    const existingKPI = safeKpis.find(k => k.name === selectedValue);
    
    if (existingKPI) {
      onChange(selectedValue);
      setOpen(false);
    } else if (selectedValue.trim()) {
      await handleCreateKPI(selectedValue.trim());
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {inputValue || "Select or create KPI..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search or create KPI..." 
            value={inputValue}
            onValueChange={(value) => {
              setInputValue(value);
              onChange(value);
            }}
          />
          <CommandEmpty>
            Press enter to create "{inputValue}"
          </CommandEmpty>
          <CommandGroup>
            {filteredKpis.map((kpi) => (
              <CommandItem
                key={kpi.uuid}
                value={kpi.name}
                onSelect={handleSelect}
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
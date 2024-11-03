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
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface KPIComboboxProps {
  value: string;
  gameId: string;
  kpis?: { uuid: string; name: string }[];
  onChange: (value: string) => void;
  onCreateNew?: (name: string) => void;
}

export function KPICombobox({ 
  value, 
  gameId, 
  kpis = [], // Provide default empty array
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
      onCreateNew?.(search);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
          {value
            ? kpis.find((kpi) => kpi.name === value)?.name || value
            : "Select KPI..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search KPI..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>
            <div className="px-2 py-1.5 text-sm">
              No KPI found. 
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={handleCreateNewKPI}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create "{search}"
              </Button>
            </div>
          </CommandEmpty>
          <CommandGroup>
            {kpis.map((kpi) => (
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
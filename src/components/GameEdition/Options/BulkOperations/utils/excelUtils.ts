import * as XLSX from 'xlsx';
import { Option } from "@/types/game";
import { useToast } from "@/components/ui/use-toast";

export const downloadOptionsAsExcel = (options: Option[], turnUuid: string, gameUuid: string, turnNumber: number) => {
  const { toast } = useToast();

  if (!options || options.length === 0) {
    toast({
      title: "No options to export",
      description: "Create some options first before exporting.",
      variant: "destructive",
    });
    return;
  }

  const excelData = options.map(option => ({
    'Turn UUID': turnUuid,
    'Game UUID': gameUuid,
    'Turn Number': turnNumber,
    'Option Number': option.optionnumber,
    'Title': option.title || '',
    'Description': option.description || '',
    'Image URL': option.image || '',
    'KPI 1': option.impactkpi1 || '',
    'KPI 1 Amount': option.impactkpi1amount || '',
    'KPI 2': option.impactkpi2 || '',
    'KPI 2 Amount': option.impactkpi2amount || '',
    'KPI 3': option.impactkpi3 || '',
    'KPI 3 Amount': option.impactkpi3amount || '',
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);
  XLSX.utils.book_append_sheet(wb, ws, 'Options');
  XLSX.writeFile(wb, `turn_${turnNumber}_options.xlsx`);

  toast({
    title: "Success",
    description: "Options exported successfully",
  });
};
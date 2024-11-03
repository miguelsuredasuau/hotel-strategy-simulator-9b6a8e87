import { Badge } from "@/components/ui/badge";

interface KpiTagProps {
  label: string;
  value: number;
}

const KpiTag = ({ label, value }: KpiTagProps) => {
  const color = value >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return (
    <Badge variant="outline" className={`${color} border-none`}>
      {label}: {value > 0 ? '+' : ''}{value}
    </Badge>
  );
};

export default KpiTag;
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { KPI } from "@/types/kpi";

interface KPICardProps {
  kpi: KPI;
  onEdit: (kpi: KPI) => void;
  onDelete: (kpi: KPI) => void;
}

const KPICard = ({ kpi, onEdit, onDelete }: KPICardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{kpi.name}</h3>
            <p className="text-sm text-gray-500">
              {kpi.category} KPI on {kpi.axis} axis
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <p>Weight: {kpi.weight}</p>
              <p>Default Value: {kpi.default_value}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(kpi)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(kpi)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
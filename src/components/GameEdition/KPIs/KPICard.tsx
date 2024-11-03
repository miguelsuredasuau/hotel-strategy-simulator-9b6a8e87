import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KPI } from "@/types/kpi";

interface KPICardProps {
  kpi: KPI;
  onEdit: (kpi: KPI) => void;
  onDelete: (kpi: KPI) => void;
}

const KPICard = ({ kpi, onEdit, onDelete }: KPICardProps) => {
  return (
    <Card className="group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{kpi.name}</h3>
            <div className="space-y-1">
              <div className="flex gap-2">
                <Badge variant="outline" className="capitalize">
                  {kpi.category}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  Axis {kpi.axis}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                Weight: {kpi.weight}
              </p>
              <p className="text-sm text-gray-500">
                Default: {kpi.default_value}
              </p>
              {kpi.is_customizable && (
                <Badge variant="secondary">
                  Customizable
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(kpi)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(kpi)}
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
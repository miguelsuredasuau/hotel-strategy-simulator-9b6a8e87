import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import { Turn } from "@/types/game";

interface OptionsHeaderProps {
  turnData?: Turn;
  onBack: () => void;
  onAddOption: () => void;
}

export const OptionsHeader = ({ turnData, onBack, onAddOption }: OptionsHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          Turn {turnData?.turnnumber} Options
        </h1>
      </div>

      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-semibold text-xl mb-2">{turnData?.challenge}</h2>
              <p className="text-gray-600">{turnData?.description}</p>
            </div>
            <Button onClick={onAddOption}>
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import { Variable, Calculator } from "lucide-react";

interface KPITypeToggleProps {
  isCustomVariable: boolean;
  onChange: (value: boolean) => void;
}

export const KPITypeToggle = ({ isCustomVariable, onChange }: KPITypeToggleProps) => {
  return (
    <div className="flex items-center justify-center space-x-4 my-6">
      <button
        onClick={() => onChange(true)}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
          isCustomVariable
            ? "bg-green-100 text-green-900 shadow-sm"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Variable className="h-5 w-5" />
        <span className="font-medium">Variable</span>
      </button>
      <button
        onClick={() => onChange(false)}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
          !isCustomVariable
            ? "bg-blue-100 text-blue-900 shadow-sm"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Calculator className="h-5 w-5" />
        <span className="font-medium">KPI</span>
      </button>
    </div>
  );
};
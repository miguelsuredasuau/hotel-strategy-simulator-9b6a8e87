import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
}

const StatCard = ({ title, value, change, prefix = "", suffix = "" }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-hotel-muted text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-end gap-2">
        <div className="text-2xl font-bold text-hotel-text">
          {prefix}
          {value}
          {suffix}
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center text-sm ${
              change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
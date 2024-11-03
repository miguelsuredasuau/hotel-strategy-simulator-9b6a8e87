import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, ScatterChart, CartesianGrid, XAxis, YAxis, Scatter, ResponsiveContainer } from "recharts";
import { Quote } from "lucide-react";
import { mockRevenueData, mockCompetitiveData, mockHotels } from "./dashboardData";

export const ChartSection = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Cash Balance</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-2xl font-bold mb-2">€1,565,367</div>
          <div className="text-sm text-green-500">+30% vs last month</div>
          <div className="mt-4 w-full h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRevenueData}>
                <Bar dataKey="revenue" fill="#1E40AF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Competitive Environment</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" />
                <YAxis type="number" dataKey="y" />
                <Scatter data={mockCompetitiveData} fill="#60A5FA" />
                <Scatter data={mockHotels} fill="#EF4444" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardContent className="flex items-center space-x-4 py-4">
          <Quote className="w-4 h-4 text-hotel-primary flex-shrink-0" />
          <div>
            <p className="text-sm italic text-hotel-text">
              "The best way to find yourself is to lose yourself in the service of others."
              <span className="text-xs text-hotel-muted ml-2">— Mahatma Gandhi</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
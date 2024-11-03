import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, ScatterChart, CartesianGrid, XAxis, YAxis, Scatter, ResponsiveContainer, Tooltip } from "recharts";
import { Quote, Hotel } from "lucide-react";
import { mockRevenueData, mockCompetitiveData, mockHotels } from "./dashboardData";

// Custom scatter dot component using Hotel icon
const CustomHotelDot = (props: any) => {
  const { cx, cy, fill } = props;
  
  return (
    <Hotel
      x={cx - 12}
      y={cy - 12}
      className="w-6 h-6"
      style={{ 
        fill: fill,
        stroke: '#fff',
        strokeWidth: 1
      }}
    />
  );
};

export const ChartSection = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <Card className="col-span-1 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-hotel-text">Cash Balance</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-3xl font-bold mb-2 text-hotel-primary">€1,565,367</div>
          <div className="text-sm text-green-500 font-medium mb-4">+30% vs last month</div>
          <div className="mt-4 w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#1E40AF"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-hotel-text">Competitive Environment</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  stroke="#64748B"
                  label={{ value: 'Market Position', position: 'bottom', offset: 0 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  stroke="#64748B"
                  label={{ value: 'Performance', angle: -90, position: 'left' }}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Scatter 
                  data={mockCompetitiveData} 
                  fill="#60A5FA" 
                  fillOpacity={0.6}
                  shape={<CustomHotelDot />}
                />
                <Scatter 
                  data={mockHotels} 
                  fill="#EF4444" 
                  fillOpacity={0.8}
                  shape={<CustomHotelDot />}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-3 bg-hotel-accent hover:shadow-lg transition-shadow">
        <CardContent className="flex items-center space-x-4 py-4">
          <Quote className="w-6 h-6 text-hotel-primary flex-shrink-0" />
          <div>
            <p className="text-sm italic text-hotel-text">
              "The best way to find yourself is to lose yourself in the service of others."
              <span className="text-xs text-hotel-muted ml-2 font-medium">— Mahatma Gandhi</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
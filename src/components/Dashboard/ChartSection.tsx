import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, ScatterChart, CartesianGrid, XAxis, YAxis, Scatter, LineChart, Line } from "recharts";
import { Quote } from "lucide-react";
import { mockRevenueData, mockCompetitiveData, mockHotels } from "./dashboardData";

export const ChartSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Cash Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">€1,565,367</div>
          <div className="text-sm text-green-500">+30% vs last month</div>
          <div className="mt-4">
            <BarChart width={200} height={150} data={mockRevenueData}>
              <Bar dataKey="revenue" fill="#1E40AF" />
            </BarChart>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Competitive Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <ScatterChart width={300} height={300}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" />
            <YAxis type="number" dataKey="y" />
            <Scatter data={mockCompetitiveData} fill="#60A5FA" />
            <Scatter data={mockHotels} fill="#EF4444" />
          </ScatterChart>
        </CardContent>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader className="flex flex-row items-center space-x-2">
          <Quote className="w-4 h-4 text-hotel-primary" />
          <CardTitle>Quote of the Day</CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="border-l-4 border-hotel-primary pl-4 my-4">
            <p className="text-lg italic text-hotel-text mb-2">
              "The best way to find yourself is to lose yourself in the service of others."
            </p>
            <footer className="text-sm text-hotel-muted">
              — Mahatma Gandhi
            </footer>
          </blockquote>
          <div className="mt-4 text-sm text-hotel-muted">
            Share this quote with your team to boost morale and remind them of our service-first approach.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
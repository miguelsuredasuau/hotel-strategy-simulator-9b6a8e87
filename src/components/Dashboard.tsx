import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, TrendingUp, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  onNextTurn: () => void;
}

const mockRevenueData = [
  { month: 1, revenue: 2400 },
  { month: 2, revenue: 1398 },
  { month: 3, revenue: 5800 },
  { month: 4, revenue: 3908 },
  { month: 5, revenue: 4800 },
  { month: 6, revenue: 3800 },
];

const mockCompetitiveData = Array.from({ length: 100 }, () => ({
  x: Math.random() * 4,
  y: Math.random() * 100,
}));

const mockHotels = [
  { name: "El manitas", adr: 110, rating: 4.3, occupancy: 80, x: 2.1, y: 65 },
  { name: "Time2Fit", adr: 150, rating: 4.1, occupancy: 75, x: 2.8, y: 72 },
  { name: "Boaties", adr: 120, rating: 3.8, occupancy: 70, x: 1.9, y: 58 },
  { name: "Scandal", adr: 200, rating: 2.8, occupancy: 55, x: 3.2, y: 45 },
  { name: "Near Trust", adr: 75, rating: 1.7, occupancy: 45, x: 1.2, y: 32 },
];

const Dashboard = ({ onNextTurn }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-hotel-muted">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€43,280</div>
            <div className="flex items-center text-sm text-green-500">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12% vs last month
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-hotel-primary" />
                <span>Income +450,000 (+10%)</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-hotel-primary" />
                <span>Expenses -235,000 (+7%)</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-hotel-primary" />
                <span>Profit +215,000 (+15%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-hotel-muted">ADR and Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <div>
                <div className="text-2xl font-bold">€120</div>
                <div className="text-xs text-hotel-muted">ADR</div>
              </div>
              <div>
                <div className="text-2xl font-bold">66%</div>
                <div className="text-xs text-hotel-muted">Occupancy</div>
              </div>
            </div>
            <div className="space-y-2">
              {mockHotels.map((hotel) => (
                <div key={hotel.name} className="flex items-center justify-between">
                  <span className="text-sm">{hotel.name}</span>
                  <span className="text-sm font-medium">€{hotel.adr}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-hotel-muted">Guest Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.3</div>
            <div className="flex items-center text-sm text-green-500">
              <TrendingUp className="w-4 h-4 mr-1" />
              +0.7 vs last month
            </div>
            <div className="space-y-2 mt-4">
              {mockHotels.map((hotel) => (
                <div key={hotel.name} className="flex items-center justify-between">
                  <span className="text-sm">{hotel.name}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">{hotel.rating}</span>
                    <Progress value={hotel.rating * 20} className="w-20" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-hotel-muted">Staff Morale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">70%</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E0F2FE"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="3"
                    strokeDasharray="70, 100"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <LineChart width={200} height={60} data={mockRevenueData}>
                <Line type="monotone" dataKey="revenue" stroke="#60A5FA" strokeWidth={2} dot={false} />
              </LineChart>
            </div>
          </CardContent>
        </Card>
      </div>

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

        <div className="flex justify-end mt-8">
          <Button 
            onClick={onNextTurn}
            className="bg-hotel-primary text-white hover:bg-hotel-primary/90"
          >
            Next Turn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, TrendingUp } from "lucide-react";
import { mockHotels } from "./dashboardData";

export const StatisticsCards = () => {
  return (
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
        </CardContent>
      </Card>
    </div>
  );
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, TrendingUp, Users, Hotel, Star, DollarSign } from "lucide-react";
import { mockHotels } from "./dashboardData";

export const StatisticsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-hotel-muted">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-hotel-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-hotel-text">€43,280</div>
          <div className="flex items-center text-sm text-green-500 font-medium mb-4">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% vs last month
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Check className="w-4 h-4 mr-2 text-hotel-primary" />
              <span className="text-hotel-text">Income +450,000 <span className="text-green-500">(+10%)</span></span>
            </div>
            <div className="flex items-center text-sm">
              <Check className="w-4 h-4 mr-2 text-hotel-primary" />
              <span className="text-hotel-text">Expenses -235,000 <span className="text-red-500">(+7%)</span></span>
            </div>
            <div className="flex items-center text-sm">
              <Check className="w-4 h-4 mr-2 text-hotel-primary" />
              <span className="text-hotel-text">Profit +215,000 <span className="text-green-500">(+15%)</span></span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-hotel-muted">ADR and Occupancy</CardTitle>
          <Hotel className="h-4 w-4 text-hotel-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-2xl font-bold text-hotel-text">€120</div>
              <div className="text-xs text-hotel-muted">ADR</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-hotel-text">66%</div>
              <div className="text-xs text-hotel-muted">Occupancy</div>
            </div>
          </div>
          <div className="space-y-3">
            {mockHotels.map((hotel) => (
              <div key={hotel.name} className="flex items-center justify-between">
                <span className="text-sm text-hotel-text">{hotel.name}</span>
                <span className="text-sm font-medium text-hotel-primary">€{hotel.adr}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-hotel-muted">Guest Satisfaction</CardTitle>
          <Star className="h-4 w-4 text-hotel-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-hotel-text">4.3</div>
          <div className="flex items-center text-sm text-green-500 font-medium mb-4">
            <TrendingUp className="w-4 h-4 mr-1" />
            +0.7 vs last month
          </div>
          <div className="space-y-3">
            {mockHotels.map((hotel) => (
              <div key={hotel.name} className="flex items-center justify-between">
                <span className="text-sm text-hotel-text">{hotel.name}</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-hotel-primary mr-2">{hotel.rating}</span>
                  <Progress 
                    value={hotel.rating * 20} 
                    className="w-20 bg-gray-100" 
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-hotel-muted">Staff Morale</CardTitle>
          <Users className="h-4 w-4 text-hotel-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-hotel-primary">70%</span>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#E0F2FE"
                  strokeWidth="12"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 60 * 0.7} ${2 * Math.PI * 60 * 0.3}`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, TrendingUp, Users, Hotel, Star, DollarSign, Banknote } from "lucide-react";
import { mockHotels } from "./dashboardData";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import StarRating from "../StarRating";

export const StatisticsCards = () => {
  const [periodValue, setPeriodValue] = useState([0]); // 0 for this turn, 100 for year to date

  const isPeriodYTD = periodValue[0] > 50;

  const revenueData = {
    thisMonth: {
      total: "43,280",
      change: "+12%",
      income: { amount: "+450,000", percentage: "+10%" },
      expenses: { amount: "-235,000", percentage: "+7%" },
      profit: { amount: "+215,000", percentage: "+15%" },
      investments: { amount: "+180,000", percentage: "+5%" }
    },
    ytd: {
      total: "521,450",
      change: "+25%",
      income: { amount: "+2,450,000", percentage: "+22%" },
      expenses: { amount: "-1,235,000", percentage: "+12%" },
      profit: { amount: "+1,215,000", percentage: "+28%" },
      investments: { amount: "+850,000", percentage: "+15%" }
    }
  };

  const currentData = isPeriodYTD ? revenueData.ytd : revenueData.thisMonth;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-hotel-muted">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-hotel-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-3xl font-bold text-hotel-text">€{currentData.total}</div>
              <div className="flex items-center text-sm text-green-500 font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                {currentData.change} vs last period
              </div>
            </div>
            <div className="text-xs text-hotel-muted">
              {isPeriodYTD ? "Year to Date" : "This Turn"}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-hotel-muted mb-1">
              <span>This Turn</span>
              <span>Year to Date</span>
            </div>
            <Slider
              value={periodValue}
              onValueChange={setPeriodValue}
              max={100}
              step={100}
              className="w-32 h-1"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Check className="w-4 h-4 mr-2 text-hotel-primary" />
              <span className="text-hotel-text flex-1">Income {currentData.income.amount}</span>
              <span className="text-green-500">{currentData.income.percentage}</span>
            </div>
            <div className="flex items-center text-sm">
              <Check className="w-4 h-4 mr-2 text-hotel-primary" />
              <span className="text-hotel-text flex-1">Expenses {currentData.expenses.amount}</span>
              <span className="text-red-500">{currentData.expenses.percentage}</span>
            </div>
            <div className="flex items-center text-sm">
              <Check className="w-4 h-4 mr-2 text-hotel-primary" />
              <span className="text-hotel-text flex-1">Profit {currentData.profit.amount}</span>
              <span className="text-green-500">{currentData.profit.percentage}</span>
            </div>
            <div className="flex items-center text-sm border-t pt-2">
              <Banknote className="w-4 h-4 mr-2 text-hotel-primary" />
              <span className="text-hotel-text flex-1">Investments {currentData.investments.amount}</span>
              <span className="text-blue-500">{currentData.investments.percentage}</span>
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
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-hotel-primary">{hotel.rating}</span>
                  <StarRating rating={hotel.rating} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium text-gray-600">Staff Morale</CardTitle>
          <Users className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <div className="relative w-48 h-48">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="#EEF2FF"
                  strokeWidth="12"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 88 * 0.7} ${2 * Math.PI * 88 * 0.3}`}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-bold text-blue-600">70%</span>
                <span className="text-base text-gray-500 mt-2">Staff Morale</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

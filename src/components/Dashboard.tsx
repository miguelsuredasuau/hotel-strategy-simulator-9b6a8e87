import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import StatCard from "./StatCard";

const mockData = [
  { month: "Jan", revenue: 2400 },
  { month: "Feb", revenue: 1398 },
  { month: "Mar", revenue: 9800 },
  { month: "Apr", revenue: 3908 },
  { month: "May", revenue: 4800 },
  { month: "Jun", revenue: 3800 },
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Revenue"
          value={43280}
          change={12}
          prefix="€"
        />
        <StatCard
          title="Occupancy Rate"
          value={66}
          change={5}
          suffix="%"
        />
        <StatCard
          title="Guest Satisfaction"
          value={4.3}
          change={8}
        />
        <StatCard
          title="Staff Morale"
          value={78}
          change={-3}
          suffix="%"
        />
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-hotel-text mb-4">Revenue Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="revenue" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
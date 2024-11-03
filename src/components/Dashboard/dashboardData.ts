export const mockRevenueData = [
  { month: 1, revenue: 2400 },
  { month: 2, revenue: 1398 },
  { month: 3, revenue: 5800 },
  { month: 4, revenue: 3908 },
  { month: 5, revenue: 4800 },
  { month: 6, revenue: 3800 },
];

export const mockCompetitiveData = Array.from({ length: 100 }, () => ({
  x: Math.random() * 4,
  y: Math.random() * 100,
}));

export const mockHotels = [
  { name: "El manitas", adr: 110, rating: 4.3, occupancy: 80, x: 2.1, y: 65 },
  { name: "Time2Fit", adr: 150, rating: 4.1, occupancy: 75, x: 2.8, y: 72 },
  { name: "Boaties", adr: 120, rating: 3.8, occupancy: 70, x: 1.9, y: 58 },
  { name: "Scandal", adr: 200, rating: 2.8, occupancy: 55, x: 3.2, y: 45 },
  { name: "Near Trust", adr: 75, rating: 1.7, occupancy: 45, x: 1.2, y: 32 },
];
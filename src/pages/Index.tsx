import { useState } from "react";
import GameHeader from "../components/GameHeader";
import Dashboard from "../components/Dashboard";
import HotelCard from "../components/HotelCard";

const TOTAL_TURNS = 20;

const Index = () => {
  const [currentTurn, setCurrentTurn] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);

  const hotels = [
    {
      id: "beach",
      name: "Beachfront Resort",
      description: "Luxury beachfront property with stunning ocean views",
      price: 2450000,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80",
    },
    {
      id: "mountain",
      name: "Mountain Retreat",
      description: "Cozy mountain lodge with spectacular hiking trails",
      price: 1750000,
      image: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?auto=format&fit=crop&q=80",
    },
    {
      id: "city",
      name: "Downtown Luxury",
      description: "Modern hotel in the heart of the business district",
      price: 3200000,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader currentTurn={currentTurn} totalTurns={TOTAL_TURNS} />
      
      {!selectedHotel ? (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-hotel-text mb-6">Select Your Hotel</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                {...hotel}
                onSelect={() => setSelectedHotel(hotel.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <Dashboard />
      )}
    </div>
  );
};

export default Index;
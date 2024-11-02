import { useState } from "react";
import Header from "../components/Header/Header";
import Dashboard from "../components/Dashboard";
import HotelCard from "../components/HotelCard";

const TOTAL_TURNS = 20;
const OPTIONS_PER_TURN = 6;

const generateOptions = (turn: number) => {
  const options = [];
  for (let i = 0; i < OPTIONS_PER_TURN; i++) {
    const basePrice = 1000000 + (turn * 250000);
    const randomVariation = Math.floor(Math.random() * 500000);
    
    options.push({
      id: `option-${turn}-${i}`,
      name: `Hotel Option ${i + 1}`,
      description: `Strategic hotel opportunity for Turn ${turn}`,
      price: basePrice + randomVariation,
      image: `https://source.unsplash.com/800x600/?hotel,luxury&sig=${turn}-${i}`,
    });
  }
  return options;
};

const Index = () => {
  const [currentTurn, setCurrentTurn] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const currentOptions = generateOptions(currentTurn);

  const handleHotelSelect = (hotelId: string) => {
    setSelectedHotel(hotelId);
    setShowDashboard(true);
  };

  const handleNextTurn = () => {
    if (currentTurn < TOTAL_TURNS) {
      setCurrentTurn(prev => prev + 1);
    }
    setShowDashboard(false);
    setSelectedHotel(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentTurn={currentTurn} totalTurns={TOTAL_TURNS}>
        <h1 className="text-2xl font-bold text-hotel-text">THE HOTEL GAME</h1>
      </Header>
      
      {!showDashboard ? (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-hotel-text mb-6">Turn {currentTurn}: Select Your Next Investment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentOptions.map((hotel) => (
              <HotelCard
                key={hotel.id}
                {...hotel}
                onSelect={() => handleHotelSelect(hotel.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <Dashboard onNextTurn={handleNextTurn} />
      )}
    </div>
  );
};

export default Index;
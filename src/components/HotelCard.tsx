interface HotelCardProps {
  name: string;
  description: string;
  price: number;
  image: string;
  onSelect: () => void;
}

const HotelCard = ({ name, description, price, image, onSelect }: HotelCardProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-hotel-text">{name}</h3>
          <div className="text-hotel-primary font-bold">€{price.toLocaleString()}</div>
        </div>
        <p className="text-hotel-muted mb-6">{description}</p>
        <button
          onClick={onSelect}
          className="w-full bg-hotel-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default HotelCard;
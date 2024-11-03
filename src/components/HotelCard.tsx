import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageOff } from "lucide-react";

interface HotelCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  onSelect: () => void;
}

const HotelCard = ({ id, name, description, image, onSelect }: HotelCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={onSelect}
          className="w-full bg-hotel-primary text-white hover:bg-hotel-primary/90"
        >
          Select Option
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HotelCard;
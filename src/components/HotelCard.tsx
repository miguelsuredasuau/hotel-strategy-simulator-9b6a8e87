import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageOff } from "lucide-react";
import DescriptionDialog from "./DescriptionDialog";

interface HotelCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  onSelect: () => void;
  isDisabled?: boolean;
}

const HotelCard = ({ id, name, description, image, onSelect, isDisabled }: HotelCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
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
        <CardContent className="p-4 flex-1">
          <h3 className="text-lg font-semibold mb-2">{name}</h3>
          <div>
            <p className="text-gray-600 text-sm truncate">{description}</p>
            {description && (
              <Button
                variant="link"
                className="text-sm p-0 h-auto text-hotel-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDialogOpen(true);
                }}
              >
                Read more
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={onSelect}
            className="w-full bg-hotel-primary text-white hover:bg-hotel-primary/90 disabled:opacity-50"
            disabled={isDisabled}
          >
            {isDisabled ? "Fill ADR to Select Option" : "Select Option"}
          </Button>
        </CardFooter>
      </Card>

      <DescriptionDialog
        title={name}
        description={description}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};

export default HotelCard;
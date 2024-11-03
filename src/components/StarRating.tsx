import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  className?: string;
}

const StarRating = ({ rating, className = "" }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const partialStar = rating % 1;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-hotel-primary text-hotel-primary" />
      ))}
      {partialStar > 0 && (
        <div className="relative">
          <Star className="w-4 h-4 text-gray-200" />
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${partialStar * 100}%` }}
          >
            <Star className="w-4 h-4 fill-hotel-primary text-hotel-primary" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-200" />
      ))}
    </div>
  );
};

export default StarRating;
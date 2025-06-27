
import { Clock, MapPin, CheckCircle, XCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JCB {
  id: number;
  name: string;
  image: string;
  hourlyRate: number;
  features: string[];
  available: boolean;
  distance: string;
}

interface JCBCardProps {
  jcb: JCB;
}

const JCBCard = ({ jcb }: JCBCardProps) => {
  return (
    <div className="group bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <div className="relative overflow-hidden">
        <img
          src={jcb.image}
          alt={jcb.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          {jcb.available ? (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Available
            </span>
          ) : (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
              <XCircle className="h-4 w-4 mr-1" />
              Busy
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{jcb.name}</h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{jcb.distance}</span>
        </div>
        
        <div className="flex items-center mb-4">
          <Clock className="h-4 w-4 mr-2 text-orange-500" />
          <span className="text-2xl font-bold text-orange-600">₹{jcb.hourlyRate}</span>
          <span className="text-gray-600 ml-1">/hour</span>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-gray-800">Features:</h4>
          <div className="flex flex-wrap gap-2">
            {jcb.features.map((feature, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
        
        <Button 
          className={`w-full ${
            jcb.available 
              ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700" 
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!jcb.available}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {jcb.available ? "Book Now" : "Currently Unavailable"}
        </Button>
      </div>
    </div>
  );
};

export default JCBCard;

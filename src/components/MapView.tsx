
import { MapPin, Navigation } from "lucide-react";

const MapView = () => {
  const jcbLocations = [
    { id: 1, name: "JCB 3DX Super", lat: "12.9716", lng: "77.5946", distance: "0.5 km" },
    { id: 2, name: "JCB 3CX Eco", lat: "12.9700", lng: "77.5950", distance: "1.2 km" },
    { id: 3, name: "JCB JS220", lat: "12.9680", lng: "77.5920", distance: "2.1 km" }
  ];

  return (
    <div className="h-96 bg-gradient-to-br from-blue-100 to-orange-100 relative overflow-hidden">
      {/* Map placeholder with grid pattern */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-orange-50 opacity-50"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px 1px, transparent 1px 20px),
                           repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px 1px, transparent 1px 20px)`
        }}></div>
      </div>
      
      {/* JCB location markers */}
      {jcbLocations.map((location, index) => (
        <div
          key={location.id}
          className="absolute animate-bounce"
          style={{
            left: `${20 + index * 25}%`,
            top: `${30 + index * 15}%`,
            animationDelay: `${index * 0.5}s`
          }}
        >
          <div className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors cursor-pointer group">
            <MapPin className="h-6 w-6" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <div className="font-semibold">{location.name}</div>
              <div className="text-sm text-gray-600">{location.distance}</div>
            </div>
          </div>
        </div>
      ))}
      
      {/* User location marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg animate-pulse">
          <Navigation className="h-6 w-6" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            Your Location
          </div>
        </div>
      </div>
      
      {/* Map controls */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md rounded-lg p-2 shadow-lg">
        <div className="text-sm font-semibold text-gray-800">Interactive Map</div>
        <div className="text-xs text-gray-600">Real-time JCB locations</div>
      </div>
    </div>
  );
};

export default MapView;

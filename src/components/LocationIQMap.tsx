
import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Navigation, MapPin, X, Phone, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface LocationIQMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    type: 'operator' | 'job';
    hourlyRate?: number;
    features?: string[];
    operatorName?: string;
    phone?: string;
    budget?: number;
    duration?: string;
    clientName?: string;
  }>;
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  height?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

const LocationIQMap: React.FC<LocationIQMapProps> = ({
  center = { lat: 12.9716, lng: 77.5946 },
  zoom = 12,
  markers = [],
  onLocationSelect,
  height = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userLocationMarkerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);
  const routeLayersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const [nearbyDistances, setNearbyDistances] = useState<{ [key: string]: { distance: string; time: string; distanceKm: number } }>({});
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const navigate = useNavigate();

  const API_KEY = 'pk.5238c69c53717efd6ffccd5ce204f3d7';

  useEffect(() => {
    const loadLeaflet = () => {
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      cssLink.crossOrigin = '';
      document.head.appendChild(cssLink);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = initializeMap;
      script.onerror = () => {
        setError('Failed to load map library');
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.L) return;

      try {
        const map = window.L.map(mapRef.current).setView([center.lat, center.lng], zoom);

        window.L.tileLayer(`https://tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${API_KEY}`, {
          attribution: '&copy; <a href="https://locationiq.com/">LocationIQ</a> &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        mapInstanceRef.current = map;

        // Add markers for JCBs and jobs
        markers.forEach(marker => {
          const markerColor = marker.type === 'operator' ? '#FF6500' : '#007CFF';
          
          const customIcon = window.L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                     <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
                   </div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const leafletMarker = window.L.marker([marker.lat, marker.lng], { icon: customIcon }).addTo(map);
          
          leafletMarker.on('click', () => {
            setSelectedMarker(marker);
          });
        });

        if (onLocationSelect) {
          map.on('click', async (e: any) => {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            
            try {
              const response = await fetch(
                `https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${lat}&lon=${lng}&format=json`
              );
              const data = await response.json();
              const address = data.display_name || `${lat}, ${lng}`;
              onLocationSelect({ lat, lng, address });
            } catch (error) {
              onLocationSelect({ lat, lng, address: `${lat}, ${lng}` });
            }
          });
        }

        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map');
      }
    };

    if (!window.L) {
      loadLeaflet();
    } else {
      initializeMap();
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [center, zoom, markers, onLocationSelect]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const drawRoute = async (userLat: number, userLng: number, destLat: number, destLng: number, isNearest: boolean = false) => {
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/directions/driving/${userLng},${userLat};${destLng},${destLat}?key=${API_KEY}&steps=true&geometries=geojson&overview=full`
      );
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
        
        const routeColor = isNearest ? '#22C55E' : '#3B82F6'; // Green for nearest, blue for others
        const routeLine = window.L.polyline(coordinates, {
          color: routeColor,
          weight: 4,
          opacity: 0.8
        }).addTo(mapInstanceRef.current);
        
        routeLayersRef.current.push(routeLine);
      }
    } catch (error) {
      console.error('Error drawing route:', error);
    }
  };

  const updateDistances = async (userLat: number, userLng: number) => {
    const distances: { [key: string]: { distance: string; time: string; distanceKm: number } } = {};
    
    // Clear existing routes
    routeLayersRef.current.forEach(layer => {
      if (mapInstanceRef.current && layer) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });
    routeLayersRef.current = [];
    
    let nearestDistance = Infinity;
    let nearestMarkerId = '';
    
    for (const marker of markers) {
      const distance = calculateDistance(userLat, userLng, marker.lat, marker.lng);
      const distanceText = distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
      
      const timeInMinutes = Math.round((distance / 30) * 60);
      const timeText = timeInMinutes < 60 ? `${timeInMinutes}min` : `${Math.floor(timeInMinutes/60)}h ${timeInMinutes%60}min`;
      
      distances[marker.id] = { distance: distanceText, time: timeText, distanceKm: distance };
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestMarkerId = marker.id;
      }
    }
    
    setNearbyDistances(distances);
    
    // Draw routes to all markers
    for (const marker of markers) {
      const isNearest = marker.id === nearestMarkerId;
      await drawRoute(userLat, userLng, marker.lat, marker.lng, isNearest);
    }
  };

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsTrackingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setUserLocation(pos);
        updateUserLocationOnMap(pos);
        updateDistances(pos.lat, pos.lng);
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([pos.lat, pos.lng], 15);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to retrieve your location');
        setIsTrackingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setUserLocation(pos);
        updateUserLocationOnMap(pos);
        updateDistances(pos.lat, pos.lng);
      },
      (error) => {
        console.error('Error watching location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  };

  const stopLocationTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTrackingLocation(false);
    
    // Clear routes
    routeLayersRef.current.forEach(layer => {
      if (mapInstanceRef.current && layer) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });
    routeLayersRef.current = [];
    
    if (userLocationMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
      userLocationMarkerRef.current = null;
    }
    setUserLocation(null);
    setNearbyDistances({});
  };

  const updateUserLocationOnMap = (position: { lat: number; lng: number }) => {
    if (!mapInstanceRef.current || !window.L) return;

    if (userLocationMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
    }

    const userIcon = window.L.divIcon({
      className: 'user-location-icon',
      html: `<div style="background-color: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); position: relative;">
               <div style="width: 6px; height: 6px; background-color: white; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
             </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    userLocationMarkerRef.current = window.L.marker([position.lat, position.lng], { icon: userIcon })
      .addTo(mapInstanceRef.current);
  };

  const handleBookNow = (marker: any) => {
    console.log('Booking JCB:', marker);
    navigate('/auth');
  };

  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg border"
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-red-600 mb-2">Map Loading Error</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        style={{ height }}
        className="rounded-lg border shadow-lg"
      />
      
      {/* Live Location Control */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={isTrackingLocation ? stopLocationTracking : startLocationTracking}
          size="sm"
          variant={isTrackingLocation ? "destructive" : "default"}
          className={`${
            isTrackingLocation 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-blue-500 hover:bg-blue-600"
          } text-white shadow-lg`}
        >
          <Navigation className={`h-4 w-4 mr-2 ${isTrackingLocation ? 'animate-pulse' : ''}`} />
          {isTrackingLocation ? 'Stop Live Location' : 'Live Location'}
        </Button>
      </div>

      {/* Location Status */}
      {userLocation && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg z-10">
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="h-4 w-4 mr-1 text-blue-500" />
            <span>Live: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</span>
          </div>
        </div>
      )}

      {/* JCB Details Popup */}
      {selectedMarker && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">{selectedMarker.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMarker(null)}
                className="p-1 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {selectedMarker.type === 'operator' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">₹{selectedMarker.hourlyRate}</span>
                  <span className="text-gray-600">/hour</span>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Operator Details:</h4>
                  <p className="text-gray-700">{selectedMarker.operatorName}</p>
                  <div className="flex items-center mt-1">
                    <Phone className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedMarker.phone}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMarker.features?.map((feature: string, index: number) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {nearbyDistances[selectedMarker.id] && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span>📍 Distance: {nearbyDistances[selectedMarker.id].distance}</span>
                      <span>🕒 Time: {nearbyDistances[selectedMarker.id].time}</span>
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  onClick={() => handleBookNow(selectedMarker)}
                >
                  Book Now
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">₹{selectedMarker.budget}</span>
                  <span className="text-gray-600">budget</span>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Job Details:</h4>
                  <p className="text-gray-700">Client: {selectedMarker.clientName}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-600">Duration: {selectedMarker.duration}</span>
                  </div>
                </div>
                
                {nearbyDistances[selectedMarker.id] && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span>📍 Distance: {nearbyDistances[selectedMarker.id].distance}</span>
                      <span>🕒 Time: {nearbyDistances[selectedMarker.id].time}</span>
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  onClick={() => handleBookNow(selectedMarker)}
                >
                  Apply for Job
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg"
          style={{ height }}
        >
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-2" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationIQMap;

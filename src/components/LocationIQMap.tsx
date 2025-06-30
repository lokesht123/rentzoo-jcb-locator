
import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Navigation, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationIQMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    type: 'operator' | 'job';
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
  center = { lat: 12.9716, lng: 77.5946 }, // Bangalore coordinates
  zoom = 12,
  markers = [],
  onLocationSelect,
  height = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userLocationMarkerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const [nearbyDistances, setNearbyDistances] = useState<{ [key: string]: { distance: string; time: string } }>({});

  const API_KEY = 'pk.5238c69c53717efd6ffccd5ce204f3d7';

  useEffect(() => {
    const loadLeaflet = () => {
      // Load Leaflet CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      cssLink.crossOrigin = '';
      document.head.appendChild(cssLink);

      // Load Leaflet JS
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
        // Initialize the map
        const map = window.L.map(mapRef.current).setView([center.lat, center.lng], zoom);

        // Add LocationIQ tile layer
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
            html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;">
                     <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
                   </div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const leafletMarker = window.L.marker([marker.lat, marker.lng], { icon: customIcon }).addTo(map);
          
          leafletMarker.bindPopup(`
            <div class="p-3">
              <strong>${marker.title}</strong><br/>
              <span class="text-sm text-gray-600">Type: ${marker.type}</span>
              <div id="distance-${marker.id}" class="text-sm text-blue-600 mt-1"></div>
            </div>
          `);
        });

        // Add click listener for location selection
        if (onLocationSelect) {
          map.on('click', async (e: any) => {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            
            try {
              // Reverse geocoding to get address
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

    // Load Leaflet if not already loaded
    if (!window.L) {
      loadLeaflet();
    } else {
      initializeMap();
    }

    return () => {
      // Cleanup location tracking when component unmounts
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [center, zoom, markers, onLocationSelect]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  const updateDistances = async (userLat: number, userLng: number) => {
    const distances: { [key: string]: { distance: string; time: string } } = {};
    
    for (const marker of markers) {
      const distance = calculateDistance(userLat, userLng, marker.lat, marker.lng);
      const distanceText = distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
      
      // Estimate travel time (assuming 30 km/h average speed in city)
      const timeInMinutes = Math.round((distance / 30) * 60);
      const timeText = timeInMinutes < 60 ? `${timeInMinutes}min` : `${Math.floor(timeInMinutes/60)}h ${timeInMinutes%60}min`;
      
      distances[marker.id] = { distance: distanceText, time: timeText };
    }
    
    setNearbyDistances(distances);
    
    // Update popup content with distances
    markers.forEach(marker => {
      const distanceElement = document.getElementById(`distance-${marker.id}`);
      if (distanceElement && distances[marker.id]) {
        distanceElement.innerHTML = `📍 ${distances[marker.id].distance} • 🕒 ${distances[marker.id].time}`;
      }
    });
  };

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsTrackingLocation(true);
    setError(null);

    // Get current position first
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setUserLocation(pos);
        updateUserLocationOnMap(pos);
        updateDistances(pos.lat, pos.lng);
        
        // Center map on user location
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

    // Watch position for real-time updates
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
    
    // Remove user location marker
    if (userLocationMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
      userLocationMarkerRef.current = null;
    }
    setUserLocation(null);
    setNearbyDistances({});
  };

  const updateUserLocationOnMap = (position: { lat: number; lng: number }) => {
    if (!mapInstanceRef.current || !window.L) return;

    // Remove existing user location marker
    if (userLocationMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
    }

    // Create user location icon
    const userIcon = window.L.divIcon({
      className: 'user-location-icon',
      html: `<div style="background-color: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); position: relative;">
               <div style="width: 6px; height: 6px; background-color: white; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
             </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    // Create new user location marker
    userLocationMarkerRef.current = window.L.marker([position.lat, position.lng], { icon: userIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup('<div class="p-2"><strong>Your Location</strong><br/>Live tracking active</div>');
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

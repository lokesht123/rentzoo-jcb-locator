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
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearbyDistances, setNearbyDistances] = useState<{ [key: string]: { distance: string; time: string; distanceKm: number } }>({});
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const navigate = useNavigate();

  const API_KEY = 'pk.5238c69c53717efd6ffccd5ce204f3d7';

  // Check location permission status
  const checkLocationPermission = async () => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setLocationPermissionStatus(permission.state as 'prompt' | 'granted' | 'denied');
        console.log('Location permission status:', permission.state);
        
        permission.addEventListener('change', () => {
          setLocationPermissionStatus(permission.state as 'prompt' | 'granted' | 'denied');
          console.log('Permission changed to:', permission.state);
        });
      } catch (error) {
        console.log('Permission API not available:', error);
      }
    }
  };

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    // Cleanup function
    const cleanup = () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      
      // Clear all route layers
      routeLayersRef.current.forEach(layer => {
        try {
          if (mapInstanceRef.current && layer && mapInstanceRef.current.hasLayer && mapInstanceRef.current.hasLayer(layer)) {
            mapInstanceRef.current.removeLayer(layer);
          }
        } catch (e) {
          console.log('Error removing route layer:', e);
        }
      });
      routeLayersRef.current = [];
      
      // Remove user location marker
      if (userLocationMarkerRef.current && mapInstanceRef.current) {
        try {
          if (mapInstanceRef.current.hasLayer && mapInstanceRef.current.hasLayer(userLocationMarkerRef.current)) {
            mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
          }
        } catch (e) {
          console.log('Error removing user marker:', e);
        }
        userLocationMarkerRef.current = null;
      }
      
      // Remove map instance
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.log('Error removing map:', e);
        }
        mapInstanceRef.current = null;
      }
    };

    // Clean up before initializing
    cleanup();

    const loadLeaflet = () => {
      // Check if CSS is already loaded
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        cssLink.crossOrigin = '';
        document.head.appendChild(cssLink);
      }

      // Check if script is already loaded
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = initializeMap;
        script.onerror = () => {
          setError('Failed to load map library');
        };
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.L) return;

      try {
        // Clear and prepare container
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
          // Remove any existing Leaflet classes
          mapRef.current.className = mapRef.current.className.replace(/leaflet-\S+/g, '');
        }

        // Create map with error handling
        const map = window.L.map(mapRef.current, {
          zoomControl: true,
          attributionControl: true
        }).setView([center.lat, center.lng], zoom);

        // Add tiles
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
            html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
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

        // Handle map clicks
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
        console.log('Map initialized successfully');
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map');
      }
    };

    loadLeaflet();

    return cleanup;
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
    if (!mapInstanceRef.current || !window.L) return;
    
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/directions/driving/${userLng},${userLat};${destLng},${destLat}?key=${API_KEY}&steps=true&geometries=geojson&overview=full`
      );
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
        
        const routeColor = isNearest ? '#22C55E' : '#3B82F6';
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
    
    // Clear existing routes safely
    routeLayersRef.current.forEach(layer => {
      try {
        if (mapInstanceRef.current && layer && mapInstanceRef.current.hasLayer && mapInstanceRef.current.hasLayer(layer)) {
          mapInstanceRef.current.removeLayer(layer);
        }
      } catch (e) {
        console.log('Error removing route:', e);
      }
    });
    routeLayersRef.current = [];
    
    let nearestDistance = Infinity;
    let nearestMarkerId = '';
    
    // Calculate distances and find nearest
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
    
    // Draw routes (green for nearest, blue for others)
    for (const marker of markers) {
      const isNearest = marker.id === nearestMarkerId;
      await drawRoute(userLat, userLng, marker.lat, marker.lng, isNearest);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by this browser');
        resolve(false);
        return;
      }

      console.log('Requesting location permission...');
      
      // First try to get current position to trigger permission prompt
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Permission granted, got location:', position.coords);
          setLocationPermissionStatus('granted');
          resolve(true);
        },
        (error) => {
          console.error('Permission denied or error:', error);
          
          let errorMessage = 'Unable to access your location';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions in your browser and try again.';
              setLocationPermissionStatus('denied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Your location is unavailable. Please check your GPS settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          
          setLocationError(errorMessage);
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const startLocationTracking = async () => {
    console.log('Starting location tracking...');
    setIsTrackingLocation(true);
    setLocationError(null);
    setError(null);

    // Request permission first
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      setIsTrackingLocation(false);
      return;
    }

    // Start watching for location changes
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        console.log('Location updated:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setUserLocation(newPos);
        updateUserLocationOnMap(newPos);
        updateDistances(newPos.lat, newPos.lng);
        
        // Center map on user location on first update
        if (mapInstanceRef.current && !userLocation) {
          mapInstanceRef.current.setView([newPos.lat, newPos.lng], 15);
        }
      },
      (error) => {
        console.error('Error watching location:', error);
        let errorMessage = 'Unable to track your location';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please enable location permissions and try again.';
            setLocationPermissionStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000
      }
    );
  };

  const stopLocationTracking = () => {
    console.log('Stopping location tracking...');
    
    // Clear watch position
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    setIsTrackingLocation(false);
    setLocationError(null);
    
    // Clear routes safely
    routeLayersRef.current.forEach(layer => {
      try {
        if (mapInstanceRef.current && layer && mapInstanceRef.current.hasLayer && mapInstanceRef.current.hasLayer(layer)) {
          mapInstanceRef.current.removeLayer(layer);
        }
      } catch (e) {
        console.log('Error removing route:', e);
      }
    });
    routeLayersRef.current = [];
    
    // Remove user location marker safely
    if (userLocationMarkerRef.current && mapInstanceRef.current) {
      try {
        if (mapInstanceRef.current.hasLayer && mapInstanceRef.current.hasLayer(userLocationMarkerRef.current)) {
          mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
        }
      } catch (e) {
        console.log('Error removing user marker:', e);
      }
      userLocationMarkerRef.current = null;
    }
    
    setUserLocation(null);
    setNearbyDistances({});
  };

  const updateUserLocationOnMap = (position: { lat: number; lng: number }) => {
    if (!mapInstanceRef.current || !window.L) return;

    // Remove existing user location marker safely
    if (userLocationMarkerRef.current) {
      try {
        if (mapInstanceRef.current.hasLayer && mapInstanceRef.current.hasLayer(userLocationMarkerRef.current)) {
          mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
        }
      } catch (e) {
        console.log('Error removing existing user marker:', e);
      }
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

    // Add new user location marker
    try {
      userLocationMarkerRef.current = window.L.marker([position.lat, position.lng], { icon: userIcon })
        .addTo(mapInstanceRef.current);
      console.log('User location marker updated:', position);
    } catch (e) {
      console.error('Error adding user location marker:', e);
    }
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
        <div className="text-center p-4">
          <p className="text-red-600 mb-2 font-semibold">Map Loading Error</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          {locationError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
              <p className="text-yellow-800 text-sm">{locationError}</p>
            </div>
          )}
          <Button 
            onClick={() => {
              setError(null);
              setLocationError(null);
              window.location.reload();
            }}
            className="mt-2"
          >
            Retry
          </Button>
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
      
      {/* Live Location Control - Enhanced positioning and visibility */}
      <div className="absolute top-4 right-4 z-[2000] pointer-events-auto">
        <Button
          onClick={isTrackingLocation ? stopLocationTracking : startLocationTracking}
          size="sm"
          variant={isTrackingLocation ? "destructive" : "default"}
          className={`${
            isTrackingLocation 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-blue-500 hover:bg-blue-600"
          } text-white shadow-lg border-2 border-white`}
          style={{ minWidth: '140px' }}
        >
          <Navigation className={`h-4 w-4 mr-2 ${isTrackingLocation ? 'animate-pulse' : ''}`} />
          {isTrackingLocation ? 'Stop Location' : 'Live Location'}
        </Button>
      </div>

      {/* Permission Status and Error Display */}
      {locationError && !error && (
        <div className="absolute top-16 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-lg z-[1999] max-w-xs">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <MapPin className="h-4 w-4 text-yellow-600 mt-0.5" />
            </div>
            <div className="ml-2">
              <p className="text-sm text-yellow-800">{locationError}</p>
              {locationPermissionStatus === 'denied' && (
                <p className="text-xs text-yellow-700 mt-1">
                  Go to browser settings → Site permissions → Location → Allow
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Status Display */}
      {userLocation && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg z-[1999]">
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="h-4 w-4 mr-1 text-blue-500" />
            <span>Live: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</span>
          </div>
        </div>
      )}

      {/* JCB Details Popup */}
      {selectedMarker && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[2001]">
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


import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Navigation, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GoogleMapProps {
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
    google: typeof google;
    initMap: () => void;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center = { lat: 12.9716, lng: 77.5946 }, // Bangalore coordinates
  zoom = 12,
  markers = [],
  onLocationSelect,
  height = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const userLocationMarkerRef = useRef<google.maps.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      try {
        // Initialize the map
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true
        });

        mapInstanceRef.current = map;

        // Add markers
        markers.forEach(marker => {
          const mapMarker = new window.google.maps.Marker({
            position: { lat: marker.lat, lng: marker.lng },
            map,
            title: marker.title,
            icon: {
              url: marker.type === 'operator' 
                ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5QzkuNSA3LjYyIDEwLjYyIDYuNSAxMiA2LjVDMTMuMzggNi41IDE0LjUgNy42MiAxNC41IDlDMTQuNSAxMC4zOCAxMy4zOCAxMS41IDEyIDExLjVaIiBmaWxsPSIjRkY2NTAwIi8+Cjwvc3ZnPgo='
                : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5QzkuNSA3LjYyIDEwLjYyIDYuNSAxMiA2LjVDMTMuMzggNi41IDE0LjUgNy42MiAxNC41IDlDMTQuNSAxMC4zOCAxMy4zOCAxMS41IDEyIDExLjVaIiBmaWxsPSIjMDA3Q0ZGIi8+Cjwvc3ZnPgo=',
              scaledSize: window.google.maps && new window.google.maps.Size(32, 32),
              anchor: window.google.maps && new window.google.maps.Point(16, 32)
            }
          });

          // Add info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div class="p-2"><strong>${marker.title}</strong><br/>Type: ${marker.type}</div>`
          });

          mapMarker.addListener('click', () => {
            infoWindow.open(map, mapMarker);
          });
        });

        // Add click listener for location selection
        if (onLocationSelect) {
          map.addListener('click', async (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();
              
              // Reverse geocoding to get address
              const geocoder = new window.google.maps.Geocoder();
              try {
                const result = await geocoder.geocode({ location: { lat, lng } });
                const address = result.results[0]?.formatted_address || `${lat}, ${lng}`;
                onLocationSelect({ lat, lng, address });
              } catch (error) {
                onLocationSelect({ lat, lng, address: `${lat}, ${lng}` });
              }
            }
          });
        }

        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map. Please check your Google Maps API key.');
        setShowApiKeyInput(true);
      }
    };

    const loadGoogleMaps = (apiKey: string) => {
      // Remove existing script if any
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        setError('Failed to load Google Maps. Please check your API key and try again.');
        setShowApiKeyInput(true);
      };
      document.head.appendChild(script);
    };

    // Load Google Maps API if not already loaded
    if (!window.google?.maps) {
      const apiKey = customApiKey || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dO4XCFyYdnmJZg';
      loadGoogleMaps(apiKey);
    } else {
      initializeMap();
    }

    return () => {
      // Cleanup location tracking when component unmounts
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [center, zoom, markers, onLocationSelect, customApiKey]);

  const handleApiKeySubmit = () => {
    if (customApiKey.trim()) {
      setError(null);
      setIsLoaded(false);
      setShowApiKeyInput(false);
      // Trigger re-initialization with new API key
      const apiKey = customApiKey;
      const loadGoogleMaps = (apiKey: string) => {
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          existingScript.remove();
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (!mapRef.current || !window.google) return;
          try {
            const map = new window.google.maps.Map(mapRef.current, {
              center,
              zoom,
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true
            });
            mapInstanceRef.current = map;
            setIsLoaded(true);
            setError(null);
          } catch (err) {
            setError('Invalid API key. Please try again.');
            setShowApiKeyInput(true);
          }
        };
        script.onerror = () => {
          setError('Failed to load Google Maps. Please check your API key.');
          setShowApiKeyInput(true);
        };
        document.head.appendChild(script);
      };
      loadGoogleMaps(apiKey);
    }
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
        
        // Center map on user location
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(pos);
          mapInstanceRef.current.setZoom(15);
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
    if (userLocationMarkerRef.current) {
      userLocationMarkerRef.current.setMap(null);
      userLocationMarkerRef.current = null;
    }
    setUserLocation(null);
  };

  const updateUserLocationOnMap = (position: { lat: number; lng: number }) => {
    if (!mapInstanceRef.current || !window.google) return;

    // Remove existing user location marker
    if (userLocationMarkerRef.current) {
      userLocationMarkerRef.current.setMap(null);
    }

    // Create new user location marker
    userLocationMarkerRef.current = new window.google.maps.Marker({
      position,
      map: mapInstanceRef.current,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="#ffffff" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="#ffffff"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24),
        anchor: new window.google.maps.Point(12, 12)
      }
    });

    // Add info window for user location
    const infoWindow = new window.google.maps.InfoWindow({
      content: '<div class="p-2"><strong>Your Location</strong><br/>Live tracking active</div>'
    });

    userLocationMarkerRef.current.addListener('click', () => {
      infoWindow.open(mapInstanceRef.current, userLocationMarkerRef.current);
    });
  };

  if (error && showApiKeyInput) {
    return (
      <div 
        className="flex flex-col items-center justify-center bg-gray-100 rounded-lg border p-6"
        style={{ height }}
      >
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Google Maps API Key Required</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <div className="space-y-3">
            <div>
              <Label htmlFor="api-key">Enter your Google Maps API Key:</Label>
              <Input
                id="api-key"
                type="text"
                placeholder="Your Google Maps API Key"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleApiKeySubmit} className="w-full">
              Load Map
            </Button>
            <p className="text-xs text-gray-500">
              Get your API key from{' '}
              <a 
                href="https://console.cloud.google.com/apis/credentials" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Google Cloud Console
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !showApiKeyInput) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg border"
        style={{ height }}
      >
        <div className="text-center">
          <p className="text-red-600 mb-2">Map Loading Error</p>
          <p className="text-sm text-gray-600">{error}</p>
          <Button 
            onClick={() => setShowApiKeyInput(true)} 
            variant="outline" 
            className="mt-3"
          >
            Enter API Key
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

export default GoogleMap;


import React, { useState } from 'react';
import GoogleMap from './GoogleMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';

const MapView = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 });

  const jcbLocations = [
    { 
      id: '1', 
      lat: 12.9716, 
      lng: 77.5946, 
      title: 'JCB 3DX Super - Available', 
      type: 'operator' as const 
    },
    { 
      id: '2', 
      lat: 12.9700, 
      lng: 77.5950, 
      title: 'JCB 3CX Eco - Available', 
      type: 'operator' as const 
    },
    { 
      id: '3', 
      lat: 12.9680, 
      lng: 77.5920, 
      title: 'Excavation Project - Active Job', 
      type: 'job' as const 
    }
  ];

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    console.log('Selected location:', location);
    setMapCenter({ lat: location.lat, lng: location.lng });
  };

  const searchLocation_handler = async () => {
    if (!searchLocation.trim()) return;

    try {
      if (window.google?.maps) {
        const geocoder = new window.google.maps.Geocoder();
        const result = await geocoder.geocode({ address: searchLocation });
        
        if (result.results[0]) {
          const location = result.results[0].geometry.location;
          setMapCenter({
            lat: location.lat(),
            lng: location.lng()
          });
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-5 w-5" />
          <Input
            placeholder="Search for a location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="pl-12"
            onKeyPress={(e) => e.key === 'Enter' && searchLocation_handler()}
          />
        </div>
        <Button onClick={searchLocation_handler} className="bg-orange-500 hover:bg-orange-600">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Map */}
      <GoogleMap
        center={mapCenter}
        zoom={13}
        markers={jcbLocations}
        onLocationSelect={handleLocationSelect}
        height="400px"
      />

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
          <span>Available Operators</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span>Active Jobs</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;

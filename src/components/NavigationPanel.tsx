
import React, { useState } from 'react';
import { MapPin, Navigation, Route, Search, Loader2, X, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useRoute } from '../contexts/RouteContext';

interface NavigationPanelProps {
  isOnline: boolean;
}

const NavigationPanel = ({ isOnline }: NavigationPanelProps) => {
  const { 
    startLocation, 
    endLocation, 
    route,
    isCalculating,
    error,
    setStartLocation, 
    setEndLocation, 
    calculateRoute,
    clearRoute 
  } = useRoute();
  
  const [localStart, setLocalStart] = useState(startLocation);
  const [localEnd, setLocalEnd] = useState(endLocation);

  const handleStartRoute = async () => {
    if (!localStart || !localEnd) return;
    
    setStartLocation(localStart);
    setEndLocation(localEnd);
    await calculateRoute(localStart, localEnd);
  };

  const handleClearRoute = () => {
    clearRoute();
    setLocalStart('');
    setLocalEnd('');
    setStartLocation('');
    setEndLocation('');
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setLocalStart(locationString);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your current location. Please enter it manually.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="w-full lg:w-80 bg-white shadow-lg border-r border-emerald-100">
      <div className="p-4 space-y-4">
        <Card className="p-4 bg-emerald-50 border-emerald-200">
          <h2 className="text-lg font-semibold text-emerald-800 mb-3 flex items-center gap-2">
            <Route className="w-5 h-5" />
            Plan Your Route
          </h2>
          
          <div className="space-y-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-emerald-600" />
              <Input
                placeholder="From (e.g., New York)"
                value={localStart}
                onChange={(e) => setLocalStart(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-400"
                disabled={isCalculating}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={getCurrentLocation}
                className="absolute right-2 top-2 h-6 px-2 text-xs"
                disabled={isCalculating}
              >
                GPS
              </Button>
            </div>
            
            <div className="relative">
              <Navigation className="absolute left-3 top-3 w-4 h-4 text-red-500" />
              <Input
                placeholder="To (e.g., Boston)"
                value={localEnd}
                onChange={(e) => setLocalEnd(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-400"
                disabled={isCalculating}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleStartRoute}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={!localStart || !localEnd || isCalculating}
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Finding...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Find Route
                  </>
                )}
              </Button>
              
              {route && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClearRoute}
                  disabled={isCalculating}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Route Information */}
        {route && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Route className="w-4 h-4" />
              Route Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Distance:</span>
                <span className="font-medium">{formatDistance(route.distance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Duration:</span>
                <span className="font-medium">{formatDuration(route.duration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Status:</span>
                <span className="font-medium">
                  {isOnline ? 'Live Route' : 'Cached Route'}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Offline Features</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Maps cached automatically</li>
            <li>• GPS location works offline</li>
            <li>• Route guidance available</li>
            <li>• Previous routes cached</li>
            <li>• {isOnline ? 'Currently syncing' : 'Using cached data'}</li>
          </ul>
        </Card>

        {!isOnline && (
          <Card className="p-4 bg-amber-50 border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">Offline Mode Active</h3>
            <p className="text-sm text-amber-700">
              You're currently offline. EcoMap is using cached map data and GPS for navigation.
              {route && ' Your current route is available offline.'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NavigationPanel;

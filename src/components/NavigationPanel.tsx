
import React, { useState } from 'react';
import { MapPin, Navigation, Route, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useRoute } from '../contexts/RouteContext';

interface NavigationPanelProps {
  isOnline: boolean;
}

const NavigationPanel = ({ isOnline }: NavigationPanelProps) => {
  const { startLocation, endLocation, setStartLocation, setEndLocation, calculateRoute } = useRoute();
  const [localStart, setLocalStart] = useState(startLocation);
  const [localEnd, setLocalEnd] = useState(endLocation);

  const handleStartRoute = () => {
    setStartLocation(localStart);
    setEndLocation(localEnd);
    calculateRoute(localStart, localEnd);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocalStart(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
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
              />
              <Button
                size="sm"
                variant="outline"
                onClick={getCurrentLocation}
                className="absolute right-2 top-2 h-6 px-2 text-xs"
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
              />
            </div>
            
            <Button 
              onClick={handleStartRoute}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={!localStart || !localEnd}
            >
              <Search className="w-4 h-4 mr-2" />
              Find Route
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Offline Features</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Maps cached automatically</li>
            <li>• GPS location works offline</li>
            <li>• Route guidance available</li>
            <li>• {isOnline ? 'Currently syncing' : 'Using cached data'}</li>
          </ul>
        </Card>

        {!isOnline && (
          <Card className="p-4 bg-amber-50 border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">Offline Mode Active</h3>
            <p className="text-sm text-amber-700">
              You're currently offline. EcoMap is using cached map data and GPS for navigation.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NavigationPanel;

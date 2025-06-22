
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RoutingService } from '../services/routingService';

interface RouteInfo {
  coordinates: [number, number][];
  distance: number;
  duration: number;
}

interface RouteContextType {
  startLocation: string;
  endLocation: string;
  route: RouteInfo | null;
  isCalculating: boolean;
  error: string | null;
  setStartLocation: (location: string) => void;
  setEndLocation: (location: string) => void;
  calculateRoute: (start: string, end: string) => Promise<void>;
  clearRoute: () => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
};

interface RouteProviderProps {
  children: ReactNode;
}

export const RouteProvider = ({ children }: RouteProviderProps) => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRoute = async (start: string, end: string) => {
    if (!start || !end) {
      setError('Both start and end locations are required');
      return;
    }

    setIsCalculating(true);
    setError(null);
    
    try {
      console.log('Calculating route from', start, 'to', end);
      
      // Geocode both locations
      const startCoords = await RoutingService.geocodeLocation(start);
      const endCoords = await RoutingService.geocodeLocation(end);
      
      if (!startCoords) {
        throw new Error(`Could not find location: ${start}`);
      }
      
      if (!endCoords) {
        throw new Error(`Could not find location: ${end}`);
      }
      
      // Calculate route
      const routeData = await RoutingService.calculateRoute(startCoords, endCoords);
      
      if (!routeData) {
        throw new Error('Could not calculate route');
      }
      
      setRoute(routeData);
      
      // Store route in localStorage for offline access
      localStorage.setItem('ecomap-current-route', JSON.stringify({
        start,
        end,
        startCoords,
        endCoords,
        route: routeData,
        timestamp: Date.now()
      }));
      
      console.log('Route calculated successfully:', routeData);
      
    } catch (error) {
      console.error('Error calculating route:', error);
      setError(error instanceof Error ? error.message : 'Failed to calculate route');
      
      // Try to load from cache if online request fails
      const cachedRoute = localStorage.getItem('ecomap-current-route');
      if (cachedRoute) {
        try {
          const parsed = JSON.parse(cachedRoute);
          if (parsed.route) {
            setRoute(parsed.route);
            setError('Using cached route (offline)');
          }
        } catch (e) {
          console.error('Failed to parse cached route:', e);
        }
      }
    } finally {
      setIsCalculating(false);
    }
  };

  const clearRoute = () => {
    setRoute(null);
    setError(null);
    localStorage.removeItem('ecomap-current-route');
  };

  return (
    <RouteContext.Provider value={{
      startLocation,
      endLocation,
      route,
      isCalculating,
      error,
      setStartLocation,
      setEndLocation,
      calculateRoute,
      clearRoute
    }}>
      {children}
    </RouteContext.Provider>
  );
};

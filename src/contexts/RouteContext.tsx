
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RouteContextType {
  startLocation: string;
  endLocation: string;
  route: [number, number][];
  setStartLocation: (location: string) => void;
  setEndLocation: (location: string) => void;
  calculateRoute: (start: string, end: string) => void;
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
  const [route, setRoute] = useState<[number, number][]>([]);

  const calculateRoute = async (start: string, end: string) => {
    console.log('Calculating route from', start, 'to', end);
    
    // For demo purposes, create a simple route between two points
    // In a real app, you'd use a routing service like OSRM
    try {
      const startCoords = await geocodeLocation(start);
      const endCoords = await geocodeLocation(end);
      
      if (startCoords && endCoords) {
        // Simple straight line route for demo
        const routePoints: [number, number][] = [
          startCoords,
          // Add some intermediate points for a more realistic route
          [
            (startCoords[0] + endCoords[0]) / 2 + (Math.random() - 0.5) * 0.01,
            (startCoords[1] + endCoords[1]) / 2 + (Math.random() - 0.5) * 0.01
          ],
          endCoords
        ];
        
        setRoute(routePoints);
        
        // Store route in localStorage for offline access
        localStorage.setItem('ecomap-route', JSON.stringify({
          start,
          end,
          route: routePoints,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      
      // Try to load from cache if online request fails
      const cachedRoute = localStorage.getItem('ecomap-route');
      if (cachedRoute) {
        const parsed = JSON.parse(cachedRoute);
        setRoute(parsed.route);
      }
    }
  };

  const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
    // Simple geocoding - in a real app, use a proper geocoding service
    // For now, check if it's already coordinates
    const coordMatch = location.match(/([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)/);
    if (coordMatch) {
      return [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])];
    }
    
    // Mock geocoding for common cities
    const cityCoords: Record<string, [number, number]> = {
      'new york': [40.7128, -74.0060],
      'boston': [42.3601, -71.0589],
      'philadelphia': [39.9526, -75.1652],
      'washington': [38.9072, -77.0369],
      'miami': [25.7617, -80.1918],
      'chicago': [41.8781, -87.6298],
      'los angeles': [34.0522, -118.2437],
      'san francisco': [37.7749, -122.4194],
    };
    
    const normalized = location.toLowerCase().trim();
    return cityCoords[normalized] || null;
  };

  return (
    <RouteContext.Provider value={{
      startLocation,
      endLocation,
      route,
      setStartLocation,
      setEndLocation,
      calculateRoute
    }}>
      {children}
    </RouteContext.Provider>
  );
};

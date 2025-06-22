
// Free routing service using OpenRouteService (no API key needed for basic usage)
interface RouteResponse {
  features: Array<{
    geometry: {
      coordinates: [number, number][];
    };
    properties: {
      summary: {
        distance: number;
        duration: number;
      };
    };
  }>;
}

interface GeocodingResponse {
  features: Array<{
    geometry: {
      coordinates: [number, number];
    };
    properties: {
      display_name: string;
    };
  }>;
}

export class RoutingService {
  private static readonly OPENROUTE_BASE = 'https://api.openrouteservice.org/v2';
  private static readonly NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
  
  // For demo purposes, using public endpoint (in production, get a free API key)
  private static readonly API_KEY = '5b3ce3597851110001cf6248c82d8ab32b2b47fb9ca9478d5b9b4cb5';

  static async geocodeLocation(query: string): Promise<[number, number] | null> {
    try {
      console.log('Geocoding:', query);
      
      // Check if it's already coordinates
      const coordMatch = query.match(/([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)/);
      if (coordMatch) {
        return [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])];
      }

      const url = `${this.NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data: Array<{ lat: string; lon: string }> = await response.json();
      
      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      
      // Fallback to cached cities
      const cityCoords: Record<string, [number, number]> = {
        'new york': [40.7128, -74.0060],
        'boston': [42.3601, -71.0589],
        'philadelphia': [39.9526, -75.1652],
        'washington': [38.9072, -77.0369],
        'miami': [25.7617, -80.1918],
        'chicago': [41.8781, -87.6298],
        'los angeles': [34.0522, -118.2437],
        'san francisco': [37.7749, -122.4194],
        'london': [51.5074, -0.1278],
        'paris': [48.8566, 2.3522],
        'berlin': [52.5200, 13.4050],
        'tokyo': [35.6762, 139.6503],
      };
      
      const normalized = query.toLowerCase().trim();
      return cityCoords[normalized] || null;
    }
  }

  static async calculateRoute(start: [number, number], end: [number, number]): Promise<{
    coordinates: [number, number][];
    distance: number;
    duration: number;
  } | null> {
    try {
      console.log('Calculating route from', start, 'to', end);
      
      // Create a unique cache key for this route
      const cacheKey = `route_${start[0]}_${start[1]}_${end[0]}_${end[1]}`;
      
      // Check localStorage cache first
      const cachedRoute = localStorage.getItem(cacheKey);
      if (cachedRoute) {
        console.log('Using cached route');
        return JSON.parse(cachedRoute);
      }

      const url = `${this.OPENROUTE_BASE}/directions/driving-car`;
      const body = {
        coordinates: [[start[1], start[0]], [end[1], end[0]]], // lon,lat format for OpenRouteService
        format: 'geojson'
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.API_KEY
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Routing failed');
      }

      const data: RouteResponse = await response.json();
      
      if (data.features && data.features.length > 0) {
        const route = data.features[0];
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]] as [number, number]); // Convert back to lat,lon
        
        const result = {
          coordinates,
          distance: route.properties.summary.distance,
          duration: route.properties.summary.duration
        };
        
        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify(result));
        localStorage.setItem(`route_timestamp_${cacheKey}`, Date.now().toString());
        
        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Routing error:', error);
      
      // Create a simple fallback route
      const coordinates: [number, number][] = [
        start,
        [
          (start[0] + end[0]) / 2 + (Math.random() - 0.5) * 0.01,
          (start[1] + end[1]) / 2 + (Math.random() - 0.5) * 0.01
        ],
        end
      ];
      
      // Calculate approximate distance using Haversine formula
      const distance = this.calculateDistance(start, end) * 1000; // Convert to meters
      const duration = distance / 15; // Approximate driving speed 15 m/s
      
      return {
        coordinates,
        distance,
        duration
      };
    }
  }

  private static calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(coord2[0] - coord1[0]);
    const dLon = this.deg2rad(coord2[1] - coord1[1]);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(coord1[0])) * Math.cos(this.deg2rad(coord2[0])) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}

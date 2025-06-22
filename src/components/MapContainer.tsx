
import React, { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { MapPin, Navigation2, Zap, Clock, Route as RouteIcon } from 'lucide-react';
import { useRoute } from '../contexts/RouteContext';
import { useNavigation } from '../contexts/NavigationContext';

interface MapContainerProps {
  isOnline: boolean;
}

declare global {
  interface Window {
    L: any;
  }
}

const MapContainer = ({ isOnline }: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);
  
  const { route, isCalculating, error } = useRoute();
  const { isNavigating, updatePosition } = useNavigation();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && window.L && !mapInstanceRef.current) {
      console.log('Initializing map...');
      
      mapInstanceRef.current = window.L.map(mapRef.current).setView([40.7128, -74.0060], 10);

      const tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      });
      
      tileLayer.addTo(mapInstanceRef.current);
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle user location tracking
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (navigator.geolocation) {
      console.log('Starting location tracking...');
      
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      };

      const onSuccess = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        const newLocation: [number, number] = [latitude, longitude];
        
        console.log('Location updated:', latitude, longitude);
        setUserLocation(newLocation);
        setLocationError(null);

        // Update navigation if active
        if (isNavigating) {
          updatePosition(newLocation);
        }

        // Update or create user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng(newLocation);
        } else {
          userMarkerRef.current = window.L.marker(newLocation, {
            icon: window.L.divIcon({
              className: 'user-location-marker',
              html: '<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            })
          }).addTo(mapInstanceRef.current);
          
          userMarkerRef.current.bindPopup('Your Location');
        }

        // Center map on user location if no route is active
        if (!route && userLocation === null) {
          mapInstanceRef.current.setView(newLocation, 15);
        }
      };

      const onError = (error: GeolocationPositionError) => {
        console.error('Location error:', error);
        let errorMessage = 'Could not get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setLocationError(errorMessage);
      };

      // Get initial position
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
      
      // Start watching position for continuous tracking
      watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, options);
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, [isNavigating, updatePosition, route, userLocation]);

  // Handle route display
  useEffect(() => {
    if (mapInstanceRef.current && route?.coordinates && route.coordinates.length > 0) {
      console.log('Adding route to map:', route);
      
      // Clear existing route and markers (except user marker)
      if (routeLayerRef.current) {
        mapInstanceRef.current.removeLayer(routeLayerRef.current);
      }
      
      markersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = [];

      // Add route polyline
      routeLayerRef.current = window.L.polyline(route.coordinates, {
        color: isNavigating ? '#059669' : '#3b82f6',
        weight: isNavigating ? 6 : 4,
        opacity: 0.8
      }).addTo(mapInstanceRef.current);

      // Add start and end markers
      const startMarker = window.L.marker(route.coordinates[0], {
        icon: window.L.divIcon({
          className: 'route-marker start-marker',
          html: '<div style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">START</div>',
          iconSize: [50, 20],
          iconAnchor: [25, 10]
        })
      }).addTo(mapInstanceRef.current);
      
      const endMarker = window.L.marker(route.coordinates[route.coordinates.length - 1], {
        icon: window.L.divIcon({
          className: 'route-marker end-marker',
          html: '<div style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">END</div>',
          iconSize: [40, 20],
          iconAnchor: [20, 10]
        })
      }).addTo(mapInstanceRef.current);

      markersRef.current.push(startMarker, endMarker);

      // Fit map to route bounds if not navigating
      if (!isNavigating) {
        mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), { 
          padding: [20, 20] 
        });
      }
    }
  }, [route, isNavigating]);

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
    <div className="relative h-full min-h-[600px]">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Map overlay info */}
      <Card className="absolute top-4 left-4 p-3 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="font-medium">
            {isOnline ? 'Live Maps' : 'Cached Maps'}
          </span>
          {isNavigating && (
            <>
              <div className="w-1 h-1 rounded-full bg-gray-400 mx-1" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-600 font-medium">Navigating</span>
            </>
          )}
        </div>
      </Card>

      {/* Route information */}
      {route && (
        <Card className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur-sm min-w-[200px]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <RouteIcon className="w-4 h-4" />
              <span>Route Info</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-gray-500" />
                <span>{formatDistance(route.distance)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-gray-500" />
                <span>{formatDuration(route.duration)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Loading indicator */}
      {isCalculating && (
        <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
            <span className="text-sm font-medium">Calculating route...</span>
          </div>
        </Card>
      )}

      {/* Error display */}
      {error && (
        <Card className="absolute bottom-4 right-4 p-3 bg-red-50 border-red-200 max-w-xs">
          <div className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </div>
        </Card>
      )}

      {/* Location info */}
      {userLocation && (
        <Card className="absolute bottom-4 left-4 p-3 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm">
            <Navigation2 className="w-4 h-4 text-emerald-600" />
            <span>GPS: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}</span>
          </div>
        </Card>
      )}

      {/* Location error */}
      {locationError && (
        <Card className="absolute bottom-16 left-4 p-3 bg-amber-50 border-amber-200 max-w-xs">
          <div className="text-sm text-amber-800">
            <strong>Location:</strong> {locationError}
          </div>
        </Card>
      )}

      {/* Offline status */}
      {!isOnline && (
        <Card className="absolute bottom-4 center-4 left-1/2 transform -translate-x-1/2 p-3 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <Zap className="w-4 h-4" />
            <span className="font-medium">Offline Navigation Active</span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MapContainer;

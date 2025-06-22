
import React, { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { MapPin, Navigation2, Zap } from 'lucide-react';
import { useRoute } from '../contexts/RouteContext';

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
  const { startLocation, endLocation, route } = useRoute();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (mapRef.current && window.L) {
      // Initialize map
      mapInstanceRef.current = window.L.map(mapRef.current).setView([40.7128, -74.0060], 10);

      // Add OpenStreetMap tiles
      const tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      });
      
      tileLayer.addTo(mapInstanceRef.current);

      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            mapInstanceRef.current.setView([latitude, longitude], 13);
            
            // Add user location marker
            window.L.marker([latitude, longitude])
              .addTo(mapInstanceRef.current)
              .bindPopup('Your Location')
              .openPopup();
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }
      };
    }
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && route.length > 0) {
      // Clear existing route
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer instanceof window.L.Polyline) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Add route polyline
      const polyline = window.L.polyline(route, {
        color: '#059669',
        weight: 4,
        opacity: 0.8
      }).addTo(mapInstanceRef.current);

      // Fit map to route bounds
      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [20, 20] });
    }
  }, [route]);

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
        </div>
      </Card>

      {/* Location info */}
      {userLocation && (
        <Card className="absolute bottom-4 left-4 p-3 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm">
            <Navigation2 className="w-4 h-4 text-emerald-600" />
            <span>GPS: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}</span>
          </div>
        </Card>
      )}

      {/* Offline status */}
      {!isOnline && (
        <Card className="absolute top-4 right-4 p-3 bg-amber-50 border-amber-200">
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

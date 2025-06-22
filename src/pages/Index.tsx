
import React, { useEffect, useState } from 'react';
import MapContainer from '../components/MapContainer';
import NavigationPanel from '../components/NavigationPanel';
import OfflineIndicator from '../components/OfflineIndicator';
import Header from '../components/Header';
import { RouteProvider } from '../contexts/RouteContext';

const Index = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);

  useEffect(() => {
    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          setServiceWorkerReady(true);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <RouteProvider>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col">
        <Header />
        <OfflineIndicator isOnline={isOnline} />
        
        <div className="flex-1 flex flex-col lg:flex-row">
          <NavigationPanel isOnline={isOnline} />
          <div className="flex-1 relative">
            <MapContainer isOnline={isOnline} />
          </div>
        </div>
      </div>
    </RouteProvider>
  );
};

export default Index;

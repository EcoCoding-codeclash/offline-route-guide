
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
          console.log('Service Worker registered successfully:', registration);
          setServiceWorkerReady(true);
          
          // Cache current page and assets
          const urlsToCache = [
            window.location.href,
            ...Array.from(document.querySelectorAll('script[src]')).map(script => (script as HTMLScriptElement).src),
            ...Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => (link as HTMLLinkElement).href)
          ];
          
          if (registration.active) {
            registration.active.postMessage({
              type: 'CACHE_URLS',
              urls: urlsToCache
            });
          }
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('App is now online');
      setIsOnline(true);
    };
    
    const handleOffline = () => {
      console.log('App is now offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Also check connection status periodically
    const checkConnection = () => {
      setIsOnline(navigator.onLine);
    };
    
    const connectionInterval = setInterval(checkConnection, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(connectionInterval);
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
        
        {/* Service Worker Status Indicator */}
        {!serviceWorkerReady && (
          <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm">
            Loading offline features...
          </div>
        )}
      </div>
    </RouteProvider>
  );
};

export default Index;

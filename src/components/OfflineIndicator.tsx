
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '../lib/utils';

interface OfflineIndicatorProps {
  isOnline: boolean;
}

const OfflineIndicator = ({ isOnline }: OfflineIndicatorProps) => {
  return (
    <div className={cn(
      "px-4 py-2 text-sm font-medium transition-all duration-300",
      isOnline 
        ? "bg-emerald-100 text-emerald-800" 
        : "bg-amber-100 text-amber-800"
    )}>
      <div className="flex items-center gap-2 justify-center">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Online - Maps updating in real-time</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Offline Mode - Using cached maps</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;

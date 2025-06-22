
import React from 'react';
import RoutePlanningPanel from './RoutePlanningPanel';
import NavigationPanel from './NavigationPanel';
import { Card } from './ui/card';

interface MainNavigationPanelProps {
  isOnline: boolean;
}

const MainNavigationPanel = ({ isOnline }: MainNavigationPanelProps) => {
  return (
    <div className="w-full lg:w-80 bg-white shadow-lg border-r border-emerald-100">
      <div className="p-4 space-y-4">
        <RoutePlanningPanel isOnline={isOnline} />
        <NavigationPanel />
        
        <Card className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Offline Features</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Maps cached automatically</li>
            <li>• GPS location works offline</li>
            <li>• Turn-by-turn navigation</li>
            <li>• Voice guidance offline</li>
            <li>• Previous routes cached</li>
            <li>• {isOnline ? 'Currently syncing' : 'Using cached data'}</li>
          </ul>
        </Card>

        {!isOnline && (
          <Card className="p-4 bg-amber-50 border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">Offline Mode Active</h3>
            <p className="text-sm text-amber-700">
              You're currently offline. EcoMap is using cached map data and GPS for navigation.
              All navigation features work offline including voice guidance.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MainNavigationPanel;

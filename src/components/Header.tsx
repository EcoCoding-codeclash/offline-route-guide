
import React from 'react';
import { MapPin, Leaf } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-emerald-100">
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Leaf className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-800">EcoMap</h1>
              <p className="text-xs text-emerald-600">Offline Navigation</p>
            </div>
          </div>
          
          <div className="ml-auto flex items-center gap-2 text-emerald-700">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Navigate Anywhere</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BatteryBank } from '../data/mockData';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  batteryBanks: BatteryBank[];
}

// Custom marker icons based on status
const createCustomIcon = (status: string) => {
  const color = status === 'healthy' ? '#10B981' : status === 'warning' ? '#F59E0B' : '#EF4444';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background-color: ${color};
          border: 1px solid white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      </style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ batteryBanks }) => {
  return (
    <MapContainer
      center={[39.8283, -98.5795]} // Geographic center of US
      zoom={3}
      style={{ height: '320px', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {batteryBanks.map((bank) => (
        <Marker
          key={bank.id}
          position={[bank.lat, bank.lng]}
          icon={createCustomIcon(bank.status)}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h4 className="font-semibold text-gray-900 mb-1">{bank.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{bank.location}</p>
              
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={clsx(
                    'capitalize font-medium',
                    bank.status === 'healthy' && 'text-emerald-600',
                    bank.status === 'warning' && 'text-amber-600',
                    bank.status === 'critical' && 'text-red-600'
                  )}>
                    {bank.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>SoH:</span>
                  <span className="font-medium">{bank.soh}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="font-medium">{(bank.usableCapacity/1000).toFixed(1)}MW</span>
                </div>
                <div className="flex justify-between">
                  <span>Temperature:</span>
                  <span className="font-medium">{bank.temperature}°C</span>
                </div>
              </div>
              
              <Link
                to={`/asset/${bank.id}`}
                className="inline-block mt-3 px-3 py-1 bg-teal-600 text-white text-xs rounded hover:bg-teal-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default InteractiveMap;
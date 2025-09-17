import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Battery, 
  Thermometer, 
  Zap, 
  Activity,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { batteryBanks, generateSoHTimeSeries } from '../data/mockData';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import clsx from 'clsx';

const AssetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('performance');
  
  const asset = batteryBanks.find(bank => bank.id === id);
  
  if (!asset) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Asset not found</h2>
        </div>
      </div>
    );
  }

  const sohData = generateSoHTimeSeries(30);
  
  // Mock cycle data
  const cycleData = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    cycles: Math.floor(Math.random() * 50) + 80,
    efficiency: Math.random() * 5 + 92
  }));

  const tabs = [
    { id: 'performance', name: 'Performance', icon: TrendingUp },
    { id: 'telemetry', name: 'Telemetry', icon: Activity },
    { id: 'maintenance', name: 'Maintenance History', icon: Calendar },
    { id: 'forecast', name: 'Forecast', icon: Battery }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20';
      case 'warning': return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20';
      case 'critical': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const maintenanceHistory = [
    { date: '2024-01-15', type: 'Preventive', description: 'Quarterly inspection and cleaning', status: 'completed', technician: 'Mike Johnson' },
    { date: '2023-10-15', type: 'Corrective', description: 'Temperature sensor replacement', status: 'completed', technician: 'Sarah Chen' },
    { date: '2023-07-15', type: 'Preventive', description: 'Battery capacity testing', status: 'completed', technician: 'David Miller' },
    { date: '2024-07-15', type: 'Scheduled', description: 'Semi-annual maintenance', status: 'scheduled', technician: 'TBD' }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
            {asset.name}
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {asset.location} • Installed {new Date(asset.installDate).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className={clsx(
            'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium capitalize',
            getStatusColor(asset.status)
          )}>
            {asset.status}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
              <Battery className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">State of Health</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{asset.soh}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usable Capacity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{(asset.usableCapacity / 1000).toFixed(1)}MW</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/20">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cycle Count</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{asset.cycleCount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-900/20">
              <Thermometer className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Temperature</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{asset.temperature}°C</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                )}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  SoH & Capacity Trend (30 Days)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sohData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="timestamp" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => new Date(value).getMonth() + 1 + '/' + new Date(value).getDate()}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'SoH']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#2563EB" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Cycle Count & Efficiency
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cycleData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="cycles" fill="#2563EB" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Voltage</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{asset.voltage}V</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 mt-2">
                      Normal Range
                    </span>
                  </div>
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{asset.current}A</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 mt-2">
                      Normal Range
                    </span>
                  </div>
                  <Activity className="h-8 w-8 text-emerald-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Temperature</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{asset.temperature}°C</p>
                    <span className={clsx(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2',
                      asset.temperature > 35 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : asset.temperature > 30
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
                    )}>
                      {asset.temperature > 35 ? 'High Temp' : asset.temperature > 30 ? 'Elevated' : 'Normal Range'}
                    </span>
                  </div>
                  <Thermometer className="h-8 w-8 text-amber-600" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Maintenance Timeline
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {maintenanceHistory.map((event, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {event.status === 'completed' ? (
                          <CheckCircle className="h-6 w-6 text-emerald-600" />
                        ) : (
                          <Clock className="h-6 w-6 text-amber-600" />
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.description}
                          </p>
                          <span className={clsx(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            event.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                          )}>
                            {event.status === 'completed' ? 'Completed' : 'Scheduled'}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <p>{event.type} • {new Date(event.date).toLocaleDateString()}</p>
                          <p>Technician: {event.technician}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'forecast' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Replacement Forecast
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expected Replacement Date</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {new Date(asset.expectedReplacement).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Cost</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${(asset.replacementCost / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Remaining Useful Life</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {Math.ceil((new Date(asset.expectedReplacement).getTime() - new Date().getTime()) / (365 * 24 * 60 * 60 * 1000))} years
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Performance Predictions
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">SoH at EOL</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-amber-600 h-2 rounded-full" 
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Capacity Retention</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: '78%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Expected Cycles at EOL</span>
                      <span className="font-medium">4,500</span>
                    </div>
                    <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full" 
                        style={{ width: `${(asset.cycleCount / 4500) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
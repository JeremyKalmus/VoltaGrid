import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Battery, 
  Zap, 
  RotateCcw, 
  Calendar,
  AlertTriangle,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import KPICard from '../components/KPICard';
import InteractiveMap from '../components/InteractiveMap';
import { 
  batteryBanks, 
  fleetKPIs, 
  generateSoHTimeSeries, 
  maintenancePriorities 
} from '../data/mockData';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import clsx from 'clsx';

const Dashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<7 | 30 | 90>(30);
  const sohData = generateSoHTimeSeries(timeFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      case 'High': return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20';
      case 'Medium': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
      case 'Low': return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
            Fleet Overview
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Real-time monitoring of grid-scale energy storage assets
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
            System Operational
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Fleet Average SoH"
          value={`${fleetKPIs.avgSoH}%`}
          change="-0.3% from last month"
          changeType="negative"
          icon={Battery}
          iconColor="text-teal-600"
        />
        <KPICard
          title="Total Usable Capacity"
          value={`${(fleetKPIs.totalUsableCapacity / 1000).toFixed(1)}MW`}
          subtitle={`${fleetKPIs.totalUsableCapacity.toLocaleString()} kWh`}
          change="+2.1% from last month"
          changeType="positive"
          icon={Zap}
          iconColor="text-sky-600"
        />
        <KPICard
          title="Total Cycles to Date"
          value={fleetKPIs.totalCycles.toLocaleString()}
          change="+156 this month"
          changeType="neutral"
          icon={RotateCcw}
          iconColor="text-slate-600"
        />
        <KPICard
          title="Forecasted Replacements"
          value={fleetKPIs.forecastedReplacements}
          subtitle="Next 12 months"
          change="1 moved up from Q3"
          changeType="neutral"
          icon={Calendar}
          iconColor="text-amber-600"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fleet Map View */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            National Energy Storage Network
          </h3>
          
          {/* Real Interactive Map */}
          <InteractiveMap batteryBanks={batteryBanks} />
          
          {/* Map Legend */}
          <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Facility Status Legend</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2 shadow-sm"></div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Optimal</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2 shadow-sm"></div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Attention</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-sm"></div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Critical</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">{batteryBanks.length}</span> Active Facilities
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">{(fleetKPIs.totalUsableCapacity / 1000).toFixed(1)}MW</span> Total Capacity
              </div>
            </div>
          </div>
        </div>

        {/* SoH Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Fleet SoH Trend
            </h3>
            <div className="flex space-x-2">
              {[7, 30, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => setTimeFilter(days as 7 | 30 | 90)}
                  className={clsx(
                    'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                    timeFilter === days
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  )}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sohData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).getMonth() + 1 + '/' + new Date(value).getDate()}
                />
                <YAxis 
                  domain={['dataMin - 2', 'dataMax + 2']}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'SoH']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0F766E" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#0F766E' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Maintenance Priorities */}
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Top 5 Maintenance Priorities
                </h3>
              </div>
              <Link 
                to="/alerts"
                className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 flex items-center"
              >
                View all alerts
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {maintenancePriorities.map((item, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3',
                        getPriorityColor(item.priority)
                      )}>
                        {item.priority}
                      </span>
                      <Link 
                        to={`/asset/${batteryBanks.find(b => b.name === item.bank)?.id || 'battery-bank-001'}`}
                        className="font-medium text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400"
                      >
                        {item.bank}
                      </Link>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.issue}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
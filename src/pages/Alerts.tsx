import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  Filter,
  Search,
  User,
  TrendingDown,
  Thermometer,
  Zap
} from 'lucide-react';
import { anomalies, batteryBanks } from '../data/mockData';
import { format } from 'date-fns';
import clsx from 'clsx';

const Alerts: React.FC = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'critical' | 'major' | 'minor'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'open' | 'assigned' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAnomalies = anomalies.filter(anomaly => {
    const matchesSeverity = selectedSeverity === 'all' || anomaly.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || anomaly.status === selectedStatus;
    const matchesSearch = anomaly.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anomaly.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      case 'major': return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20';
      case 'minor': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      case 'assigned': return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20';
      case 'resolved': return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'temperature': return Thermometer;
      case 'efficiency': return TrendingDown;
      case 'current': return Zap;
      case 'voltage': return Zap;
      default: return AlertTriangle;
    }
  };

  const anomalyCounts = {
    total: anomalies.length,
    critical: anomalies.filter(a => a.severity === 'critical').length,
    major: anomalies.filter(a => a.severity === 'major').length,
    minor: anomalies.filter(a => a.severity === 'minor').length,
    open: anomalies.filter(a => a.status === 'open').length
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
            Alerts & Anomalies
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Operations center view for triaging abnormal behavior
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Alerts
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {anomalyCounts.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Critical
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {anomalyCounts.critical}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Major
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {anomalyCounts.major}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Minor
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {anomalyCounts.minor}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Open
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {anomalyCounts.open}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Severity
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as typeof selectedSeverity)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="major">Major</option>
              <option value="minor">Minor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedSeverity('all');
                setSelectedStatus('all');
                setSearchTerm('');
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Anomaly Timeline
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Showing {filteredAnomalies.length} of {anomalies.length} alerts
          </p>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAnomalies.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No anomalies detected
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Fleet is healthy 🎉
              </p>
            </div>
          ) : (
            filteredAnomalies.map((anomaly) => {
              const TypeIcon = getTypeIcon(anomaly.type);
              
              return (
                <div key={anomaly.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <TypeIcon className={clsx(
                        'h-6 w-6',
                        anomaly.severity === 'critical' && 'text-red-600',
                        anomaly.severity === 'major' && 'text-amber-600',
                        anomaly.severity === 'minor' && 'text-blue-600'
                      )} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={clsx(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                          getSeverityColor(anomaly.severity)
                        )}>
                          {anomaly.severity}
                        </span>
                        
                        <span className={clsx(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                          getStatusColor(anomaly.status)
                        )}>
                          {anomaly.status}
                        </span>
                        
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(anomaly.timestamp), 'MMM d, yyyy HH:mm')}
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {anomaly.bankName}
                      </h4>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {anomaly.description}
                      </p>
                      
                      {anomaly.assignedTo && (
                        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <User className="h-3 w-3 mr-1" />
                          Assigned to {anomaly.assignedTo}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      {anomaly.status === 'open' ? (
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-800/30">
                          Assign
                        </button>
                      ) : anomaly.status === 'assigned' ? (
                        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-emerald-600 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/20 dark:hover:bg-emerald-800/30">
                          Resolve
                        </button>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
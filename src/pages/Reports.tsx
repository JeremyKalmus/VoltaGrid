import React, { useState } from 'react';
import { 
  FileBarChart, 
  Download, 
  Calendar,
  Filter,
  Mail,
  Eye,
  BarChart3,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { batteryBanks, fleetKPIs } from '../data/mockData';
import { format, subDays } from 'date-fns';
import clsx from 'clsx';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: typeof BarChart3;
  preview: React.ReactNode;
}

const Reports: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('fleet-performance');
  const [dateRange, setDateRange] = useState({ start: format(subDays(new Date(), 30), 'yyyy-MM-dd'), end: format(new Date(), 'yyyy-MM-dd') });
  const [selectedSite, setSelectedSite] = useState<string>('all');

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'fleet-performance',
      name: 'Fleet Performance Report',
      description: 'Comprehensive overview of fleet health and performance metrics',
      icon: BarChart3,
      preview: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Average SoH</h4>
              <p className="text-2xl font-bold text-blue-600">{fleetKPIs.avgSoH}%</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded">
              <h4 className="font-medium text-emerald-900 dark:text-emerald-100">Total Capacity</h4>
              <p className="text-2xl font-bold text-emerald-600">{(fleetKPIs.totalUsableCapacity / 1000).toFixed(1)}MW</p>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Performance summary across {batteryBanks.length} battery banks
          </div>
        </div>
      )
    },
    {
      id: 'maintenance-forecast',
      name: 'Maintenance Forecast Report',
      description: 'Predictive maintenance schedule and cost analysis',
      icon: TrendingUp,
      preview: (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Upcoming maintenance activities and replacement forecasts
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Scheduled maintenance</span>
              <span className="text-sm font-medium">3 banks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Replacement needed (next 12mo)</span>
              <span className="text-sm font-medium">{fleetKPIs.forecastedReplacements} banks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Estimated cost</span>
              <span className="text-sm font-medium">$8.5M</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cost-analysis',
      name: 'Cost Analysis Report',
      description: 'Financial performance and ROI analysis',
      icon: AlertTriangle,
      preview: (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Comprehensive financial analysis and cost projections
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded">
            <h4 className="font-medium text-amber-900 dark:text-amber-100">5-Year NPV</h4>
            <p className="text-xl font-bold text-amber-600">$12.3M</p>
          </div>
        </div>
      )
    }
  ];

  const currentTemplate = reportTemplates.find(t => t.id === selectedTemplate);
  const sites = [...new Set(batteryBanks.map(bank => bank.location))];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
            Reports & Export
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Generate shareable summaries for management and investors
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            Schedule
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Template Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Report Templates
            </h3>
            <div className="space-y-3">
              {reportTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={clsx(
                    'w-full text-left p-3 rounded-lg border transition-all',
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <div className="flex items-start">
                    <template.icon className={clsx(
                      'h-5 w-5 mt-0.5 mr-3',
                      selectedTemplate === template.id ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
                    )} />
                    <div>
                      <h4 className={clsx(
                        'font-medium text-sm',
                        selectedTemplate === template.id ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                      )}>
                        {template.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filters
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site
                </label>
                <select
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="all">All Sites</option>
                  {sites.map(site => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Preview: {currentTemplate?.name}
                  </h3>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(dateRange.start), 'MMM d')} - {format(new Date(dateRange.end), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Report Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      GridStore Energy Storage
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentTemplate?.name} • Generated {format(new Date(), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Report Period</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(dateRange.start), 'MMM d')} - {format(new Date(dateRange.end), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-blue-600 to-emerald-600"></div>
              </div>

              {/* Report Content Preview */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Executive Summary
                  </h2>
                  {currentTemplate?.preview}
                </div>

                {selectedTemplate === 'fleet-performance' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                        Asset Status Distribution
                      </h3>
                      <div className="space-y-2">
                        {['healthy', 'warning', 'critical'].map(status => {
                          const count = batteryBanks.filter(bank => bank.status === status).length;
                          const percentage = (count / batteryBanks.length) * 100;
                          return (
                            <div key={status} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={clsx(
                                  'w-3 h-3 rounded-full mr-2',
                                  status === 'healthy' && 'bg-emerald-500',
                                  status === 'warning' && 'bg-amber-500',
                                  status === 'critical' && 'bg-red-500'
                                )}></div>
                                <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                                  {status}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {count} banks
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                  ({percentage.toFixed(0)}%)
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                        Top Performing Assets
                      </h3>
                      <div className="space-y-2">
                        {batteryBanks
                          .sort((a, b) => b.soh - a.soh)
                          .slice(0, 3)
                          .map(bank => (
                            <div key={bank.id} className="flex justify-between">
                              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                {bank.name}
                              </span>
                              <span className="text-sm font-medium text-emerald-600">
                                {bank.soh}%
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    This is a preview of the {currentTemplate?.name.toLowerCase()}. 
                    Export options: PDF, CSV, Excel
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Export Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <FileBarChart className="h-4 w-4 mr-2" />
                Export as PDF
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <Mail className="h-4 w-4 mr-2" />
                Email Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calculator,
  BarChart3,
  AlertCircle,
  Download
} from 'lucide-react';
import { batteryBanks, costScenarios } from '../data/mockData';
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

const Analytics: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof costScenarios>('baseline');
  const [replacementCost, setReplacementCost] = useState(500);
  const [discountFactor, setDiscountFactor] = useState(0.05);

  // Generate cost projection data
  const generateCostProjection = () => {
    const years = Array.from({ length: 5 }, (_, i) => 2025 + i);
    const scenario = costScenarios[selectedScenario];
    
    return years.map(year => {
      const baseReplacements = Math.floor(Math.random() * 3) + 1;
      const adjustedReplacements = Math.ceil(baseReplacements * scenario.multiplier);
      const cost = adjustedReplacements * replacementCost * 1000; // Convert to actual dollars
      const discountedCost = cost / Math.pow(1 + discountFactor, year - 2025);
      
      return {
        year: year.toString(),
        cost: cost,
        discountedCost: discountedCost,
        replacements: adjustedReplacements
      };
    });
  };

  const costProjectionData = generateCostProjection();

  // Rank banks by replacement urgency
  const rankedBanks = [...batteryBanks]
    .sort((a, b) => a.soh - b.soh)
    .map(bank => ({
      ...bank,
      urgencyScore: (100 - bank.soh) * 0.6 + (bank.cycleCount / 5000) * 0.4,
      estimatedYearsRemaining: Math.max(1, Math.ceil((new Date(bank.expectedReplacement).getTime() - new Date().getTime()) / (365 * 24 * 60 * 60 * 1000)))
    }));

  const totalProjectedCost = costProjectionData.reduce((sum, item) => sum + item.discountedCost, 0);

  const getUrgencyColor = (urgency: number) => {
    if (urgency > 30) return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
    if (urgency > 20) return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20';
    return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
            Lifecycle & Cost Analytics
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Financial forecasting and budgeting for asset management
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </button>
        </div>
      </div>

      {/* Cost Estimator Widget */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <Calculator className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Cost-to-Replace Estimator
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Replacement Cost ($/kWh)
            </label>
            <input
              type="number"
              value={replacementCost}
              onChange={(e) => setReplacementCost(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discount Rate
            </label>
            <input
              type="number"
              step="0.01"
              value={discountFactor}
              onChange={(e) => setDiscountFactor(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Scenario
            </label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value as keyof typeof costScenarios)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {Object.entries(costScenarios).map(([key, scenario]) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)} - {scenario.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Total 5-Year Projected Cost (NPV): ${(totalProjectedCost / 1000000).toFixed(2)}M
            </span>
          </div>
        </div>
      </div>

      {/* Cost Projection Chart */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-emerald-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              5-Year CapEx Projection
            </h2>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Scenario: {selectedScenario.charAt(0).toUpperCase() + selectedScenario.slice(1)}
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costProjectionData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'Cost']}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Bar dataKey="discountedCost" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Replacement Priority Table */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-amber-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Replacement Urgency Ranking
            </h2>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Bank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  SoH
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cycles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Urgency Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Est. Years Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Replacement Cost
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {rankedBanks.map((bank) => (
                <tr key={bank.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {bank.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {bank.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      bank.soh < 80 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : bank.soh < 90
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
                    )}>
                      {bank.soh}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {bank.cycleCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getUrgencyColor(bank.urgencyScore)
                    )}>
                      {bank.urgencyScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {bank.estimatedYearsRemaining} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${(bank.replacementCost / 1000000).toFixed(2)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
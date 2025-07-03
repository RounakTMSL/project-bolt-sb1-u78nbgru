import React, { useState } from 'react';
import { X, Activity, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { GlucoseReading } from '../types';

interface GlucoseTrackerProps {
  glucoseHistory: GlucoseReading[];
  onClose: () => void;
}

export const GlucoseTracker: React.FC<GlucoseTrackerProps> = ({
  glucoseHistory,
  onClose
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const filterDataByPeriod = (data: GlucoseReading[]) => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
    }
    
    return data.filter(reading => reading.timestamp >= cutoffDate);
  };

  const filteredData = filterDataByPeriod(glucoseHistory);
  
  const averageGlucose = filteredData.length > 0 
    ? filteredData.reduce((sum, reading) => sum + reading.level, 0) / filteredData.length
    : 0;

  const highReadings = filteredData.filter(reading => reading.level > 180).length;
  const lowReadings = filteredData.filter(reading => reading.level < 70).length;
  const normalReadings = filteredData.length - highReadings - lowReadings;

  const getGlucoseColor = (level: number) => {
    if (level < 70) return 'text-blue-600';
    if (level > 180) return 'text-red-600';
    if (level > 140) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getGlucoseStatus = (level: number) => {
    if (level < 70) return 'Low';
    if (level > 180) return 'High';
    if (level > 140) return 'Elevated';
    return 'Normal';
  };

  const recentReadings = filteredData.slice(0, 10);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Glucose Tracking (3 Months)</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            {(['week', 'month', 'quarter'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                }`}
              >
                {period === 'week' ? 'Last Week' : period === 'month' ? 'Last Month' : 'Last 3 Months'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Average</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {averageGlucose.toFixed(0)} mg/dL
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Normal</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{normalReadings}</div>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-700">High</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{highReadings}</div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Low</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{lowReadings}</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Readings</h3>
            <div className="space-y-3">
              {recentReadings.map((reading) => (
                <div key={reading.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {reading.timestamp.toLocaleDateString()} at {reading.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-xs text-gray-600 capitalize">
                        {reading.mealType?.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getGlucoseColor(reading.level)}`}>
                      {reading.level} mg/dL
                    </div>
                    <div className={`text-xs ${getGlucoseColor(reading.level)}`}>
                      {getGlucoseStatus(reading.level)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {averageGlucose > 150 && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">Health Alert</span>
              </div>
              <p className="text-sm text-red-700">
                Your average glucose level is elevated. Consider consulting with your healthcare provider 
                and reviewing your meal choices on this platform.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { User, ShoppingCart, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType;
  cartItemCount: number;
  onProfileClick: () => void;
  onCartClick: () => void;
  onGlucoseTrackerClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  cartItemCount, 
  onProfileClick, 
  onCartClick,
  onGlucoseTrackerClick
}) => {
  const getGlucoseStatusColor = () => {
    if (user.currentGlucoseLevel < user.targetGlucoseRange.min) return 'text-blue-600';
    if (user.currentGlucoseLevel > user.targetGlucoseRange.max) return 'text-red-600';
    return 'text-green-600';
  };

  return (
    <header className="bg-white border-b-2 border-blue-100 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Activity className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">DiabetesEats</h1>
            <p className="text-sm text-gray-600">Smart Food Ordering for Diabetes Management</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={onGlucoseTrackerClick}
            className="text-center hover:bg-blue-50 p-2 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">3-Month Tracking</span>
            </div>
          </button>

          <div className="text-center">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Current Glucose</span>
            </div>
            <div className={`text-lg font-bold ${getGlucoseStatusColor()}`}>
              {user.currentGlucoseLevel} mg/dL
            </div>
          </div>

          {user.warningCount > 0 && (
            <div className="flex items-center space-x-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-semibold">{user.warningCount} Warnings</span>
            </div>
          )}

          <button
            onClick={onCartClick}
            className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          <button
            onClick={onProfileClick}
            className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
          >
            <User className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-800">{user.name}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
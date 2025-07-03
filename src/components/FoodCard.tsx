import React from 'react';
import { Plus, AlertTriangle, Info } from 'lucide-react';
import { FoodItem } from '../types';

interface FoodCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
  isBlocked: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onAddToCart, isBlocked }) => {
  const getGlucoseImpactColor = (impact: number) => {
    if (impact <= 3) return 'bg-green-100 text-green-800';
    if (impact <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getGlucoseImpactLabel = (impact: number) => {
    if (impact <= 3) return 'Low Impact';
    if (impact <= 6) return 'Moderate Impact';
    return 'High Impact';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="relative">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGlucoseImpactColor(item.glucoseImpact)}`}>
            {getGlucoseImpactLabel(item.glucoseImpact)}
          </span>
        </div>
        {item.isDiabetesRisky && (
          <div className="absolute top-3 right-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <span className="text-xl font-bold text-blue-600">${item.price}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3">{item.description}</p>

        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Sugar: {item.sugarContent}g</span>
          </div>
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Carbs: {item.carbohydrates}g</span>
          </div>
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Calories: {item.calories}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Impact: {item.glucoseImpact}/10</span>
          </div>
        </div>

        {item.isDiabetesRisky && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Diabetes Risk Warning</span>
            </div>
            <p className="text-xs text-red-700">
              This item contains high sugar content that may significantly impact your blood glucose levels.
            </p>
          </div>
        )}

        <button
          onClick={() => onAddToCart(item)}
          disabled={isBlocked}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
            isBlocked
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{isBlocked ? 'Ordering Restricted' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};
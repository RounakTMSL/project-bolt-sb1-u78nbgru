import React from 'react';
import { X, AlertTriangle, Heart, Phone } from 'lucide-react';
import { HealthWarning } from '../types';

interface HealthWarningModalProps {
  warning: HealthWarning;
  onClose: () => void;
  onProceed: () => void;
  emergencyContact: string;
}

export const HealthWarningModal: React.FC<HealthWarningModalProps> = ({
  warning,
  onClose,
  onProceed,
  emergencyContact
}) => {
  const getWarningStyles = () => {
    switch (warning.level) {
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getWarningIcon = () => {
    switch (warning.level) {
      case 'critical':
        return <Heart className="w-8 h-8 text-red-600" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            {getWarningIcon()}
            <h2 className="text-xl font-bold text-gray-800">Health Warning</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className={`border rounded-lg p-4 mb-4 ${getWarningStyles()}`}>
          <p className="font-medium mb-2">{warning.message}</p>
          <p className="text-sm">{warning.recommendation}</p>
        </div>

        {warning.level === 'critical' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Phone className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Emergency Contact</span>
            </div>
            <p className="text-sm text-red-700">
              Consider contacting your healthcare provider: {emergencyContact}
            </p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel Order
          </button>
          {warning.level !== 'critical' && (
            <button
              onClick={onProceed}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Proceed Carefully
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
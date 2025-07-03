import React from 'react';
import { X, User, Activity, Phone, Pill, AlertTriangle } from 'lucide-react';
import { User as UserType } from '../types';

interface UserProfileProps {
  user: UserType;
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onClose }) => {
  const getGlucoseStatus = () => {
    if (user.currentGlucoseLevel < user.targetGlucoseRange.min) {
      return { status: 'Low', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    }
    if (user.currentGlucoseLevel > user.targetGlucoseRange.max) {
      return { status: 'High', color: 'text-red-600', bgColor: 'bg-red-50' };
    }
    return { status: 'Normal', color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const glucoseStatus = getGlucoseStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Health Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Personal Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">{user.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Diabetes Type:</span>
                  <span className="font-medium capitalize">{user.diabetesType}</span>
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-4 ${glucoseStatus.bgColor}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Activity className={`w-5 h-5 ${glucoseStatus.color}`} />
                <h3 className="font-semibold text-gray-800">Glucose Levels</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Level:</span>
                  <span className={`font-bold ${glucoseStatus.color}`}>
                    {user.currentGlucoseLevel} mg/dL ({glucoseStatus.status})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Range:</span>
                  <span className="font-medium">
                    {user.targetGlucoseRange.min}-{user.targetGlucoseRange.max} mg/dL
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Intake:</span>
                  <span className="font-medium">
                    {user.dailyGlucoseIntake}g / {user.maxDailyGlucoseLimit}g
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {user.warningCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-800">Warning Status</h3>
                </div>
                <p className="text-sm text-amber-700">
                  You have {user.warningCount} warning(s) today. 
                  {user.warningCount >= 3 && ' Your ordering may be restricted.'}
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Phone className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">Emergency Contact</h3>
              </div>
              <p className="text-sm font-medium text-gray-700">{user.emergencyContact}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Pill className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-800">Current Medications</h3>
              </div>
              <div className="space-y-1">
                {user.medications.map((medication, index) => (
                  <p key={index} className="text-sm text-gray-700">• {medication}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
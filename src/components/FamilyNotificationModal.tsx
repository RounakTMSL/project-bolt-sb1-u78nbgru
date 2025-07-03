import React from 'react';
import { X, Users, Phone, Mail, AlertTriangle } from 'lucide-react';
import { FamilyContact, DoctorContact } from '../types';

interface FamilyNotificationModalProps {
  familyContacts: FamilyContact[];
  doctorContact: DoctorContact;
  riskLevel: 'medium' | 'high' | 'critical';
  orderDetails: string;
  onClose: () => void;
  onSendNotifications: () => void;
}

export const FamilyNotificationModal: React.FC<FamilyNotificationModalProps> = ({
  familyContacts,
  doctorContact,
  riskLevel,
  orderDetails,
  onClose,
  onSendNotifications
}) => {
  const getRiskColor = () => {
    switch (riskLevel) {
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'critical':
        return 'text-red-800 bg-red-100 border-red-300';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getNotificationMessage = () => {
    switch (riskLevel) {
      case 'medium':
        return 'John has placed a food order with moderate diabetes risk. Family members will be notified to provide gentle guidance.';
      case 'high':
        return 'John has placed a high-risk food order that may significantly impact blood glucose levels. Family and doctor will be notified.';
      case 'critical':
        return 'URGENT: John has attempted to place a critically risky food order. Immediate family and medical intervention may be required.';
      default:
        return 'Notification will be sent to family members.';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full">
        <div className="border-b p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Family Notification Alert</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className={`border rounded-lg p-4 mb-6 ${getRiskColor()}`}>
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium capitalize">{riskLevel} Risk Order Detected</span>
            </div>
            <p className="text-sm">{getNotificationMessage()}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Order Details</h3>
            <p className="text-sm text-gray-700">{orderDetails}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Family Contacts</span>
              </h3>
              <div className="space-y-3">
                {familyContacts.filter(contact => contact.notifyOnRisk).map((contact) => (
                  <div key={contact.id} className="bg-white rounded-lg p-3 border">
                    <div className="font-medium text-gray-800">{contact.name}</div>
                    <div className="text-sm text-gray-600">{contact.relationship}</div>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{contact.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{contact.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <Phone className="w-5 h-5 text-green-600" />
                <span>Healthcare Provider</span>
              </h3>
              <div className="bg-white rounded-lg p-3 border">
                <div className="font-medium text-gray-800">{doctorContact.name}</div>
                <div className="text-sm text-gray-600">{doctorContact.specialization}</div>
                <div className="text-sm text-gray-600">{doctorContact.clinic}</div>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{doctorContact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>{doctorContact.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Notification Content Preview</h4>
            <div className="text-sm text-blue-700 bg-white rounded p-3">
              <p className="font-medium">Subject: Health Alert - Diabetes Management Concern</p>
              <p className="mt-2">
                Hello, this is an automated health alert from DiabetesEats. John Smith has placed a food order 
                with {riskLevel} diabetes risk. The order includes items that may significantly impact blood glucose levels. 
                Please consider reaching out to provide support and guidance. Order details: {orderDetails}
              </p>
              <p className="mt-2 text-xs">
                This notification is sent as part of John's diabetes management care plan.
              </p>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSendNotifications}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
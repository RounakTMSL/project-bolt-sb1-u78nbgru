import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building, Wallet, Truck, ChevronRight } from 'lucide-react';
import { PaymentMethod } from '../types';

interface PaymentModalProps {
  onClose: () => void;
  onSelectPayment: (method: PaymentMethod) => void;
  totalAmount: number;
  userPaymentMethods?: PaymentMethod[];
  onAddNewPayment?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  onClose,
  onSelectPayment,
  totalAmount,
  userPaymentMethods = [],
  onAddNewPayment
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [showSavedMethods, setShowSavedMethods] = useState(true);
  const [activeTab, setActiveTab] = useState<'saved' | 'new'>('saved');

  // Default payment methods if none are provided
  const defaultPaymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      type: 'card',
      label: 'Credit/Debit Card',
      details: 'Visa, Mastercard, RuPay',
      icon: 'card',
      isDefault: true
    },
    {
      id: 'upi',
      type: 'upi',
      label: 'UPI Payment',
      details: 'PhonePe, Google Pay, Paytm',
      icon: 'upi',
      isDefault: false
    },
    {
      id: 'netbanking',
      type: 'netbanking',
      label: 'Net Banking',
      details: 'All major banks supported',
      icon: 'netbanking',
      isDefault: false
    },
    {
      id: 'wallet',
      type: 'wallet',
      label: 'Digital Wallet',
      details: 'Paytm, Amazon Pay, etc.',
      icon: 'wallet',
      isDefault: false
    },
    {
      id: 'cod',
      type: 'cod',
      label: 'Cash on Delivery',
      details: 'Pay when order arrives',
      icon: 'cod',
      isDefault: false
    }
  ];

  // Use user's payment methods if available, otherwise use defaults
  const paymentMethods = userPaymentMethods.length > 0 ? userPaymentMethods : defaultPaymentMethods;

  const getPaymentIcon = (iconType: string) => {
    switch (iconType) {
      case 'card':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'upi':
        return <Smartphone className="w-5 h-5 text-green-600" />;
      case 'netbanking':
        return <Building className="w-5 h-5 text-purple-600" />;
      case 'wallet':
        return <Wallet className="w-5 h-5 text-orange-600" />;
      case 'cod':
        return <Truck className="w-5 h-5 text-gray-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-blue-600" />;
    }
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedMethod(method.id);
    onSelectPayment(method);
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <div
      key={method.id}
      onClick={() => handlePaymentSelect(method)}
      className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === method.id
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-blue-300'
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getPaymentIcon(method.icon || method.type)}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-800">{method.label}</span>
              {method.isDefault && (
                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{method.details}</p>
            {method.lastFourDigits && (
              <p className="text-xs text-gray-500 mt-1">•••• •••• •••• {method.lastFourDigits}</p>
            )}
          </div>
        </div>
        {selectedMethod === method.id ? (
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">Select Payment Method</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Amount Display */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-600">Total Amount</span>
              <div className="text-2xl font-bold text-blue-600">${totalAmount.toFixed(2)}</div>
            </div>
            {selectedMethod && (
              <button
                onClick={() => onSelectPayment(paymentMethods.find(m => m.id === selectedMethod)!)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm Payment
              </button>
            )}
          </div>

          {/* Tabs */}
          {userPaymentMethods.length > 0 && (
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 font-medium text-sm flex-1 text-center ${activeTab === 'saved'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => setActiveTab('saved')}
              >
                Saved Methods
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm flex-1 text-center ${activeTab === 'new'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => setActiveTab('new')}
              >
                New Payment
              </button>
            </div>
          )}

          {/* Saved Payment Methods */}
          {(activeTab === 'saved' || userPaymentMethods.length === 0) && (
            <div className="space-y-3 mb-4">
              {paymentMethods.map(renderPaymentMethod)}
            </div>
          )}

          {/* Add New Payment Method */}
          {activeTab === 'new' && onAddNewPayment && (
            <div className="space-y-3">
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                <button
                  onClick={onAddNewPayment}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center space-x-2 w-full"
                >
                  <span>+ Add New Payment Method</span>
                </button>
              </div>
              <p className="text-sm text-gray-500 text-center">
                We support all major payment providers
              </p>
            </div>
          )}

          {/* Security Info */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Secure SSL Encryption</span>
            </div>
            <p className="text-xs text-gray-500 text-center mt-1">
              Your payment information is processed securely. We never store your card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
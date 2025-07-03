import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingCart, AlertTriangle, MapPin, CreditCard } from 'lucide-react';
import { CartItem, DeliveryAddress, PaymentMethod } from '../types';

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (address: DeliveryAddress, payment: PaymentMethod) => void;
  totalGlucoseImpact: number;
  deliveryAddresses: DeliveryAddress[];
  selectedAddressId?: string;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  totalGlucoseImpact,
  deliveryAddresses,
  selectedAddressId
}) => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | undefined>(
    deliveryAddresses.find(addr => addr.id === selectedAddressId) || deliveryAddresses.find(addr => addr.isDefault)
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | undefined>();

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalSugar = items.reduce((sum, item) => sum + (item.sugarContent * item.quantity), 0);
  const hasRiskyItems = items.some(item => item.isDiabetesRisky);
  const deliveryFee = totalPrice > 25 ? 0 : 2.99;
  const finalTotal = totalPrice + deliveryFee;

  const handleCheckout = () => {
    if (!selectedAddress) {
      setShowAddressModal(true);
      return;
    }
    if (!selectedPayment) {
      setShowPaymentModal(true);
      return;
    }
    onCheckout(selectedAddress, selectedPayment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Sugar: {item.sugarContent}g | Impact: {item.glucoseImpact}/10
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address Section */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-800">Delivery Address</span>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Change
                  </button>
                </div>
                {selectedAddress ? (
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">{selectedAddress.label}</div>
                    <div>{selectedAddress.fullAddress}</div>
                    <div>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</div>
                  </div>
                ) : (
                  <div className="text-sm text-red-600">Please select a delivery address</div>
                )}
              </div>

              {/* Payment Method Section */}
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-800">Payment Method</span>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    {selectedPayment ? 'Change' : 'Select'}
                  </button>
                </div>
                {selectedPayment ? (
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">{selectedPayment.label}</div>
                    <div>{selectedPayment.details}</div>
                  </div>
                ) : (
                  <div className="text-sm text-red-600">Please select a payment method</div>
                )}
              </div>

              {hasRiskyItems && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">Health Warning</span>
                  </div>
                  <p className="text-sm text-red-700">
                    Your cart contains items that may significantly impact your blood glucose levels.
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="font-bold">
                      {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t pt-1 flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">${finalTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>Total Sugar:</span>
                    <span className="font-bold">{totalSugar.toFixed(1)}g</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Glucose Impact:</span>
                    <span className={`font-bold ${totalGlucoseImpact > 20 ? 'text-red-600' : 'text-green-600'}`}>
                      {totalGlucoseImpact}/10
                    </span>
                  </div>
                </div>
                {totalPrice > 25 && (
                  <div className="text-xs text-green-600 mt-2">
                    🎉 Free delivery on orders over $25!
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckout}
                disabled={!selectedAddress || !selectedPayment}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  selectedAddress && selectedPayment
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {!selectedAddress ? 'Select Delivery Address' : 
                 !selectedPayment ? 'Select Payment Method' : 
                 'Place Order'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
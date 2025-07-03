import React, { useState } from 'react';
import { X, MapPin, Plus, Check } from 'lucide-react';
import { DeliveryAddress } from '../types';

interface DeliveryAddressModalProps {
  addresses: DeliveryAddress[];
  selectedAddressId?: string;
  onClose: () => void;
  onSelectAddress: (addressId: string) => void;
  onAddAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
}

export const DeliveryAddressModal: React.FC<DeliveryAddressModalProps> = ({
  addresses,
  selectedAddressId,
  onClose,
  onSelectAddress,
  onAddAddress
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    fullAddress: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
    isDefault: false
  });

  const handleAddAddress = () => {
    if (newAddress.label && newAddress.fullAddress && newAddress.city) {
      onAddAddress(newAddress);
      setNewAddress({
        label: '',
        fullAddress: '',
        city: '',
        state: '',
        zipCode: '',
        landmark: '',
        isDefault: false
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Delivery Address</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {!showAddForm ? (
            <>
              <div className="space-y-3 mb-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => onSelectAddress(address.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAddressId === address.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-gray-800">{address.label}</span>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{address.fullAddress}</p>
                        <p className="text-gray-600 text-sm">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        {address.landmark && (
                          <p className="text-gray-500 text-xs mt-1">
                            Landmark: {address.landmark}
                          </p>
                        )}
                      </div>
                      {selectedAddressId === address.id && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Address</span>
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Label
                  </label>
                  <input
                    type="text"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                    placeholder="Home, Office, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                    placeholder="12345"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address
                </label>
                <textarea
                  value={newAddress.fullAddress}
                  onChange={(e) => setNewAddress({...newAddress, fullAddress: e.target.value})}
                  placeholder="Street address, apartment/unit number"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    placeholder="City name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    placeholder="State name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                  placeholder="Near park, opposite mall, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default address
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAddress}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Address
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
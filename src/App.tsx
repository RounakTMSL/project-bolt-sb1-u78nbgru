import React, { useState } from 'react';
import { getUsers, addUser } from './api';

import { Header } from './components/Header';
import { FoodCard } from './components/FoodCard';
import { Cart } from './components/Cart';
import { UserProfile } from './components/UserProfile';
import { HealthWarningModal } from './components/HealthWarningModal';
import { DeliveryAddressModal } from './components/DeliveryAddressModal';
import { PaymentModal } from './components/PaymentModal';
import { GlucoseTracker } from './components/GlucoseTracker';
import { FamilyNotificationModal } from './components/FamilyNotificationModal';
import { foodItems } from './data/foodItems';
import { mockUser } from './data/userData';
import { CartItem, HealthWarning, DeliveryAddress, PaymentMethod, Order } from './types';

import {
  generateHealthWarning,
  shouldBlockOrder,
  calculateGlucoseImpact,
  shouldNotifyFamily,
  getRiskLevel,
  generateOrderSummary,
  simulateNotificationSend
} from './utils/healthUtils';

function App() {
  const [user, setUser] = useState(mockUser);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showGlucoseTracker, setShowGlucoseTracker] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFamilyNotification, setShowFamilyNotification] = useState(false);
  const [healthWarning, setHealthWarning] = useState<HealthWarning | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [pendingOrder, setPendingOrder] = useState<{ address: DeliveryAddress, payment: PaymentMethod } | null>(null);

  const categories = ['All', 'Healthy', 'Desserts', 'Beverages'];
  const filteredItems = selectedCategory === 'All'
    ? foodItems
    : foodItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: any) => {
    const warning = generateHealthWarning(user, [...cartItems, { ...item, quantity: 1 }]);

    if (shouldBlockOrder(user, [...cartItems, { ...item, quantity: 1 }])) {
      setHealthWarning({
        level: 'critical',
        message: 'ORDER BLOCKED: This order poses a significant health risk.',
        recommendation: 'Please contact your healthcare provider and choose healthier alternatives.'
      });
      return;
    }

    if (warning) {
      setHealthWarning(warning);
      return;
    }

    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const addDeliveryAddress = (newAddress: Omit<DeliveryAddress, 'id'>) => {
    const address: DeliveryAddress = {
      ...newAddress,
      id: Date.now().toString()
    };

    setUser(prev => ({
      ...prev,
      deliveryAddresses: [...prev.deliveryAddresses, address],
      defaultAddressId: newAddress.isDefault ? address.id : prev.defaultAddressId
    }));
  };

  const handleCheckout = (address: DeliveryAddress, payment: PaymentMethod) => {
    const warning = generateHealthWarning(user, cartItems);
    const riskLevel = getRiskLevel(user, cartItems);

    if (shouldBlockOrder(user, cartItems)) {
      setHealthWarning({
        level: 'critical',
        message: 'CHECKOUT BLOCKED: This order poses a significant health risk.',
        recommendation: 'Please remove high-risk items or contact your healthcare provider.'
      });
      return;
    }

    // Check if family notification is needed
    if (shouldNotifyFamily(user, cartItems)) {
      setPendingOrder({ address, payment });
      setShowFamilyNotification(true);
      return;
    }

    if (warning) {
      setPendingOrder({ address, payment });
      setHealthWarning(warning);
      return;
    }

    // Process successful order
    processOrder(address, payment);
  };

  const processOrder = async (address: DeliveryAddress, payment: PaymentMethod) => {
    const riskLevel = getRiskLevel(user, cartItems);
    const orderSummary = generateOrderSummary(cartItems);

    // Create order
    const order: Order = {
      id: Date.now().toString(),
      items: [...cartItems],
      totalPrice: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      totalGlucoseImpact: calculateGlucoseImpact(cartItems),
      orderDate: new Date(),
      status: 'confirmed',
      deliveryAddress: address,
      paymentMethod: payment,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes
      riskLevel,
      familyNotified: false,
      doctorNotified: false
    };

    // Update user's order history and risk pattern
    setUser(prev => ({
      ...prev,
      orderHistory: [order, ...prev.orderHistory],
      riskPatternAlerts: riskLevel === 'high' || riskLevel === 'critical' ? prev.riskPatternAlerts + 1 : prev.riskPatternAlerts
    }));

    // Simulate successful order
    alert(`Order placed successfully! Your ${riskLevel === 'low' ? 'diabetes-friendly' : 'monitored'} meal will be delivered to ${address.label} in approximately 45 minutes. Payment via ${payment.label} confirmed.`);

    setCartItems([]);
    setShowCart(false);
    setPendingOrder(null);
  };

  const handleFamilyNotificationSend = async () => {
    if (!pendingOrder) return;

    const orderSummary = generateOrderSummary(cartItems);
    const riskLevel = getRiskLevel(user, cartItems);

    // Send notifications to family
    const familyPromises = user.familyContacts
      .filter(contact => contact.notifyOnRisk)
      .map(async (contact) => {
        const message = `Health Alert: ${user.name} has placed a ${riskLevel} risk food order. ${orderSummary}. Please consider reaching out to provide support.`;

        await Promise.all([
          simulateNotificationSend(contact.phone, message, 'sms'),
          simulateNotificationSend(contact.email, message, 'email')
        ]);
      });

    // Send notification to doctor if high risk
    if (riskLevel === 'high' || riskLevel === 'critical') {
      const doctorMessage = `Medical Alert: Patient ${user.name} (Age: ${user.age}, Type ${user.diabetesType} diabetes) has placed a ${riskLevel} risk food order. Current glucose: ${user.currentGlucoseLevel} mg/dL. ${orderSummary}`;

      await Promise.all([
        simulateNotificationSend(user.doctorContact.phone, doctorMessage, 'sms'),
        simulateNotificationSend(user.doctorContact.email, doctorMessage, 'email')
      ]);
    }

    await Promise.all(familyPromises);

    setShowFamilyNotification(false);
    processOrder(pendingOrder.address, pendingOrder.payment);
  };

  const handleWarningProceed = () => {
    if (healthWarning?.level === 'critical') {
      setHealthWarning(null);
      return;
    }

    // Increment warning count
    setUser(prev => ({ ...prev, warningCount: prev.warningCount + 1 }));

    if (pendingOrder) {
      processOrder(pendingOrder.address, pendingOrder.payment);
    }

    setHealthWarning(null);
  };

  const totalGlucoseImpact = calculateGlucoseImpact(cartItems);
  const isUserBlocked = shouldBlockOrder(user, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onProfileClick={() => setShowProfile(true)}
        onCartClick={() => setShowCart(true)}
        onGlucoseTrackerClick={() => setShowGlucoseTracker(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Diabetes-Friendly Food Delivery
          </h1>
          <p className="text-gray-600">
            Order smart, eat safe. Every item is analyzed for diabetes impact with 3-month tracking.
          </p>
        </div>

        {user.warningCount >= 3 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium text-red-800">
                Warning: You have {user.warningCount} health warnings today. High-risk ordering may be restricted.
              </span>
            </div>
          </div>
        )}

        {user.riskPatternAlerts >= 2 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="font-medium text-amber-800">
                Pattern Alert: Frequent high-risk orders detected. Family members and your doctor may be notified of concerning patterns.
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <FoodCard
              key={item.id}
              item={item}
              onAddToCart={addToCart}
              isBlocked={isUserBlocked}
            />
          ))}
        </div>
      </main>

      {showCart && (
        <Cart
          items={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
          totalGlucoseImpact={totalGlucoseImpact}
          deliveryAddresses={user.deliveryAddresses}
          selectedAddressId={user.defaultAddressId}
        />
      )}

      {showProfile && (
        <UserProfile
          user={user}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showGlucoseTracker && (
        <GlucoseTracker
          glucoseHistory={user.glucoseHistory}
          onClose={() => setShowGlucoseTracker(false)}
        />
      )}

      {showAddressModal && (
        <DeliveryAddressModal
          addresses={user.deliveryAddresses}
          selectedAddressId={user.defaultAddressId}
          onClose={() => setShowAddressModal(false)}
          onSelectAddress={(addressId) => {
            setUser(prev => ({ ...prev, defaultAddressId: addressId }));
            setShowAddressModal(false);
          }}
          onAddAddress={addDeliveryAddress}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSelectPayment={(method) => {
            setShowPaymentModal(false);
            // Handle payment selection
          }}
          totalAmount={cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
        />
      )}

      {showFamilyNotification && (
        <FamilyNotificationModal
          familyContacts={user.familyContacts}
          doctorContact={user.doctorContact}
          riskLevel={getRiskLevel(user, cartItems)}
          orderDetails={generateOrderSummary(cartItems)}
          onClose={() => {
            setShowFamilyNotification(false);
            setPendingOrder(null);
          }}
          onSendNotifications={handleFamilyNotificationSend}
        />
      )}

      {healthWarning && (
        <HealthWarningModal
          warning={healthWarning}
          onClose={() => {
            setHealthWarning(null);
            setPendingOrder(null);
          }}
          onProceed={handleWarningProceed}
          emergencyContact={user.emergencyContact}
        />
      )}
    </div>
  );
}

export default App;
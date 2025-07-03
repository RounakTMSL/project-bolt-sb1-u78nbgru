export interface User {
  id: string;
  name: string;
  age: number;
  diabetesType: 'type1' | 'type2';
  currentGlucoseLevel: number;
  targetGlucoseRange: { min: number; max: number };
  dailyGlucoseIntake: number;
  maxDailyGlucoseLimit: number;
  warningCount: number;
  isBlocked: boolean;
  emergencyContact: string;
  medications: string[];
  deliveryAddresses: DeliveryAddress[];
  defaultAddressId?: string;
  familyContacts: FamilyContact[];
  doctorContact: DoctorContact;
  glucoseHistory: GlucoseReading[];
  orderHistory: Order[];
  riskPatternAlerts: number;
}

export interface DeliveryAddress {
  id: string;
  label: string;
  fullAddress: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface FamilyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  notifyOnRisk: boolean;
}

export interface DoctorContact {
  name: string;
  phone: string;
  email: string;
  clinic: string;
  specialization: string;
}

export interface GlucoseReading {
  id: string;
  level: number;
  timestamp: Date;
  mealType?: 'before_meal' | 'after_meal' | 'fasting' | 'random';
  notes?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';
  label: string;
  details: string;
  isDefault: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  description: string;
  glucoseImpact: number; // 1-10 scale
  sugarContent: number; // grams
  carbohydrates: number; // grams
  calories: number;
  isDiabetesRisky: boolean;
  ingredients: string[];
  allergens: string[];
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  totalGlucoseImpact: number;
  orderDate: Date;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'blocked' | 'cancelled';
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  familyNotified: boolean;
  doctorNotified: boolean;
}

export interface HealthWarning {
  level: 'info' | 'warning' | 'danger' | 'critical';
  message: string;
  recommendation: string;
}

export interface NotificationAlert {
  id: string;
  type: 'family' | 'doctor' | 'emergency';
  message: string;
  timestamp: Date;
  sent: boolean;
  recipient: string;
}</parameter>
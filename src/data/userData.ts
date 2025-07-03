import { User, DeliveryAddress, FamilyContact, DoctorContact, GlucoseReading } from '../types';

const deliveryAddresses: DeliveryAddress[] = [
  {
    id: '1',
    label: 'Home',
    fullAddress: '123 Oak Street, Apartment 4B',
    city: 'Springfield',
    state: 'Illinois',
    zipCode: '62701',
    landmark: 'Near Central Park',
    isDefault: true
  },
  {
    id: '2',
    label: 'Son\'s House',
    fullAddress: '456 Maple Avenue',
    city: 'Springfield',
    state: 'Illinois',
    zipCode: '62702',
    landmark: 'Blue house with white fence',
    isDefault: false
  }
];

const familyContacts: FamilyContact[] = [
  {
    id: '1',
    name: 'Sarah Smith',
    relationship: 'Daughter',
    phone: '+1 (555) 234-5678',
    email: 'sarah.smith@email.com',
    notifyOnRisk: true
  },
  {
    id: '2',
    name: 'Michael Smith',
    relationship: 'Son',
    phone: '+1 (555) 345-6789',
    email: 'michael.smith@email.com',
    notifyOnRisk: true
  }
];

const doctorContact: DoctorContact = {
  name: 'Dr. Emily Johnson',
  phone: '+1 (555) 456-7890',
  email: 'dr.johnson@healthclinic.com',
  clinic: 'Springfield Diabetes Center',
  specialization: 'Endocrinologist'
};

// Generate 3 months of glucose history
const generateGlucoseHistory = (): GlucoseReading[] => {
  const history: GlucoseReading[] = [];
  const now = new Date();

  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate 2-3 readings per day
    const readingsPerDay = Math.floor(Math.random() * 2) + 2;

    for (let j = 0; j < readingsPerDay; j++) {
      const readingTime = new Date(date);
      readingTime.setHours(8 + (j * 6), Math.floor(Math.random() * 60));

      const baseLevel = 120 + Math.sin(i / 10) * 20; // Simulate trends
      const variation = (Math.random() - 0.5) * 40;
      const level = Math.max(80, Math.min(250, Math.round(baseLevel + variation)));

      const mealTypes = ['fasting', 'before_meal', 'after_meal', 'random'] as const;

      history.push({
        id: `${i}-${j}`,
        level,
        timestamp: readingTime,
        mealType: mealTypes[j % mealTypes.length],
        notes: level > 180 ? 'Elevated reading' : level < 90 ? 'Low reading' : undefined
      });
    }
  }

  return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const mockUser: User = {
  id: '1',
  name: 'John Smith',
  age: 68,
  diabetesType: 'type2',
  currentGlucoseLevel: 145,
  targetGlucoseRange: { min: 80, max: 130 },
  dailyGlucoseIntake: 25,
  maxDailyGlucoseLimit: 50,
  warningCount: 2,
  isBlocked: false,
  emergencyContact: '+1 (555) 123-4567',
  medications: ['Metformin 500mg', 'Insulin'],
  deliveryAddresses,
  defaultAddressId: '1',
  familyContacts,
  doctorContact,
  glucoseHistory: generateGlucoseHistory(),
  orderHistory: [],
  riskPatternAlerts: 1
};
import { User, CartItem, HealthWarning, Order } from '../types';

export const calculateGlucoseImpact = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + (item.glucoseImpact * item.quantity);
  }, 0);
};

export const calculateTotalSugar = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + (item.sugarContent * item.quantity);
  }, 0);
};

export const generateHealthWarning = (
  user: User, 
  cartItems: CartItem[]
): HealthWarning | null => {
  const totalGlucoseImpact = calculateGlucoseImpact(cartItems);
  const totalSugar = calculateTotalSugar(cartItems);
  const projectedDailySugar = user.dailyGlucoseIntake + totalSugar;
  const hasHighRiskItems = cartItems.some(item => item.isDiabetesRisky);

  // Critical warning - glucose very high or user blocked
  if (user.currentGlucoseLevel > 200 || user.isBlocked) {
    return {
      level: 'critical',
      message: 'CRITICAL: Your blood glucose is dangerously high or you have been temporarily blocked from ordering high-risk items.',
      recommendation: 'Please contact your healthcare provider immediately and avoid high-sugar foods.'
    };
  }

  // High risk warning - exceeds daily limit significantly
  if (projectedDailySugar > user.maxDailyGlucoseLimit * 1.5) {
    return {
      level: 'danger',
      message: 'HIGH RISK: This order would exceed your daily sugar limit by over 50%.',
      recommendation: 'Consider removing high-sugar items or splitting this order across multiple days.'
    };
  }

  // Warning - glucose elevated and high-risk items
  if (user.currentGlucoseLevel > user.targetGlucoseRange.max && hasHighRiskItems) {
    return {
      level: 'warning',
      message: 'WARNING: Your glucose is elevated and you\'re ordering high-risk items.',
      recommendation: 'Consider choosing lower-sugar alternatives or wait until your glucose normalizes.'
    };
  }

  // Info - approaching daily limit
  if (projectedDailySugar > user.maxDailyGlucoseLimit * 0.8) {
    return {
      level: 'info',
      message: 'INFO: This order will bring you close to your daily sugar limit.',
      recommendation: 'Monitor your glucose levels closely after eating and consider lighter options for remaining meals.'
    };
  }

  return null;
};

export const shouldBlockOrder = (user: User, cartItems: CartItem[]): boolean => {
  const totalGlucoseImpact = calculateGlucoseImpact(cartItems);
  const totalSugar = calculateTotalSugar(cartItems);
  const projectedDailySugar = user.dailyGlucoseIntake + totalSugar;

  // Block if user is already blocked
  if (user.isBlocked) return true;

  // Block if glucose is critically high
  if (user.currentGlucoseLevel > 250) return true;

  // Block if exceeding daily limit by too much
  if (projectedDailySugar > user.maxDailyGlucoseLimit * 2) return true;

  // Block if too many warnings and high-risk order
  if (user.warningCount >= 3 && totalGlucoseImpact > 15) return true;

  return false;
};

export const shouldNotifyFamily = (user: User, cartItems: CartItem[]): boolean => {
  const totalGlucoseImpact = calculateGlucoseImpact(cartItems);
  const hasHighRiskItems = cartItems.some(item => item.isDiabetesRisky);
  
  // Notify if high glucose impact
  if (totalGlucoseImpact > 15) return true;
  
  // Notify if multiple warnings and risky items
  if (user.warningCount >= 2 && hasHighRiskItems) return true;
  
  // Notify if glucose is very high
  if (user.currentGlucoseLevel > 180 && hasHighRiskItems) return true;
  
  // Notify if pattern of risky ordering
  if (user.riskPatternAlerts >= 2) return true;
  
  return false;
};

export const getRiskLevel = (user: User, cartItems: CartItem[]): 'low' | 'medium' | 'high' | 'critical' => {
  const totalGlucoseImpact = calculateGlucoseImpact(cartItems);
  const totalSugar = calculateTotalSugar(cartItems);
  const projectedDailySugar = user.dailyGlucoseIntake + totalSugar;
  
  if (user.currentGlucoseLevel > 200 || projectedDailySugar > user.maxDailyGlucoseLimit * 2) {
    return 'critical';
  }
  
  if (totalGlucoseImpact > 20 || projectedDailySugar > user.maxDailyGlucoseLimit * 1.5) {
    return 'high';
  }
  
  if (totalGlucoseImpact > 10 || user.warningCount >= 2) {
    return 'medium';
  }
  
  return 'low';
};

export const generateOrderSummary = (cartItems: CartItem[]): string => {
  const itemNames = cartItems.map(item => `${item.name} (${item.quantity}x)`).join(', ');
  const totalSugar = calculateTotalSugar(cartItems);
  const totalImpact = calculateGlucoseImpact(cartItems);
  
  return `Items: ${itemNames}. Total sugar: ${totalSugar.toFixed(1)}g, Glucose impact: ${totalImpact}/10`;
};

export const simulateNotificationSend = async (
  recipient: string, 
  message: string, 
  type: 'sms' | 'email'
): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`${type.toUpperCase()} sent to ${recipient}: ${message}`);
  
  // Simulate 95% success rate
  return Math.random() > 0.05;
};
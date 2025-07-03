// types.ts (add these types if not already present)
export type PaymentMethod = {
    id: string;
    label: string;
    type: 'cash' | 'card' | 'upi' | 'paypal' | 'wallet';
    details?: {
        lastFourDigits?: string; // for cards
        upiId?: string; // for UPI
        walletName?: string; // for wallets
    };
    isDefault?: boolean;
};
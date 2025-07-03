import { FoodItem } from '../types';

export const foodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Grilled Chicken Salad',
    category: 'Healthy',
    image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 12.99,
    description: 'Fresh grilled chicken with mixed greens and low-sugar dressing',
    glucoseImpact: 2,
    sugarContent: 3,
    carbohydrates: 8,
    calories: 280,
    isDiabetesRisky: false
  },
  {
    id: '2',
    name: 'Chocolate Cake',
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 8.99,
    description: 'Rich chocolate cake with cream frosting',
    glucoseImpact: 9,
    sugarContent: 45,
    carbohydrates: 65,
    calories: 520,
    isDiabetesRisky: true
  },
  {
    id: '3',
    name: 'Vegetable Soup',
    category: 'Healthy',
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 6.99,
    description: 'Hearty vegetable soup with minimal sodium',
    glucoseImpact: 1,
    sugarContent: 2,
    carbohydrates: 12,
    calories: 120,
    isDiabetesRisky: false
  },
  {
    id: '4',
    name: 'Ice Cream Sundae',
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 7.50,
    description: 'Vanilla ice cream with chocolate sauce and nuts',
    glucoseImpact: 8,
    sugarContent: 38,
    carbohydrates: 55,
    calories: 450,
    isDiabetesRisky: true
  },
  {
    id: '5',
    name: 'Quinoa Bowl',
    category: 'Healthy',
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 11.99,
    description: 'Nutritious quinoa bowl with vegetables and lean protein',
    glucoseImpact: 3,
    sugarContent: 4,
    carbohydrates: 22,
    calories: 320,
    isDiabetesRisky: false
  },
  {
    id: '6',
    name: 'Fruit Smoothie',
    category: 'Beverages',
    image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 5.99,
    description: 'Fresh fruit smoothie with natural sugars',
    glucoseImpact: 6,
    sugarContent: 28,
    carbohydrates: 35,
    calories: 180,
    isDiabetesRisky: true
  },
  {
    id: '7',
    name: 'Baked Salmon',
    category: 'Healthy',
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 18.99,
    description: 'Omega-3 rich salmon with herbs and vegetables',
    glucoseImpact: 1,
    sugarContent: 0,
    carbohydrates: 5,
    calories: 380,
    isDiabetesRisky: false
  },
  {
    id: '8',
    name: 'Donuts (3 pack)',
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 6.99,
    description: 'Glazed donuts with high sugar content',
    glucoseImpact: 10,
    sugarContent: 54,
    carbohydrates: 78,
    calories: 650,
    isDiabetesRisky: true
  }
];
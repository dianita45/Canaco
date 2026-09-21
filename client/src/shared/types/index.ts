export interface TouristSpot {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  imageUrl: string;
  isFeatured: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  capacityLimit: number;
  currentAcceptedCount: number;
  imageUrl: string;
}

export interface RouteItem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  stops: string;
  imageUrl: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  businessName?: string;
  phone?: string;
  role: 'ADMIN' | 'MERCHANT';
}

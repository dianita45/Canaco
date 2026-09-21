import axios from 'axios';
import { TouristSpot, EventItem, User } from '../shared/types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('canaco_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const TourismService = {
  getSpots: async (): Promise<TouristSpot[]> => {
    const res = await api.get('/spots');
    return res.data.data;
  },
};

export const EventsService = {
  getEvents: async (): Promise<EventItem[]> => {
    const res = await api.get('/events');
    return res.data.data;
  },
};

export const AuthService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('canaco_auth_token', res.data.token);
    }
    return res.data;
  },
  register: async (data: {
    email: string;
    password: string;
    fullName: string;
    businessName: string;
    phone: string;
  }): Promise<{ token: string; user: User }> => {
    const res = await api.post('/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('canaco_auth_token', res.data.token);
    }
    return res.data;
  },
  getProfile: async (): Promise<User | null> => {
    try {
      const res = await api.get('/auth/me');
      return res.data.user;
    } catch {
      localStorage.removeItem('canaco_auth_token');
      return null;
    }
  },
  logout: () => {
    localStorage.removeItem('canaco_auth_token');
  },
};

export const ParticipationService = {
  submitRequest: async (data: {
    userId: string;
    eventId: string;
    notes: string;
    standType: string;
  }) => {
    const res = await api.post('/participation', data);
    return res.data;
  },
};

// Servicios administrativos conectados directamente a Supabase
export const AdminService = {
  // Atractivos
  createSpot: async (data: Partial<TouristSpot>): Promise<TouristSpot> => {
    const res = await api.post('/sys-c0ntr0l-canac0/spots', data);
    return res.data.data;
  },
  updateSpot: async (id: string, data: Partial<TouristSpot>): Promise<TouristSpot> => {
    const res = await api.put(`/sys-c0ntr0l-canac0/spots/${id}`, data);
    return res.data.data;
  },
  deleteSpot: async (id: string): Promise<void> => {
    await api.delete(`/sys-c0ntr0l-canac0/spots/${id}`);
  },

  // Eventos
  createEvent: async (data: Partial<EventItem>): Promise<EventItem> => {
    const res = await api.post('/sys-c0ntr0l-canac0/events', data);
    return res.data.data;
  },
  updateEvent: async (id: string, data: Partial<EventItem>): Promise<EventItem> => {
    const res = await api.put(`/sys-c0ntr0l-canac0/events/${id}`, data);
    return res.data.data;
  },
  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/sys-c0ntr0l-canac0/events/${id}`);
  },

  // Solicitudes
  getRequests: async (): Promise<any[]> => {
    const res = await api.get('/sys-c0ntr0l-canac0/requests');
    return res.data.data;
  },
  updateRequestStatus: async (id: string, status: 'APPROVED' | 'REJECTED', adminRemarks?: string): Promise<any> => {
    const res = await api.patch(`/sys-c0ntr0l-canac0/requests/${id}/status`, { status, adminRemarks });
    return res.data.data;
  },
};

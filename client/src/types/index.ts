export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  location?: string;
  plan: string;
  storageUsed: number;
  apiCallsUsed: number;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  price: string;
  maxParticipants: number;
  currentParticipants: number;
  imageUrl?: string;
  organizerId: string;
  createdAt: string;
}

export interface FileItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  userId: string;
  downloadToken?: string;
  tokenExpiry?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  paypalOrderId?: string;
  amount: string;
  currency: string;
  plan: string;
  status: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  monthlyBudget: string;
  activitiesSpent: string;
  equipmentSpent: string;
  transportSpent: string;
  month: number;
  year: number;
  createdAt: string;
}

export interface UserStats {
  eventsJoined: number;
  milesExplored: number;
  totalSaved: number;
  apiCallsUsed: number;
  storageUsed: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  location?: string;
}

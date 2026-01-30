// Admin Dashboard Types

export type OrderStatus = 'new' | 'in_progress' | 'completed' | 'archived';
export type ConsultationStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled';
export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  propertyType: string;
  location: string;
  budget: string;
  message: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Consultation {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: ConsultationStatus;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  area: string;
  year: string;
  images: string[];
  features: string[];
  status: ProjectStatus;
  featured: boolean;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  image: string;
  bio: string;
  isActive: boolean;
  createdAt: string;
}

export interface ContentSection {
  id: string;
  sectionKey: string;
  title: string;
  content: string;
  image?: string;
  isActive: boolean;
  updatedAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  newOrders: number;
  totalConsultations: number;
  pendingConsultations: number;
  totalProjects: number;
  activeProjects: number;
  totalTeamMembers: number;
  activeTeamMembers: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  avatar?: string;
  lastLogin: string;
}

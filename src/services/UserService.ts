/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api-client';
import { User } from './dto-types';

interface ChangePasswordResponse {
  message: string;
}

export class UserService {

  static async register(data: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    password: string;
  }): Promise<{ token?: string }> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  static async login(phone: string, password: string): Promise<{ token: string }> {
    const response = await api.post('/auth/login', { phone, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  }

  static async sendOTP(phone: string): Promise<{ message: string }> {
    const response = await api.post('/auth/generate-otp', { phone });
    return response.data;
  }

  static async verifyOTP(phone: string, otp: string): Promise<{ token: string }> {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    localStorage.setItem('token', response.data.token);
    return response.data;
  }

  static async sendOTPToAadhaar(aadhaar: string): Promise<{ message: string }> {
    const response = await api.post('/auth/generate-aadhaar-otp', { aadhaar });
    return response.data;
  }

  static async verifyAadhaar(aadhaar: string, otp: string): Promise<{ token: string }> {
    const response = await api.post('/auth/verify-aadhaar', { aadhaar, otp });
    localStorage.setItem('token', response.data.token);
    return response.data;
  }

  static async verifyAadhaarForProfile(aadhaar: string, otp: string): Promise<{ message: string }> {
    const response = await api.post('/auth/verify-aadhaar-profile', { aadhaar, otp });
    return response.data;
  }

  static async getUserById(id: string): Promise<User> {
    const response = await api.get(`/user/${id}`);
    return response.data;
  }

  static async getUserProfile(): Promise<User> {
    const response = await api.get('/user/me');
    return response.data;
  }

  static async updateProfile(data: { aadhaar?: string; pan?: string; bankDetails?: User['bankDetails'] }): Promise<User> {
    const response = await api.put('/user/update', data);
    return response.data;
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<ChangePasswordResponse> {
    const response = await api.post('/user/change-password', { currentPassword, newPassword });
    return response.data;
  }

  static async validateIfsc(ifscCode: string): Promise<{ bankName: string; branch: string }> {
    const response = await api.get(`/user/validate-ifsc/${ifscCode}`);
    return response.data;
  }
}
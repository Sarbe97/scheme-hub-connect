
import api from './api-client';
import { SchemeRecord } from './dto-types';

export class SchemeRecordService {
  static async getSchemeRecords(membershipNumber: string): Promise<SchemeRecord[]> {
    try {
      const response = await api.get('/scheme-records', {
        params: { membershipNumber },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch scheme records. Please try again.');
    }
  }

  static async createSchemeRecord(record: {
    aadhaar: string;
    name: string;
    schemeId: string;
    membershipNumber: string;
    documents: File[];
    extraDetails?: Record<string, any>;
  }): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('aadhaar', record.aadhaar);
      formData.append('name', record.name);
      formData.append('schemeId', record.schemeId);
      formData.append('membershipNumber', record.membershipNumber);
      record.documents.forEach((file) => formData.append('documents', file));
      if (record.extraDetails) {
        formData.append('extraDetails', JSON.stringify(record.extraDetails));
      }
      await api.post('/scheme-records', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      throw new Error('Failed to create scheme record. Please try again.');
    }
  }

  static async updateSchemeRecord(_id: string, record: {
    aadhaar?: string;
    name?: string;
    schemeId?: string;
    membershipNumber?: string;
    documents?: File[];
    extraDetails?: Record<string, any>;
  }): Promise<void> {
    try {
      const formData = new FormData();
      if (record.aadhaar) formData.append('aadhaar', record.aadhaar);
      if (record.name) formData.append('name', record.name);
      if (record.schemeId) formData.append('schemeId', record.schemeId);
      if (record.membershipNumber) formData.append('membershipNumber', record.membershipNumber);
      if (record.documents) {
        record.documents.forEach((file) => formData.append('documents', file));
      }
      if (record.extraDetails) {
        formData.append('extraDetails', JSON.stringify(record.extraDetails));
      }
      await api.put(`/scheme-records/${_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      throw new Error('Failed to update scheme record. Please try again.');
    }
  }

  static async deleteSchemeRecord(_id: string): Promise<void> {
    try {
      await api.delete(`/scheme-records/${_id}`);
    } catch (error) {
      throw new Error('Failed to delete scheme record. Please try again.');
    }
  }

  static async uploadCsv(file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/scheme-records/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      throw new Error('Failed to upload CSV. Please try again.');
    }
  }
}
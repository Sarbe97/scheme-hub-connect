import api from './api-client';
import { Claim } from './dto-types';

export class ClaimService {
  static async submitClaim(data: {
    userId: string;
    schemeId: string;
    membershipNumber: string;
    name: string;
    fatherName: string;
    certificates: File[];
  }): Promise<void> {
    console.log('submitClaim data:', data);
    const formData = new FormData();
    formData.append('userId', data.userId);
    formData.append('schemeId', data.schemeId);
    formData.append('membershipNumber', data.membershipNumber);
    formData.append('name', data.name);
    formData.append('fatherName', data.fatherName);
    formData.append('status', 'pending');
    data.certificates.forEach((file) => formData.append('certificates', file));

    console.log('formData entries:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const url = '/claims'; // Try '/api/claims' if global prefix is used
    console.log('Posting to URL:', `${api.defaults.baseURL}${url}`);
    await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static async getMyClaims(): Promise<Claim[]> {
    const response = await api.get('/claims/my-claims');
    return response.data;
  }

  static async getAllClaims(): Promise<Claim[]> {
    const response = await api.get('/claims/all');
    return response.data;
  }

  static async approveClaim(claimId: string): Promise<void> {
    await api.post(`/claims/approve-claim/${claimId}`);
  }

  static async rejectClaim(claimId: string): Promise<void> {
    await api.post(`/claims/reject-claim/${claimId}`);
  }

  static async trackMembershipRetries(claimId: string): Promise<number> {
    const claims = await this.getMyClaims();
    const claim = claims.find((c) => c._id === claimId);
    return claim?.retries || 0;
  }

  static async flagClaimQueue(claimId: string, queue: 'green' | 'orange' | 'red'): Promise<void> {
    await api.put(`/claim/update/${claimId}`, { queue });
  }

  static async undoApproveClaim(id: string): Promise<Claim> {
    const response = await api.post(`/claims/undo-approve/${id}`);
    return response.data;
  }
}
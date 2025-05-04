/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  phoneVerified?: boolean;
  email?: string;
  aadhaar?: string;
  aadhaarVerified?: boolean;
  pan?: string;
  roles?: string[];
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branch: string;
    accountHolderName: string;
    isVerified: boolean;
  };
}

export interface Claim {
  _id: string;
  userId?: string;
  schemeId?: any;
  membershipNumber?: string;
  name: string;
  fatherName: string;
  certificate?: string[];
  thumbnailPath?: string[];
  queue?: "green" | "orange" | "red";
  retries: number;
  status: "pending" | "approved" | "rejected" | "green" | "orange" | "red";
  createdAt?: string;
}

export interface Scheme {
  _id: string;
  name: string;
  description: string;
}

export interface SchemeRecord {
  _id: string;
  aadhaar: string;
  name: string;
  schemeId: string;
  membershipNumber: string;
  documents: string[];
  extraDetails: Record<string, any>;
}

export interface Tab {
  value: string;
  label: string;
  disabled?: boolean;
  roles: string[];
}


// Validation functions for form inputs

// Validates that a name is not empty and only contains letters and spaces
export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return "Name is required";
  }
  
  if (!/^[A-Za-z\s]+$/.test(name)) {
    return "Name should contain only letters and spaces";
  }
  
  return null;
};

// Validates that a phone number is 10 digits
export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return "Phone number is required";
  }
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length !== 10) {
    return "Phone number must be 10 digits";
  }
  
  return null;
};

// Validates that an Aadhaar number is 12 digits
export const validateAadhaar = (aadhaar: string): string | null => {
  if (!aadhaar) {
    return "Aadhaar number is required";
  }
  
  const cleaned = aadhaar.replace(/\D/g, '');
  
  if (cleaned.length !== 12) {
    return "Aadhaar number must be 12 digits";
  }
  
  return null;
};

// Validates that a PAN number is 10 characters and matches the PAN format
export const validatePAN = (pan: string): string | null => {
  if (!pan) {
    return "PAN number is required";
  }
  
  // PAN format: AAAAA1234A (5 letters, 4 numbers, 1 letter)
  if (!/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(pan)) {
    return "Invalid PAN format (should be 5 letters, 4 numbers, 1 letter)";
  }
  
  return null;
};

// Validates that an email is valid
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return null; // Email is optional
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  
  return null;
};

// Validates that a password meets security requirements
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character";
  }
  return null;
};

// Validates that the confirm password matches the new password
export const validateConfirmPassword = (newPassword: string, confirmPassword: string): string | null => {
  if (newPassword !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
};

// Format a phone number for display
export const formatPhone = (input: string): string => {
  const cleaned = input.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return input;
};

// Format an Aadhaar number for display
export const formatAadhaar = (input: string): string => {
  const cleaned = input.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return input;
};
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useFormContext } from '@/context/FormContext';
import { useToast } from '@/hooks/use-toast';
import { UserService } from '@/services/UserService';
import { User } from '@/services/dto-types';
import { validateAadhaar, validatePAN } from '@/utils/validation';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';

const IdVerification = () => {
  const { user, setUser } = useFormContext();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    aadhaar: user?.aadhaar || '',
    pan: user?.pan || '',
  });
  const [displayAadhaar, setDisplayAadhaar] = useState(formData.aadhaar ? maskAadhaar(formData.aadhaar) : '');
  const [displayPAN, setDisplayPAN] = useState(formData.pan ? maskPAN(formData.pan) : '');
  const [isAadhaarFocused, setIsAadhaarFocused] = useState(false);
  const [isPANFocused, setIsPANFocused] = useState(false);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({ aadhaar: '', pan: '', otp: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const isAadhaarVerified = user?.aadhaarVerified || false;

  // Mask Aadhaar to show only last 4 digits (e.g., XXXX-XXXX-1234)
  function maskAadhaar(aadhaar: string): string {
    if (!aadhaar) return '';
    const cleaned = aadhaar.replace(/\D/g, '');
    if (cleaned.length !== 12) return aadhaar;
    return `XXXX-XXXX-${cleaned.slice(-4)}`;
  }

  // Mask PAN to show only last 4 characters (e.g., XXXXXX1234)
  function maskPAN(pan: string): string {
    if (!pan) return '';
    if (pan.length !== 10) return pan;
    return `XXXXXX${pan.slice(-4)}`;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let cleanedValue = value;
    if (name === 'aadhaar') {
      cleanedValue = value.replace(/\D/g, '').slice(0, 12); // Only digits, max 12 for Aadhaar
    } else if (name === 'pan') {
      cleanedValue = value.slice(0, 10); // Allow all characters, max 10 for PAN
    }
    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    // Update display value based on focus
    if (name === 'aadhaar') {
      setDisplayAadhaar(isAadhaarFocused ? cleanedValue : maskAadhaar(cleanedValue));
    } else if (name === 'pan') {
      setDisplayPAN(isPANFocused ? cleanedValue : maskPAN(cleanedValue));
    }
  };

  const handleFocus = (field: 'aadhaar' | 'pan') => {
    if (field === 'aadhaar') {
      setIsAadhaarFocused(true);
      setDisplayAadhaar(formData.aadhaar);
    } else {
      setIsPANFocused(true);
      setDisplayPAN(formData.pan);
    }
  };

  const handleBlur = (field: 'aadhaar' | 'pan') => {
    if (field === 'aadhaar') {
      setIsAadhaarFocused(false);
      setDisplayAadhaar(maskAadhaar(formData.aadhaar));
    } else {
      setIsPANFocused(false);
      setDisplayPAN(maskPAN(formData.pan));
    }
  };

  const handleSendOTP = async () => {
    const aadhaarError = validateAadhaar(formData.aadhaar);
    if (aadhaarError) {
      setErrors((prev) => ({ ...prev, aadhaar: aadhaarError }));
      return;
    }

    setIsLoading(true);
    try {
      await UserService.updateProfile({ aadhaar: formData.aadhaar, pan: formData.pan });
      setUser((prev: User) => {
        if (!prev) {
          throw new Error('User data is not available');
        }
        return {
          ...prev,
          aadhaar: formData.aadhaar,
          pan: formData.pan,
          aadhaarVerified: false,
        };
      });
      await UserService.sendOTPToAadhaar(formData.aadhaar);
      toast({
        title: 'OTP Sent',
        description: 'A verification code has been sent to your Aadhaar-linked phone.',
      });
      setOtpSent(true);
      setResendDisabled(true);
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send OTP. Please try again.';
      toast({
        title: 'Error',
        description:
          errorMessage === 'Aadhaar not linked to a phone'
            ? 'Aadhaar is not linked to a phone number. Please contact support.'
            : errorMessage === 'Aadhaar not registered'
            ? 'This Aadhaar number is not registered. Please check the number.'
            : errorMessage === 'User data is not available'
            ? 'User data is not available. Please log in again.'
            : errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: 'Please enter a valid 6-digit OTP.' }));
      return;
    }
    setErrors((prev) => ({ ...prev, otp: '' }));

    setIsLoading(true);
    try {
      await UserService.verifyAadhaarForProfile(formData.aadhaar, otp);
      setUser((prev: User) => {
        if (!prev) {
          throw new Error('User data is not available');
        }
        return {
          ...prev,
          aadhaarVerified: true,
        };
      });
      toast({
        title: 'Aadhaar Verified',
        description: 'Your Aadhaar has been successfully verified.',
      });
      setOtpSent(false);
      setOtp('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Invalid or expired OTP. Please try again.';
      toast({
        title: 'Verification Failed',
        description:
          errorMessage === 'Invalid OTP'
            ? 'The OTP you entered is incorrect. Please try again.'
            : errorMessage === 'OTP has expired'
            ? 'The OTP has expired. Please request a new one.'
            : errorMessage === 'User data is not available'
            ? 'User data is not available. Please log in again.'
            : errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;
    setOtp('');
    handleSendOTP();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const aadhaarError = validateAadhaar(formData.aadhaar);
    const panError = formData.pan ? validatePAN(formData.pan) : '';
    if (aadhaarError || panError) {
      setErrors((prev) => ({ ...prev, aadhaar: aadhaarError, pan: panError }));
      return;
    }
    await handleSendOTP();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Verify Your Identity</h1>
          {isAadhaarVerified && (
            <div className="text-center mb-4">
              <p className="text-green-600 font-semibold">Aadhaar is verified</p>
              <p className="text-gray-600">Your Aadhaar number cannot be modified.</p>
            </div>
          )}
          {!otpSent || isAadhaarVerified ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="aadhaar" className="form-label">Aadhaar Number</label>
                <div className="relative">
                  <Input
                    id="aadhaar"
                    name="aadhaar"
                    type="text"
                    placeholder="12-digit Aadhaar number"
                    value={displayAadhaar}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('aadhaar')}
                    onBlur={() => handleBlur('aadhaar')}
                    disabled={isAadhaarVerified}
                    className="pr-10"
                    maxLength={12}
                  />
                  {isAadhaarVerified && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                </div>
                {errors.aadhaar && <p className="text-sm text-red-500">{errors.aadhaar}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="pan" className="form-label">PAN Number (Optional)</label>
                <Input
                  id="pan"
                  name="pan"
                  type="text"
                  placeholder="10-character PAN number"
                  value={displayPAN}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('pan')}
                  onBlur={() => handleBlur('pan')}
                  disabled={isAadhaarVerified}
                  maxLength={10}
                />
                {errors.pan && <p className="text-sm text-red-500">{errors.pan}</p>}
              </div>
              {!isAadhaarVerified && (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Verify Aadhaar'}
                </Button>
              )}
            </form>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="form-label">Enter 6-digit verification code</label>
                <div className="flex justify-center py-4">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    render={({ slots }) => (
                      <InputOTPGroup>
                        {slots.map((slot, index) => (
                          <InputOTPSlot key={index} {...slot} index={index} />
                        ))}
                      </InputOTPGroup>
                    )}
                  />
                </div>
                {errors.otp && <p className="text-sm text-red-500">{errors.otp}</p>}
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className={`text-primary text-sm ${resendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleResendOTP}
                  disabled={resendDisabled}
                >
                  {resendDisabled ? `Resend code in ${countdown}s` : "Didn't receive a code? Resend"}
                </button>
              </div>
              <Button
                className="w-full"
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Confirm OTP'}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                }}
              >
                Go Back
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdVerification;
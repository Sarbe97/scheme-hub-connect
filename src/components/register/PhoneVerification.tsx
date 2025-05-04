
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useFormContext } from '@/context/FormContext';
import { useToast } from '@/hooks/use-toast';
import { UserService } from '@/services/UserService';
import { useEffect, useState } from 'react';

const PhoneVerification = () => {
  const { user, setPhoneVerified, setRegistrationStep, isLoading, setIsLoading, otp, setOtp } = useFormContext();
  const { toast } = useToast();
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendDisabled]);

  const handleSendOTP = async () => {
    if (!user?.phone) {
      toast({
        title: 'Error',
        description: 'Phone number is missing.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      await UserService.sendOTP(user.phone);
      toast({
        title: 'OTP Sent',
        description: 'A verification code has been sent to your phone.',
      });
      setResendDisabled(true);
      setCountdown(30);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter the complete 6-digit code.',
        variant: 'destructive',
      });
      return;
    }
    if (!user?.phone) {
      toast({
        title: 'Error',
        description: 'Phone number is missing.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await UserService.verifyOTP(user.phone, otp);
      setPhoneVerified(true);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      setRegistrationStep(3);
      toast({
        title: 'Phone Verified',
        description: 'Your phone number has been verified.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      </div>

      <div className="text-center">
        <button
          type="button"
          className={`text-primary text-sm ${resendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSendOTP}
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
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </Button>
    </div>
  );
};

export default PhoneVerification;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFormContext } from '@/context/FormContext';
import { useToast } from '@/hooks/use-toast';
import { UserService } from '@/services/UserService';
import { validateAadhaar, validatePhone } from '@/utils/validation';
import { Key, Phone } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { setUser, setIsRegistered } = useFormContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loginMethod, setLoginMethod] = useState<'phone' | 'aadhaar'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayAadhaar, setDisplayAadhaar] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [isAadhaarFocused, setIsAadhaarFocused] = useState(false);
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [errors, setErrors] = useState({ phone: '', password: '', aadhaar: '', otp: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Mask Aadhaar to show only last 4 digits (e.g., XXXX-XXXX-1234)
  function maskAadhaar(aadhaar: string): string {
    if (!aadhaar) return '';
    const cleaned = aadhaar.replace(/\D/g, '');
    if (cleaned.length !== 12) return aadhaar;
    return `XXXX-XXXX-${cleaned.slice(-4)}`;
  }

  const fetchUserProfile = async () => {
    try {
      const userData = await UserService.getUserProfile();
      setUser(userData);
      setIsRegistered(true);
      navigate('/profile');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch user profile.',
        variant: 'destructive',
      });
    }
  };

  const handleSendOTP = async () => {
    let error = '';
    if (loginMethod === 'phone') {
      error = validatePhone(phoneNumber);
      if (error) setErrors((prev) => ({ ...prev, phone: error }));
    } else {
      error = validateAadhaar(aadhaarNumber);
      if (error) setErrors((prev) => ({ ...prev, aadhaar: error }));
    }
    if (error) return;

    setIsLoading(true);
    try {
      if (loginMethod === 'phone') {
        await UserService.sendOTP(phoneNumber);
      } else {
        await UserService.sendOTPToAadhaar(aadhaarNumber);
      }
      toast({
        title: 'OTP Sent',
        description: `A verification code has been sent to your registered ${
          loginMethod === 'phone' ? 'phone number' : 'Aadhaar-linked phone'
        }.`,
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
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      toast({
        title: 'Error',
        description:
          errorMessage === 'Aadhaar not linked to a phone'
            ? 'Aadhaar is not linked to a phone number. Please verify your Aadhaar first.'
            : errorMessage === 'Aadhaar not registered'
            ? 'This Aadhaar number is not registered. Please register or try a different Aadhaar.'
            : errorMessage === 'User not found'
            ? 'This phone number is not registered. Please register first.'
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
      if (loginMethod === 'phone') {
        await UserService.verifyOTP(phoneNumber, otp);
        await fetchUserProfile();
      } else {
        const response = await UserService.verifyAadhaar(aadhaarNumber, otp);
        if (response.token) {
          await fetchUserProfile();
        } else {
          throw new Error('Aadhaar login failed: No token received.');
        }
      }
      setIsRegistered(true);
      toast({
        title: 'Login Successful',
        description: 'You have successfully logged in.',
      });
      setOtp('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      toast({
        title: 'Login Failed',
        description:
          errorMessage === 'Invalid OTP'
            ? 'The OTP you entered is incorrect. Please try again.'
            : errorMessage === 'OTP has expired'
            ? 'The OTP has expired. Please request a new one.'
            : errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneError = validatePhone(phoneNumber);
    const passwordError = !password ? 'Password is required' : '';
    if (phoneError || passwordError) {
      setErrors((prev) => ({ ...prev, phone: phoneError, password: passwordError }));
      return;
    }
    setIsLoading(true);
    try {
      await UserService.login(phoneNumber, password);
      await fetchUserProfile();
      setIsRegistered(true);
      toast({
        title: 'Login Successful',
        description: 'You have successfully logged in.',
      });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid phone number or password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;
    setOtp('');
    await handleSendOTP();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-center mb-2">Login to Your Account</h1>
            <p className="text-gray-600 text-center">Access government schemes and track your applications</p>
          </div>

          {!otpSent ? (
            <Tabs defaultValue="phone" className="space-y-6" onValueChange={(value) => setLoginMethod(value as 'phone' | 'aadhaar')}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="phone">Login with Phone</TabsTrigger>
                <TabsTrigger value="aadhaar">Login with Aadhaar</TabsTrigger>
              </TabsList>

              <TabsContent value="phone" className="space-y-4">
                <form onSubmit={handlePhoneLogin}>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        className="pl-10"
                        placeholder="10-digit mobile number"
                        value={phoneNumber}
                        onChange={(e) => {
                          const cleanedValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPhoneNumber(cleanedValue);
                          setErrors((prev) => ({ ...prev, phone: '' }));
                        }}
                        maxLength={10}
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="form-label">Password</label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, password: '' }));
                      }}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>

                <Button variant="outline" className="w-full" onClick={handleSendOTP} disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Login with OTP'}
                </Button>
              </TabsContent>

              <TabsContent value="aadhaar" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="aadhaar" className="form-label">Aadhaar Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Key className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="aadhaar"
                      type="text"
                      className="pl-10"
                      placeholder="12-digit Aadhaar number"
                      value={displayAadhaar}
                      onChange={(e) => {
                        const cleanedValue = e.target.value.replace(/\D/g, '').slice(0, 12);
                        setAadhaarNumber(cleanedValue);
                        setDisplayAadhaar(isAadhaarFocused ? cleanedValue : maskAadhaar(cleanedValue));
                        setErrors((prev) => ({ ...prev, aadhaar: '' }));
                      }}
                      onFocus={() => {
                        setIsAadhaarFocused(true);
                        setDisplayAadhaar(aadhaarNumber);
                      }}
                      onBlur={() => {
                        setIsAadhaarFocused(false);
                        setDisplayAadhaar(maskAadhaar(aadhaarNumber));
                      }}
                      maxLength={12}
                    />
                  </div>
                  {errors.aadhaar && <p className="text-sm text-red-500">{errors.aadhaar}</p>}
                </div>

                <Button className="w-full mt-4" onClick={handleSendOTP} disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Get OTP'}
                </Button>
              </TabsContent>
            </Tabs>
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
                {isLoading ? 'Verifying...' : 'Login'}
              </Button>

              <Button variant="outline" className="w-full" onClick={() => setOtpSent(false)}>
                Go Back
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/register')}>
                Register Now
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
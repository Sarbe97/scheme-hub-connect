
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormContext } from "@/context/FormContext";
import { useToast } from "@/hooks/use-toast";
import { UserService } from "@/services/UserService";
import { validateEmail, validateName, validatePassword } from "@/utils/validation";
import { AxiosError } from "axios";
import { Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PersonalInfoForm = () => {
  const { user, setUser, setRegistrationStep, isLoading, setIsLoading } = useFormContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    email: user.email || '',
    password: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const newErrors = {
      firstName: validateName(formData.firstName) || '',
      lastName: validateName(formData.lastName) || '',
      phone: phoneRegex.test(formData.phone) ? '' : 'Invalid phone number',
      email: formData.email ? validateEmail(formData.email) || '' : '',
      password: validatePassword(formData.password) || '',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await UserService.register(formData);
        setUser({
          ...user,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          phoneVerified: false,
        });
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        toast({
          title: 'OTP Sent',
          description: 'Please verify your phone number to continue.',
        });
        setRegistrationStep(2);
      } catch (error) {
        let errorMessage = 'Failed to register. Please try again.';
        if (error instanceof AxiosError && error.response?.data?.message) {
          if (error.response.data.message === 'Phone number already registered') {
            errorMessage = 'This phone number is already registered. Please log in or use a different number.';
            toast({
              title: 'Error',
              description: (
                <div>
                  {errorMessage}
                  <button
                    className="text-primary underline ml-2"
                    onClick={() => navigate('/login')}
                  >
                    Go to Login
                  </button>
                </div>
              ),
              variant: 'destructive',
            });
            return;
          }
          errorMessage = error.response.data.message;
        }
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="firstName" className="form-label">
          First Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            className="pl-10"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        {errors.firstName && (
          <p className="text-sm text-red-500">{errors.firstName}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="lastName" className="form-label">
          Last Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            className="pl-10"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        {errors.lastName && (
          <p className="text-sm text-red-500">{errors.lastName}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="form-label">
          Phone Number
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          maxLength={10}
          placeholder="10-digit mobile number"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="form-label">
          Email Address (Optional)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            className="pl-10"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Continue'}
      </Button>
    </form>
  );
};

export default PersonalInfoForm;
import PersonalInfoForm from "@/components/register/PersonalInfoForm";
import PhoneVerification from "@/components/register/PhoneVerification";
import RegistrationComplete from "@/components/register/RegistrationComplete";
import { Button } from "@/components/ui/button";
import { useFormContext } from "@/context/FormContext";
import { Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  const { registrationStep, isRegistered, isLoading } = useFormContext();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isRegistered) {
    return <Navigate to="/profile" />;
  }

  const renderStep = () => {
    switch (registrationStep) {
      case 1:
        return <PersonalInfoForm />;
      case 2:
        return <PhoneVerification />;
      case 3:
        return <RegistrationComplete />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-center mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600 text-center">
              Follow the steps to complete your registration
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                    ${
                      registrationStep === step
                        ? "bg-primary text-white"
                        : registrationStep > step
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {registrationStep > step ? "✓" : step}
                  </div>
                  <span className="text-xs text-gray-500 hidden sm:block">
                    {step === 1
                      ? "Personal Info"
                      : step === 2
                      ? "Verify Phone"
                      : "Complete"}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-1 bg-primary transition-all duration-300"
                  style={{ width: `${(registrationStep - 1) * 50}%` }}
                ></div>
              </div>
            </div>
          </div>

          {renderStep()}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate("/login")}
              >
                Login Now
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

import { Claim, User } from "@/services/dto-types";
import { UserService } from "@/services/UserService";
import { createContext, useContext, useEffect, useState } from "react";

interface FormContextType {
  user: User;
  setUser: (user: User | ((prev: User) => User)) => void;
  claims: Claim[];
  setClaims: (claims: Claim[]) => void;
  isRegistered: boolean;
  setIsRegistered: (isRegistered: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  registrationStep: number;
  setRegistrationStep: (step: number) => void;
  phoneVerified: boolean;
  setPhoneVerified: (verified: boolean) => void;
  aadhaarVerified: boolean;
  setaadhaarVerified: (verified: boolean) => void;
  otp: string;
  setOtp: (otp: string) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<User>({
    _id: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    roles: ["user"],
    phoneVerified: false,
  });

  const [claims, setClaims] = useState<Claim[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [aadhaarVerified, setaadhaarVerified] = useState(false);
  const [otp, setOtp] = useState("");

  // Wrapper function to handle both direct and functional updates
  const setUser = (newUser: User | ((prev: User) => User)) => {
    if (typeof newUser === "function") {
      setUserState(newUser);
    } else {
      setUserState(newUser);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const resetToDefaultState = () => {
        setUser({
          _id: "",
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          roles: ["user"],
          phoneVerified: false,
          aadhaarVerified: false,
        });
        setIsRegistered(false);
        setPhoneVerified(false);
        setaadhaarVerified(false);
      };

      if (token) {
        try {
          const userData = await UserService.getUserProfile();
          setUser(userData);
          setIsRegistered(true);
          setPhoneVerified(userData.phoneVerified || false);
          setaadhaarVerified(userData.aadhaarVerified || false);
          setRegistrationStep(3); // Skip to complete if already registered
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("token");
          resetToDefaultState();
        }
      } else {
        resetToDefaultState();
      }

      setIsLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <FormContext.Provider
      value={{
        user,
        setUser,
        claims,
        setClaims,
        isRegistered,
        setIsRegistered,
        isLoading,
        setIsLoading,
        registrationStep,
        setRegistrationStep,
        phoneVerified,
        setPhoneVerified,
        aadhaarVerified,
        setaadhaarVerified,
        otp,
        setOtp,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

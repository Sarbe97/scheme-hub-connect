
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";

const SuccessPage = () => {
  const navigate = useNavigate();
  const { setUser, setSelectedScheme, setDocuments, setIsRegistered } = useFormContext();
  
  const handleReset = () => {
    // Reset the form state with all required properties
    setUser({
      name: "",
      phone: "",
      email: "", // Added missing email property
      aadhaar: "",
      pan: "",
      isVerified: false // Added missing isVerified property
    });
    setSelectedScheme("");
    setDocuments([]);
    setIsRegistered(false);
    navigate("/");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Application Submitted!</CardTitle>
          <CardDescription>
            Your application has been successfully submitted and is now under review.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            You will receive updates on your registered phone number.
            Please keep your application reference number for future correspondence.
          </p>
          <div className="mt-6 py-2 px-4 bg-secondary rounded-md">
            <p className="text-sm font-medium">Application Reference</p>
            <p className="text-xl font-bold">{`REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleReset}>Register a New Application</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPage;

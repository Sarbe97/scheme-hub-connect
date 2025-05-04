
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFormContext } from '@/context/FormContext';
import { CheckCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const RegistrationComplete = () => {
  const { setIsRegistered, phoneVerified } = useFormContext();

  if (!phoneVerified) {
    return <Navigate to="/register" />;
  }

  const handleContinue = () => {
    setIsRegistered(true);
    window.location.href = '/profile'; // Use window.location to force reload
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle>Registration Complete!</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">
          Your account has been successfully created. You can now log in and start applying for schemes.
        </p>
        <Button onClick={handleContinue} className="w-full mt-6">
          Go to Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default RegistrationComplete;
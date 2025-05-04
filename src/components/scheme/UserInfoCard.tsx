
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPhone, formatAadhaar } from "@/utils/validation";
import { useFormContext } from "@/context/FormContext";

const UserInfoCard = () => {
  const { user } = useFormContext();

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Your registered details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p>{user.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <p>{formatPhone(user.phone)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Aadhaar</p>
            <p>{formatAadhaar(user.aadhaar)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">PAN</p>
            <p>{user.pan}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;

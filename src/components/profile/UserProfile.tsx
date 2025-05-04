import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext } from "@/context/FormContext";
import { AlertTriangle, CheckCircle, CircleAlert, CreditCard, Mail, Phone, Shield, User } from "lucide-react";
import React from "react";

const UserProfile: React.FC = () => {
  const { user } = useFormContext();

  if (!user) {
    return null;
  }

  // Compute verification status
  const isPhoneVerified = user.phoneVerified ?? false;
  const isAadhaarVerified = user.aadhaarVerified ?? false;
  const isBankVerified = user.bankDetails?.isVerified ?? false;

  const pendingVerifications: string[] = [];
  if (!isPhoneVerified) pendingVerifications.push("Phone");
  if (!isAadhaarVerified) pendingVerifications.push("Aadhaar");
  if (!isBankVerified) pendingVerifications.push("Bank Details");

  const verificationStatus =
    pendingVerifications.length === 0
      ? "Fully Verified"
      : `Pending: ${pendingVerifications.join(", ")}`;

  const fields = [
    {
      icon: <User className="h-4 w-4 text-blue-600" />,
      label: "Full Name",
      value: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Not provided",
    },
    {
      icon: <Phone className="h-4 w-4 text-blue-600" />,
      label: "Phone Number",
      value: user.phone || "Not provided",
      verified: isPhoneVerified,
    },
    {
      icon: <CircleAlert className="h-4 w-4 text-blue-600" />,
      label: "Aadhaar",
      value: user.aadhaar ? `${user.aadhaar.slice(0, 4)}-XXXX-${user.aadhaar.slice(-4)}` : "Not provided",
      verified: isAadhaarVerified,
    },
    {
      icon: <Mail className="h-4 w-4 text-blue-600" />,
      label: "Email",
      value: user.email || "Not provided",
    },
    {
      icon: <CircleAlert className="h-4 w-4 text-blue-600" />,
      label: "PAN",
      value: user.pan ? `${user.pan.slice(0, 2)}XXXXX${user.pan.slice(-3)}` : "Not provided",
    },
    {
      icon: <Shield className="h-4 w-4 text-blue-600" />,
      label: "Roles",
      value: user.roles?.join(", ") || "user",
    },
    {
      icon: <CreditCard className="h-4 w-4 text-blue-600" />,
      label: "Bank Details",
      value: user.bankDetails
        ? `${user.bankDetails.bankName}, XXXX${user.bankDetails.accountNumber?.slice(-4) || ""}`
        : "Not provided",
      verified: isBankVerified,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-xl">Profile Summary</CardTitle>
            <Badge 
              variant={pendingVerifications.length === 0 ? "outline" : "secondary"}
              className={`${pendingVerifications.length === 0 ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}`}
            >
              {pendingVerifications.length === 0 ? (
                <span className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Fully Verified
                </span>
              ) : (
                <span className="flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Pending Verification
                </span>
              )}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <dl className="divide-y">
              {fields.map((field) => (
                <div key={field.label} className="px-6 py-4 flex justify-between items-center group hover:bg-gray-50 transition-colors">
                  <dt className="flex items-center text-sm text-gray-600">
                    {field.icon}
                    <span className="ml-2">{field.label}</span>
                  </dt>
                  <dd className="text-sm text-gray-900 font-medium flex items-center">
                    {field.value}
                    {field.verified !== undefined && (
                      field.verified ? (
                        <CheckCircle className="ml-1.5 h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="ml-1.5 h-4 w-4 text-amber-500" />
                      )
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle className="text-xl">Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Phone Verification</span>
                <Badge variant={isPhoneVerified ? "outline" : "secondary"} className={isPhoneVerified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                  {isPhoneVerified ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${isPhoneVerified ? "bg-green-500" : "bg-amber-500"}`} style={{ width: isPhoneVerified ? "100%" : "30%" }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium">Aadhaar Verification</span>
                <Badge variant={isAadhaarVerified ? "outline" : "secondary"} className={isAadhaarVerified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                  {isAadhaarVerified ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${isAadhaarVerified ? "bg-green-500" : "bg-amber-500"}`} style={{ width: isAadhaarVerified ? "100%" : "60%" }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium">Bank Details</span>
                <Badge variant={isBankVerified ? "outline" : "secondary"} className={isBankVerified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                  {isBankVerified ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${isBankVerified ? "bg-green-500" : "bg-amber-500"}`} style={{ width: isBankVerified ? "100%" : "45%" }}></div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Verification Tips</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Complete all verifications to access all features</li>
                  <li>• Your Aadhaar verification enables claims submission</li>
                  <li>• Bank verification is required for receiving benefits</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;

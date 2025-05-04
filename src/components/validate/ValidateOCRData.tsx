import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFormContext } from "@/context/FormContext";
import { useToast } from "@/hooks/use-toast";
import { ClaimQueueManager } from "@/services/ClaimQueueManager";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ValidateOCRData = () => {
  const { claims, setClaims } = useFormContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const claimId = new URLSearchParams(location.search).get("claimId");

  const claim = claims.find(c => c.id === claimId);
  const [formData, setFormData] = useState({
    membershipNumber: claim?.ocrData?.membershipNumber || "",
    claimantName: claim?.ocrData?.claimantName || "",
    fatherName: claim?.ocrData?.fatherName || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!claim || !claim.ocrData) {
      navigate("/");
    }
  }, [claim, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setClaims(prev =>
        prev.map(c =>
          c.id === claimId
            ? ClaimQueueManager.assignOrangeAfterOCRValidation({
                ...c,
                membershipNumber: formData.membershipNumber,
                claimantName: formData.claimantName,
                fatherName: formData.fatherName,
              })
            : c
        )
      );
      toast({
        title: "OCR Data Validated",
        description: "Your claim has been moved to the Orange queue for further validation.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate OCR data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Validate OCR Data</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="membershipNumber" className="form-label">Membership Number</label>
                <Input
                  id="membershipNumber"
                  name="membershipNumber"
                  value={formData.membershipNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="claimantName" className="form-label">Claimant Name</label>
                <Input
                  id="claimantName"
                  name="claimantName"
                  value={formData.claimantName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="fatherName" className="form-label">Father's Name</label>
                <Input
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Validating..." : "Confirm Data"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ValidateOCRData;
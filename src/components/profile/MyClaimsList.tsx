import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormContext } from "@/context/FormContext";
import { useToast } from "@/hooks/use-toast";
import { ClaimService } from "@/services/ClaimService";
import { SchemeService } from "@/services/SchemeService";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const MyClaimsList = () => {
  const { user } = useFormContext();
  const { toast } = useToast();

  const [claims, setClaims] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    membershipNumber: "",
    name: user ? `${user.firstName} ${user.lastName}` : "",
    fatherName: "",
  });
  const [selectedScheme, setSelectedScheme] = useState("");
  const [certificates, setCertificates] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg"],
      "image/png": [".png"],
    },
    onDrop: (acceptedFiles) => {
      setCertificates(acceptedFiles);
    },
  });

  useEffect(() => {
    fetchClaims();
    fetchSchemes();
  }, []);

  useEffect(() => {
    if (isModalOpen && user) {
      setFormData({
        membershipNumber: "",
        name: `${user.firstName} ${user.lastName}`,
        fatherName: "",
      });
      setSelectedScheme("");
      setCertificates([]);
    }
  }, [isModalOpen, user]);

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      const response = await ClaimService.getMyClaims();
      setClaims(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch claims",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchemes = async () => {
    try {
      const response = await SchemeService.getSchemes();
      setSchemes(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch schemes",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedScheme) {
      toast({
        title: "Error",
        description: "Please select a scheme",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        userId: user._id,
        schemeId: selectedScheme,
        membershipNumber: formData.membershipNumber,
        name: formData.name,
        fatherName: formData.fatherName,
        certificates,
      };
      await ClaimService.submitClaim(data);
      toast({
        title: "Claim Submitted",
        description: "Your claim has been submitted successfully",
      });
      setIsModalOpen(false);
      await fetchClaims();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit claim",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Claims</h2>
        <Button onClick={() => setIsModalOpen(true)}>Add a New Claim</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Claim ID</TableHead>
            <TableHead>Scheme</TableHead>
            <TableHead>Membership Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.map((claim) => (
            <TableRow key={claim._id}>
              <TableCell>{claim._id}</TableCell>
              <TableCell>
                {schemes.find((s) => s._id === claim.schemeId)?.name || "Unknown"}
              </TableCell>
              <TableCell>{claim.membershipNumber}</TableCell>
              <TableCell>{claim.status}</TableCell>
              <TableCell>{new Date(claim.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Submit a New Claim</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Claimant Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Claimant Name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="scheme" className="text-sm font-medium">
                Scheme
              </label>
              <select
                id="scheme"
                value={selectedScheme}
                onChange={(e) => setSelectedScheme(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Scheme</option>
                {schemes.map((scheme) => (
                  <option key={scheme._id} value={scheme._id}>
                    {scheme.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="membershipNumber" className="text-sm font-medium">
                Membership Number
              </label>
              <Input
                id="membershipNumber"
                name="membershipNumber"
                value={formData.membershipNumber}
                onChange={handleInputChange}
                placeholder="Membership Number"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="fatherName" className="text-sm font-medium">
                Father’s Name
              </label>
              <Input
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                placeholder="Father’s Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Certificates</label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed p-4 rounded-md text-center ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here...</p>
                ) : (
                  <p>Drag & drop certificates here, or click to select files (.pdf, .jpg, .png)</p>
                )}
              </div>
              {certificates.length > 0 && (
                <div className="mt-2">
                  <p>Selected Files:</p>
                  <ul className="list-disc pl-5">
                    {certificates.map((file, index) => (
                      <li key={index} className="text-sm">{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Claim"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyClaimsList;
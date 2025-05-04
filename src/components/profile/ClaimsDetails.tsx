import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Claim, Scheme, SchemeRecord } from "@/services/dto-types";
import { SchemeRecordService } from "@/services/SchemeRecordService";
import { SchemeService } from "@/services/SchemeService";
import { UserService } from "@/services/UserService";
import { Check, Eye, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";

const ClaimsDetails: React.FC = () => {
  const { user } = useFormContext();
  const { toast } = useToast();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<string>("");
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [schemeRecords, setSchemeRecords] = useState<SchemeRecord[]>([]);
  const [isDocPopupOpen, setIsDocPopupOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const schemesData = await SchemeService.getSchemes();
        setSchemes(schemesData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load schemes.",
          variant: "destructive",
        });
      }
    };
    if (user.roles?.includes("approver") || user.roles?.includes("admin")) {
      fetchSchemes();
    }
  }, [user, toast]);

  useEffect(() => {
    const fetchClaims = async () => {
      if (selectedScheme) {
        try {
          const allClaims = await ClaimService.getAllClaims();
          const filtered = allClaims.filter((claim) => claim.schemeId._id === selectedScheme);
          setClaims(allClaims);
          setFilteredClaims(filtered);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load claims.",
            variant: "destructive",
          });
        }
      } else {
        setFilteredClaims([]);
      }
    };
    fetchClaims();
  }, [selectedScheme, toast]);

  const fetchSchemeRecords = async (claim: Claim) => {
    try {
      const dbUser = await UserService.getUserById(claim.userId || "");
      const records = await SchemeRecordService.getSchemeRecords({
        aadhaar: dbUser.aadhaar || "",
        name: claim.name,
        schemeId: claim.schemeId._id,
        membershipNumber: claim.membershipNumber,
      });
      setSchemeRecords(records);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch scheme records.",
        variant: "destructive",
      });
    }
  };

  const handleViewDocuments = async (claim: Claim) => {
    setSelectedClaim(claim);
    // await fetchSchemeRecords(claim);
    setIsDocPopupOpen(true);
  };

  const handleDocumentClick = (doc: string) => {
    setSelectedDocument(doc);
    setIsViewerOpen(true);
  };

  const handleMultiSelectDocument = (doc: string) => {
    setSelectedImages((prev) =>
      prev.includes(doc)
        ? prev.filter((img) => img !== doc)
        : [...prev, doc]
    );
  };

  const handleApprove = async (claimId: string) => {
    try {
      await ClaimService.approveClaim(claimId);
      setClaims((prev) =>
        prev.map((claim) =>
          claim._id === claimId ? { ...claim, status: "approved" } : claim
        )
      );
      setFilteredClaims((prev) =>
        prev.map((claim) =>
          claim._id === claimId ? { ...claim, status: "approved" } : claim
        )
      );
      toast({
        title: "Claim Approved",
        description: "The claim has been approved.",
      });
      setIsDocPopupOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve claim.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (claimId: string) => {
    try {
      await ClaimService.rejectClaim(claimId);
      setClaims((prev) =>
        prev.map((claim) =>
          claim._id === claimId
            ? { ...claim, status: "rejected", retries: claim.retries + 1 }
            : claim
        )
      );
      setFilteredClaims((prev) =>
        prev.map((claim) =>
          claim._id === claimId
            ? { ...claim, status: "rejected", retries: claim.retries + 1 }
            : claim
        )
      );
      toast({
        title: "Claim Rejected",
        description: "The claim has been rejected.",
      });
      setIsDocPopupOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject claim.",
        variant: "destructive",
      });
    }
  };

  const handleUndoApprove = async (claimId: string) => {
    try {
      await ClaimService.undoApproveClaim(claimId);
      setClaims((prev) =>
        prev.map((claim) =>
          claim._id === claimId ? { ...claim, status: "pending" } : claim
        )
      );
      setFilteredClaims((prev) =>
        prev.map((claim) =>
          claim._id === claimId ? { ...claim, status: "pending" } : claim
        )
      );
      toast({
        title: "Approval Undone",
        description: "The claim approval has been undone.",
      });
      setIsDocPopupOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to undo claim approval.",
        variant: "destructive",
      });
    }
  };

  const renderDocument = (doc: string, thumbnailPath?: string) => {
    const extension = doc.toLowerCase().split('.').pop();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    if (!allowedExtensions.includes(extension)) {
      return <div className="text-red-500">Unsupported file format</div>;
    }

    const docUrl = doc.startsWith("http") ? doc : doc;
    const thumbnailUrl = thumbnailPath && extension === 'pdf' ? (thumbnailPath.startsWith("http") ? thumbnailPath : thumbnailPath) : docUrl;

    return (
      <img
        src={thumbnailUrl}
        alt="Document"
        className="w-32 h-32 object-cover cursor-pointer rounded"
        onClick={() => handleDocumentClick(docUrl)}
        onError={() => toast({
          title: "Error",
          description: "Failed to load document.",
          variant: "destructive",
        })}
      />
    );
  };

  if (!user.roles?.some((role) => ["approver", "admin"].includes(role))) {
    return <div className="text-center text-red-500">Access Denied</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-3xl font-semibold text-gray-800">
            Claims Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 w-full max-w-md">
            <label htmlFor="scheme" className="block text-sm font-medium text-gray-700 mb-2">
              Select Scheme
            </label>
            <Select onValueChange={setSelectedScheme} value={selectedScheme}>
              <SelectTrigger id="scheme" className="w-full border-gray-300 rounded-md">
                <SelectValue placeholder="Select a scheme" />
              </SelectTrigger>
              <SelectContent>
                {schemes.map((scheme) => (
                  <SelectItem key={scheme._id} value={scheme._id}>
                    {scheme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {filteredClaims.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-left font-semibold text-gray-600">Membership Number</TableHead>
                    <TableHead className="text-left font-semibold text-gray-600">Name</TableHead>
                    <TableHead className="text-left font-semibold text-gray-600">Father Name</TableHead>
                    <TableHead className="text-left font-semibold text-gray-600">Scheme</TableHead>
                    <TableHead className="text-left font-semibold text-gray-600">Submitted On</TableHead>
                    <TableHead className="text-left font-semibold text-gray-600">Document</TableHead>
                    <TableHead className="text-left font-semibold text-gray-600">Status</TableHead>
                    <TableHead className="text-left font-semibold text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims.map((claim) => (
                    <TableRow key={claim._id} className="hover:bg-gray-50">
                      <TableCell className="text-gray-700">{claim.membershipNumber}</TableCell>
                      <TableCell className="text-gray-700">{claim.name}</TableCell>
                      <TableCell className="text-gray-700">{claim.fatherName}</TableCell>
                      <TableCell className="text-gray-700">{claim.schemeId.name}</TableCell>
                      <TableCell className="text-gray-700">
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocuments(claim)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className={`text-gray-700 ${claim.status === 'approved' ? 'text-green-600' : claim.status === 'rejected' ? 'text-red-600' : ''}`}>
                        {claim.status}
                      </TableCell>
                      <TableCell>
                        {user.roles?.includes("approver") ? (
                          <div className="flex space-x-2">
                            {claim.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApprove(claim._id)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReject(claim._id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {claim.status === "approved" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUndoApprove(claim._id)}
                                className="text-yellow-600 hover:text-yellow-800"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ) : user.roles?.includes("admin") ? (
                          <span className="text-gray-500">View Only</span>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6">
              {selectedScheme ? "No claims found for the selected scheme." : "Please select a scheme to view claims."}
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={isDocPopupOpen} onOpenChange={setIsDocPopupOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Document Verification</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">User Uploaded Documents</h3>
              {selectedClaim?.certificate?.length ? (
                <div className="grid grid-cols-2 gap-4">
                  {selectedClaim.certificate.map((doc, index) => (
                    <div key={index} className="flex items-center">
                      {renderDocument(doc, selectedClaim.thumbnailPath?.[index])}
                      <input
                        type="checkbox"
                        onChange={() => handleMultiSelectDocument(doc)}
                        checked={selectedImages.includes(doc)}
                        className="ml-2"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No user documents available.</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Admin Uploaded Documents</h3>
              {schemeRecords.length ? (
                <div className="grid grid-cols-2 gap-4">
                  {schemeRecords.flatMap((record) =>
                    record.documents.map((doc, index) => (
                      <div key={index} className="flex items-center">
                        {renderDocument(doc)}
                        <input
                          type="checkbox"
                          onChange={() => handleMultiSelectDocument(doc)}
                          checked={selectedImages.includes(doc)}
                          className="ml-2"
                        />
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No admin documents available.</p>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <Button
              onClick={() => setIsViewerOpen(true)}
              disabled={selectedImages.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              View Selected Documents
            </Button>
            {user.roles?.includes("approver") && selectedClaim && (
              <div className="flex space-x-2">
                {selectedClaim.status === "pending" && (
                  <>
                    <Button
                      onClick={() => handleApprove(selectedClaim._id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" /> Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedClaim._id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <X className="h-4 w-4 mr-2" /> Reject
                    </Button>
                  </>
                )}
                {selectedClaim.status === "approved" && (
                  <Button
                    onClick={() => handleUndoApprove(selectedClaim._id)}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" /> Undo Approve
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Document Viewer</DialogTitle>
          </DialogHeader>
          {selectedDocument ? (
            <div className="mt-4">
              {/\.(jpg|jpeg|png)$/i.test(selectedDocument) ? (
                <img
                  src={selectedDocument}
                  alt="Selected Document"
                  className="w-full h-auto rounded"
                />
              ) : /\.pdf$/i.test(selectedDocument) ? (
                <iframe
                  src={selectedDocument}
                  title="PDF Document"
                  className="w-full h-[600px] rounded"
                />
              ) : (
                <p className="text-red-500">Unsupported format</p>
              )}
            </div>
          ) : selectedImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {selectedImages.map((doc, index) => (
                <div key={index}>
                  {/\.(jpg|jpeg|png)$/i.test(doc) ? (
                    <img
                      src={doc}
                      alt={`Selected Document ${index}`}
                      className="w-full h-auto rounded"
                    />
                  ) : /\.pdf$/i.test(doc) ? (
                    <iframe
                      src={doc}
                      title={`PDF Document ${index}`}
                      className="w-full h-[300px] rounded"
                    />
                  ) : (
                    <p className="text-red-500">Unsupported format</p>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClaimsDetails;
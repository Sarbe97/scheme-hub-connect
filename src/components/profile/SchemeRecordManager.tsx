
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFormContext } from "@/context/FormContext";
import { useToast } from "@/hooks/use-toast";
import { SchemeRecordService } from "@/services/SchemeRecordService";
import { SchemeService } from "@/services/SchemeService";
import { Search, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Scheme {
  _id: string;
  name: string;
  description: string;
}

interface SchemeRecord {
  _id: string;
  aadhaar: string;
  name: string;
  schemeId: string;
  membershipNumber: string;
  documents: string[];
  extraDetails: Record<string, any>;
}

const SchemeRecordManager: React.FC = () => {
  const { user } = useFormContext();
  const { toast } = useToast();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [records, setRecords] = useState<SchemeRecord[]>([]);
  const [searchMembershipNumber, setSearchMembershipNumber] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [newRecord, setNewRecord] = useState({
    aadhaar: "",
    name: "",
    schemeId: "",
    membershipNumber: "",
    documents: [] as File[],
    extraDetails: {} as Record<string, any>,
  });
  const [editingRecord, setEditingRecord] = useState<SchemeRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  if (!user || user.role !== 'ADMIN') {
    return <div className="flex min-h-screen items-center justify-center text-red-500">Access Denied</div>;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [schemesData, recordsData] = await Promise.all([
          SchemeService.getSchemes(),
          SchemeRecordService.getSchemeRecords(""),
        ]);
        setSchemes(schemesData);
        setRecords(recordsData);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const results = await SchemeRecordService.getSchemeRecords(searchMembershipNumber);
      setRecords(results);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to search records. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsUploading(true);
      await SchemeRecordService.uploadCsv(csvFile);
      const recordsData = await SchemeRecordService.getSchemeRecords("");
      setRecords(recordsData);
      setCsvFile(null);
      toast({
        title: "Success",
        description: "CSV uploaded successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to upload CSV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateRecord = async () => {
    if (!newRecord.aadhaar || !newRecord.name || !newRecord.schemeId || !newRecord.membershipNumber) {
      toast({
        title: "Error",
        description: "All required fields must be filled.",
        variant: "destructive",
      });
      return;
    }
    try {
      await SchemeRecordService.createSchemeRecord(newRecord);
      const recordsData = await SchemeRecordService.getSchemeRecords("");
      setRecords(recordsData);
      setNewRecord({
        aadhaar: "",
        name: "",
        schemeId: "",
        membershipNumber: "",
        documents: [],
        extraDetails: {},
      });
      setIsCreateModalOpen(false);
      toast({
        title: "Success",
        description: "Record created successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create record. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRecord = async () => {
    if (!editingRecord) return;
    try {
      await SchemeRecordService.updateSchemeRecord(editingRecord._id, {
        aadhaar: editingRecord.aadhaar,
        name: editingRecord.name,
        schemeId: editingRecord.schemeId,
        membershipNumber: editingRecord.membershipNumber,
        documents: newRecord.documents, // Use new documents from form
        extraDetails: editingRecord.extraDetails,
      });
      const recordsData = await SchemeRecordService.getSchemeRecords("");
      setRecords(recordsData);
      setEditingRecord(null);
      setNewRecord({ ...newRecord, documents: [] }); // Clear documents
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "Record updated successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update record. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRecord = async () => {
    if (!recordToDelete) return;
    try {
      await SchemeRecordService.deleteSchemeRecord(recordToDelete);
      const recordsData = await SchemeRecordService.getSchemeRecords("");
      setRecords(recordsData);
      setRecordToDelete(null);
      setIsDeleteModalOpen(false);
      toast({
        title: "Success",
        description: "Record deleted successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete record. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getSchemeName = (schemeId: string) => {
    const scheme = schemes.find((s) => s._id === schemeId);
    return scheme ? scheme.name : "Unknown";
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Scheme Record Management</h2>
        <div className="flex space-x-4 mb-4">
          <Button onClick={() => setIsCreateModalOpen(true)}>Create Record</Button>
          <div className="flex space-x-2">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            />
            <Button onClick={handleCsvUpload} disabled={!csvFile || isUploading}>
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload CSV"}
            </Button>
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Search by Membership Number"
              value={searchMembershipNumber}
              onChange={(e) => setSearchMembershipNumber(e.target.value)}
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aadhaar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Scheme</TableHead>
              <TableHead>Membership Number</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>{record.aadhaar}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{getSchemeName(record.schemeId)}</TableCell>
                  <TableCell>{record.membershipNumber}</TableCell>
                  <TableCell>
                    {record.documents.map((doc, index) => (
                      <a key={index} href={doc} target="_blank" rel="noopener noreferrer" className="block underline">
                        Doc {index + 1}
                      </a>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setEditingRecord(record);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setRecordToDelete(record._id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Create Record Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Scheme Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Aadhaar"
                value={newRecord.aadhaar}
                onChange={(e) => setNewRecord({ ...newRecord, aadhaar: e.target.value })}
              />
              <Input
                placeholder="Name"
                value={newRecord.name}
                onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
              />
              <select
                value={newRecord.schemeId}
                onChange={(e) => setNewRecord({ ...newRecord, schemeId: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Scheme</option>
                {schemes.map((scheme) => (
                  <option key={scheme._id} value={scheme._id}>{scheme.name}</option>
                ))}
              </select>
              <Input
                placeholder="Membership Number"
                value={newRecord.membershipNumber}
                onChange={(e) => setNewRecord({ ...newRecord, membershipNumber: e.target.value })}
              />
              <Input
                type="file"
                multiple
                accept=".pdf,.jpg,.png"
                onChange={(e) => setNewRecord({ ...newRecord, documents: Array.from(e.target.files || []) })}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRecord}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Record Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Scheme Record</DialogTitle>
            </DialogHeader>
            {editingRecord && (
              <div className="space-y-4">
                <Input
                  placeholder="Aadhaar"
                  value={editingRecord.aadhaar}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, aadhaar: e.target.value })
                  }
                />
                <Input
                  placeholder="Name"
                  value={editingRecord.name}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, name: e.target.value })
                  }
                />
                <select
                  value={editingRecord.schemeId}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, schemeId: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Scheme</option>
                  {schemes.map((scheme) => (
                    <option key={scheme._id} value={scheme._id}>{scheme.name}</option>
                  ))}
                </select>
                <Input
                  placeholder="Membership Number"
                  value={editingRecord.membershipNumber}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, membershipNumber: e.target.value })
                  }
                />
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => setNewRecord({ ...newRecord, documents: Array.from(e.target.files || []) })}
                />
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRecord}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this record? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteRecord}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SchemeRecordManager;

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFormContext } from '@/context/FormContext';
import { useToast } from '@/hooks/use-toast';
import { ClaimService } from '@/services/ClaimService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user } = useFormContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        if (user.roles?.includes('approver')) {
          const allClaims = await ClaimService.getAllClaims();
          setClaims(allClaims);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load claims.',
          variant: 'destructive',
        });
      }
    };
    if (user.roles?.includes('approver')) {
      fetchClaims();
    }
  }, [user,toast]);

  const handleApprove = async (claimId: string) => {
    try {
      await ClaimService.approveClaim(claimId);
      setClaims((prev) =>
        prev.map((claim) =>
          claim.id === claimId ? { ...claim, status: 'approved' } : claim
        )
      );
      toast({
        title: 'Claim Approved',
        description: 'The claim has been approved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve claim.',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (claimId: string) => {
    try {
      await ClaimService.rejectClaim(claimId);
      setClaims((prev) =>
        prev.map((claim) =>
          claim.id === claimId ? { ...claim, status: 'rejected', retries: claim.retries + 1 } : claim
        )
      );
      toast({
        title: 'Claim Rejected',
        description: 'The claim has been rejected.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject claim.',
        variant: 'destructive',
      });
    }
  };

  if (!user.roles?.some((role) => ['approver', 'admin', 'manager'].includes(role))) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
            {user.roles?.some((role) => ['admin', 'manager'].includes(role)) && (
              <Button onClick={() => navigate('/admin/schemes')}>
                Manage Schemes
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {user.roles?.includes('approver') && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membership Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Father Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell>{claim.membershipNumber}</TableCell>
                      <TableCell>{claim.name}</TableCell>
                      <TableCell>{claim.fatherName}</TableCell>
                      <TableCell>{claim.status}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleApprove(claim.id)}
                          disabled={claim.status !== 'pending'}
                          className="mr-2"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(claim.id)}
                          disabled={claim.status !== 'pending'}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
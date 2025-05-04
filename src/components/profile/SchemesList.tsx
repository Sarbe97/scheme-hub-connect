
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFormContext } from '@/context/FormContext';
import { useToast } from '@/hooks/use-toast';
import { ClaimService } from '@/services/ClaimService';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SchemesList = () => {
  const { claims, setClaims } = useFormContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClaims = async () => {
      setIsLoading(true);
      try {
        const fetchedClaims = await ClaimService.getMyClaims();
        setClaims(fetchedClaims);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch claims. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchClaims();
  }, [setClaims, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Claims</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading claims...</p>
        ) : claims.length === 0 ? (
          <p>No claims found. <Link to="/file-claim" className="text-primary">File a new claim</Link>.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Membership Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Father's Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Retries</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell>{claim.id}</TableCell>
                  <TableCell>{claim.membershipNumber || 'N/A'}</TableCell>
                  <TableCell>{claim.name}</TableCell>
                  <TableCell>{claim.fatherName}</TableCell>
                  <TableCell>{claim.status}</TableCell>
                  <TableCell>{claim.retries}</TableCell>
                  <TableCell>
                    {claim.retries < 3 && claim.status === 'rejected' && (
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/retry-claim?claimId=${claim.id}`}>Retry</Link>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SchemesList;
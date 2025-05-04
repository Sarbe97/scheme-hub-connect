import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFormContext } from "@/context/FormContext";
import { useToast } from "@/hooks/use-toast";
import { Scheme } from "@/services/dto-types";
import { SchemeService } from "@/services/SchemeService";
import { CalendarIcon, InfoIcon, PackageIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AspectRatio } from "./ui/aspect-ratio";

const SchemeDetails: React.FC = () => {
  const { isRegistered, user } = useFormContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setIsLoading(true);
        const data = await SchemeService.getSchemes();
        setSchemes(data);
      } catch (err) {
        setError('Failed to load schemes. Please try again later.');
        toast({
          title: 'Error',
          description: 'Unable to load schemes. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchemes();
  }, [toast]);

  const handleSchemeSelection = (schemeId: string) => {
    setSelectedScheme(schemeId);
  };

  const handleSubmit = () => {
    if (!selectedScheme) return;

    if (isRegistered && user?.aadhaarVerified) {
      // Logged-in and verified users proceed to application
      navigate(`/apply/${selectedScheme}`);
    } else {
      // Public users are redirected to login with a redirect URL
      navigate('/login', { state: { from: `/apply/${selectedScheme}` } });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading available schemes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="bg-destructive/10 text-destructive rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Available Schemes</h1>
          <p className="text-muted-foreground mt-2">
            Browse through our available welfare schemes and select one to apply for.
          </p>
        </div>

        {schemes.length === 0 ? (
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <PackageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No Schemes Available</h2>
            <p className="text-muted-foreground">
              There are currently no welfare schemes available for application. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <Card 
                key={scheme._id} 
                className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
                  selectedScheme === scheme._id 
                    ? "ring-2 ring-primary ring-offset-2" 
                    : ""
                }`}
                onClick={() => handleSchemeSelection(scheme._id)}
              >
                <AspectRatio ratio={16 / 9} className="bg-muted">
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted/80 to-muted">
                    <PackageIcon className="h-10 w-10 text-muted-foreground/60" />
                  </div>
                </AspectRatio>
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{scheme.name}</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full" onClick={(e) => e.stopPropagation()}>
                            <InfoIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">View detailed information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <CardDescription className="line-clamp-2 mt-2">
                    {scheme.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <span>Application period: Ongoing</span>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <Button 
                    variant="outline"
                    className={`w-full ${selectedScheme === scheme._id ? "bg-primary/10" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSchemeSelection(scheme._id);
                    }}
                  >
                    {selectedScheme === scheme._id ? "Selected" : "Select Scheme"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Button
            className="min-w-[200px]"
            onClick={handleSubmit}
            disabled={!selectedScheme}
            size="lg"
          >
            {isRegistered ? "Proceed to Application" : "Sign In to Apply"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetails;

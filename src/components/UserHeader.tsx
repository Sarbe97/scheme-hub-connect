import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserHeader = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // In a real app, we would clear authentication state
    navigate('/');
  };

  return (
    <header className="bg-scheme-blue text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">
            <Link to="/dashboard">SchemeHub</Link>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-8">
            <Link to="/dashboard" className="text-white hover:text-scheme-light-blue transition">
              Dashboard
            </Link>
            <Link to="/dashboard/claims" className="text-white hover:text-scheme-light-blue transition">
              My Claims
            </Link>
            <Link to="/dashboard/new-claim" className="text-white hover:text-scheme-light-blue transition">
              Submit Claim
            </Link>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-scheme-teal rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to="/dashboard/profile" className="w-full">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/dashboard/settings" className="w-full">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;

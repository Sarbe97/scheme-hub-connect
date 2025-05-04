import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const HomeHeader = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-scheme-blue">
            <Link to="/">SchemeHub</Link>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-scheme-blue transition">
              Home
            </Link>
            <Link to="/#schemes" className="text-gray-700 hover:text-scheme-blue transition">
              Schemes
            </Link>
            <Link to="/#process" className="text-gray-700 hover:text-scheme-blue transition">
              Claim Process
            </Link>
            <Link to="/#contact" className="text-gray-700 hover:text-scheme-blue transition">
              Contact
            </Link>
          </nav>
          <Button asChild variant="outline" className="border-scheme-blue text-scheme-blue hover:bg-scheme-blue hover:text-white">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild className="bg-scheme-blue hover:bg-scheme-teal">
            <Link to="/login?register=true">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;

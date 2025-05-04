
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-scheme-blue mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">Page Not Found</p>
        <p className="text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Button asChild className="bg-scheme-blue hover:bg-scheme-teal">
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

import HomeHeader from "@/components/HomeHeader";
import ProcessStep from "@/components/ProcessStep";
import SchemesList from "@/components/profile/SchemesList";
import { Button } from "@/components/ui/button";
import { useFormContext } from "@/context/FormContext";
import { User } from "@/services/dto-types";
import { CheckCircle, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const { isRegistered, user } = useFormContext();

  // Helper to get full name or fallback
  const getFullName = (user: User) => {
    if (!user || !user.firstName) return "User";
    return `${user.firstName} ${user.lastName || ""}`.trim();
  };

  return (
    <div className="min-h-screen flex flex-col">
       <HomeHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          {isRegistered && user?.aadhaarVerified ? (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Welcome, {getFullName(user)}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Button asChild size="lg">
                  <Link to="/file-claim">File a New Claim</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link to="/profile">View Profile</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
                  Government Scheme Portal
                </h1>
                <p className="text-lg mb-8 text-gray-700 max-w-lg">
                  Access all government welfare schemes easily in one place.
                  Check eligibility, apply online, and track your applications
                  seamlessly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link to="/register">Register Now</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-6 -left-6 w-full h-full rounded-xl bg-primary/20"></div>
                  <div className="relative bg-white p-6 rounded-xl shadow-lg">
                    <img
                      src="/placeholder.svg"
                      alt="Government schemes"
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Quick Access</h3>
                      <p className="text-sm text-gray-600">
                        Get updates on latest schemes and check your eligibility
                        with just a few clicks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Claim Status for Logged-in Users */}
      {isRegistered && user?.aadhaarVerified && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Your Claims
            </h2>
            <SchemesList />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 flex items-center justify-center bg-primary/10 rounded-full mb-4">
              </div>
                <h3 className="text-xl font-semibold mb-3">Register</h3>
              <p className="text-gray-600">
                Create an account with your basic details and verify your
                identity securely.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                <FileCheck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Check Eligibility</h3>
              <p className="text-gray-600">
                View available schemes and check your eligibility based on your
                profile.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-14 w-14 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                <CheckCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Apply & Track</h3>
              <p className="text-gray-600">
                Apply for schemes online and track your application status in
                real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schemes Preview Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Schemes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore some of the most popular government welfare schemes
              available for citizens.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">PM Kisan Samman Nidhi</h3>
              <p className="text-sm text-gray-600 mb-4">
                Financial support to farmer families across the country.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Learn More
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Pradhan Mantri Awas Yojana</h3>
              <p className="text-sm text-gray-600 mb-4">
                Housing for all by providing financial assistance for home
                construction.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Learn More
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Ayushman Bharat</h3>
              <p className="text-sm text-gray-600 mb-4">
                Health insurance coverage for economically vulnerable families.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Learn More
              </Button>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button asChild>
              <Link to="/schemes">View All Schemes</Link>
            </Button>
          </div>
        </div>
      </section>

 {/* Claim Process Section */}
 <section id="process" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-scheme-blue">Claim Submission Process</h2>
            <p className="text-gray-600 mt-2">Follow these simple steps to submit your scheme claim</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <ProcessStep 
              number={1} 
              title="Register or Login" 
              description="Create an account or login using your mobile number and Aadhaar number."
            />
            <ProcessStep 
              number={2} 
              title="Select a Scheme" 
              description="Browse through available schemes and select the one you want to claim benefits for."
            />
            <ProcessStep 
              number={3} 
              title="Fill in Details" 
              description="Provide necessary information including your bank details for fund transfer."
            />
            <ProcessStep 
              number={4} 
              title="Upload Documents" 
              description="Upload all required supporting documents to verify your eligibility."
            />
            <ProcessStep 
              number={5} 
              title="Submit and Track" 
              description="Submit your claim and track its status through your dashboard."
            />
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-scheme-blue hover:bg-scheme-teal">
              <Link to="/login">Start Your Claim Now</Link>
            </Button>
          </div>
        </div>
      </section>
      

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Get Started Today
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Register now to access all government schemes and benefits that
              you are eligible for.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/register">Register</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SchemeHub</h3>
              <p className="text-gray-400">Your one-stop portal for all government schemes and benefits.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                <li><Link to="/#schemes" className="text-gray-400 hover:text-white transition">Schemes</Link></li>
                <li><Link to="/#process" className="text-gray-400 hover:text-white transition">Claim Process</Link></li>
                <li><Link to="/#contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/disclaimer" className="text-gray-400 hover:text-white transition">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SchemeHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

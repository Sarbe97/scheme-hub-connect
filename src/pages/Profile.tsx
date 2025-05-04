import Header from "@/components/Header";
import BankDetailsForm from "@/components/profile/BankDetailsForm";
import ClaimsDetails from "@/components/profile/ClaimsDetails";
import IdVerification from "@/components/profile/IdVerification";
import MyClaimsList from "@/components/profile/MyClaimsList";
import SchemeManagement from "@/components/profile/SchemeManagement";
import SchemeRecordManager from "@/components/profile/SchemeRecordManager";
import SecuritySettings from "@/components/profile/SecuritySettings";
import UserProfile from "@/components/profile/UserProfile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormContext } from "@/context/FormContext";
import { Tab } from "@/services/dto-types";
import {
  ArrowLeft,
  Banknote,
  FileText,
  Home,
  LayoutDashboard,
  Lock,
  Search,
  Settings,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { user, isLoading } = useFormContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("profile");

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center text-gray-600 bg-gray-50">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-blue-200 rounded mb-2"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const isClaimsTabDisabled: boolean =
    !user.phoneVerified || !user.aadhaarVerified;

  const tabs: Tab[] = [
    {
      value: "profile",
      label: "Profile Details",
      icon: <User className="h-5 w-5" />,
      roles: ["user", "approver", "admin"],
    },
    {
      value: "myclaims",
      label: "My Claims",
      icon: <FileText className="h-5 w-5" />,
      disabled: isClaimsTabDisabled,
      roles: ["user"],
    },
    {
      value: "claimsDetails",
      label: "All Claims",
      icon: <FileText className="h-5 w-5" />,
      roles: ["approver", "admin"],
    },
    {
      value: "schemes",
      label: "Schemes",
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      value: "verification",
      label: "ID Verification",
      icon: <User className="h-5 w-5" />,
      roles: ["user"],
    },
    {
      value: "bank",
      label: "Bank Details",
      icon: <Banknote className="h-5 w-5" />,
      roles: ["user"],
    },
    {
      value: "security",
      label: "Security",
      icon: <Lock className="h-5 w-5" />,
      roles: ["user",' "approver", "admin"],'],
    },
    {
      value: "schemeRecordManger",
      label: "Scheme Record Manager",
      icon: <Search className="h-5 w-5" />,
      roles: ["admin"],
    },
  ];

  const userRoles = user.roles || ["user"];
  const filteredTabs = tabs.filter((tab) =>
    tab.roles.some((role) => userRoles.includes(role))
  );

  const renderContent = (): JSX.Element | null => {
    switch (activeTab) {
      case "profile":
        return <UserProfile />;
      case "myclaims":
        return <MyClaimsList />;
      case "claimsDetails":
        return <ClaimsDetails />;
      case "schemes":
        return <SchemeManagement />;
      case "verification":
        return <IdVerification />;
      case "bank":
        return <BankDetailsForm />;
      case "security":
        return <SecuritySettings />;
      case "schemeRecordManger":
        return <SchemeRecordManager />;
      default:
        return null;
    }
  };

  const getTabName = (): string => {
    const tab = filteredTabs.find((tab) => tab.value === activeTab);
    return tab ? tab.label : "Profile";
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {getTabName()}
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/schemes")}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Schemes</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {user.firstName?.charAt(0) || "U"}
                      {user.lastName?.charAt(0) || ""}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{`${
                        user.firstName || ""
                      } ${user.lastName || ""}`}</p>
                      <p className="text-sm text-gray-500">
                        {user.email || ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <nav className="flex flex-col space-y-1">
                    {filteredTabs.map((tab) => (
                      <button
                        key={tab.value}
                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                          activeTab === tab.value
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        } ${
                          tab.disabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => !tab.disabled && setActiveTab(tab.value)}
                        disabled={tab.disabled}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {tab.disabled && (
                          <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 ml-auto">
                            Verify ID first
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">{renderContent()}</div>
            </div>
          </div>

          {/* For mobile devices - Bottom Tabs */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-2 z-50">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full grid grid-flow-col auto-cols-fr overflow-x-auto">
                {filteredTabs.slice(0, 4).map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    disabled={tab.disabled}
                    className="flex flex-col items-center py-1.5 px-0"
                  >
                    {tab.icon}
                    <span className="text-xs mt-1">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

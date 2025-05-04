import { Toaster } from "@/components/ui/toaster";
import { FormProvider } from "@/context/FormContext";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SchemeDetails from "./components/SchemeDetails";
import SuccessPage from "./components/SuccessPage";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <FormProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/schemes" element={<SchemeDetails />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </FormProvider>
  );
}

export default App;
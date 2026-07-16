import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import QueryMonitor from "./components/QueryMonitor";   // ← NEW
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import Compare from "./pages/Compare";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0a0a2e] text-white flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <QueryMonitor /> 
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
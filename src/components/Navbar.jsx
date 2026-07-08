import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Explore", path: "/cars" },
  { label: "Compare", path: "/compare" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0a2e]/80 backdrop-blur-md border-b border-[#ff2d9b]/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold">
          <img src={logo} alt="Logo" className="max-w-10 max-h-10 object-cover" />
          <div>
            <span className="bg-gradient-to-r from-[#ff2d9b] to-[#00f5ff] bg-clip-text text-transparent">The Sho</span>
            <span className="text-[#00f5ff]">wroom</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`text-sm font-medium transition hover:text-[#00f5ff] ${
                  location.pathname === link.path
                    ? "text-[#00f5ff] border-b border-[#00f5ff]"
                    : "text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0a0a2e] border-t border-[#ff2d9b]/20 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium transition hover:text-[#00f5ff] ${
                location.pathname === link.path
                  ? "text-[#00f5ff]"
                  : "text-gray-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
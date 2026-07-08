import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#05051a] border-t border-[#ff2d9b]/20 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <img src={logo} alt="Logo" className="max-w-40 max-h-40 object-cover" />
          <p className="text-xl font-bold mb-2">
            <span className="bg-gradient-to-r from-[#ff2d9b] to-[#00f5ff] bg-clip-text text-transparent">The Sho</span>
            <span className="text-[#00f5ff]">wroom</span>
          </p>
          <p className="text-gray-500">
            A modern, data-driven car showroom experience. Explore, compare, and
            discover vehicles from 2010 to present.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-white font-semibold mb-3">Quick Links</p>
          <ul className="space-y-2">
            {["/", "/cars", "/compare", "/about", "/contact"].map(
              (path, i) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="hover:text-[#00f5ff] transition"
                  >
                    {["Home", "Explore Cars", "Compare", "About", "Contact"][i]}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Tech Stack */}
        <div>
          <p className="text-white font-semibold mb-3">Built With</p>
          <div className="flex flex-wrap gap-2">
            {["React", "Redux", "Tailwind CSS", "React Router", "SQL"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full border border-[#00f5ff]/30 text-[#00f5ff] text-xs"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 text-center py-4 text-gray-600 text-xs">
        © {new Date().getFullYear()} The Showroom.
      </div>
    </footer>
  );
}
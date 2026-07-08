import { useState, useEffect } from "react";
import { api } from "../api/client";
import CarCard from "../components/CarCard";
import logo from "../assets/logo.png";

const engineTypes   = ["All", "Petrol", "Diesel", "Hybrid", "Electric"];
const bodyTypes     = ["All", "Sedan", "SUV", "Coupe", "Hatchback"];
const transmissions = ["All", "Automatic", "Manual"];



function FilterPanel({ search, setSearch, filters, handleFilter, resetFilters, manufacturers }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Search</label>
        <input
          type="text"
          placeholder="Search cars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0a0a2e] border border-[#00f5ff]/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#00f5ff]"
        />
      </div>

      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Manufacturer</label>
        <div className="flex flex-wrap gap-2">
          {manufacturers.map((m) => (
            <button key={m} onClick={() => handleFilter("manufacturer", m)}
              className={`px-3 py-1 rounded-full text-xs border transition ${
                filters.manufacturer === m ? "bg-[#ff2d9b] border-[#ff2d9b] text-white" : "border-[#ff2d9b]/20 text-gray-400 hover:border-[#ff2d9b]"
              }`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Engine Type</label>
        <div className="flex flex-wrap gap-2">
          {engineTypes.map((t) => (
            <button key={t} onClick={() => handleFilter("engine_type", t)}
              className={`px-3 py-1 rounded-full text-xs border transition ${
                filters.engine_type === t ? "bg-[#00f5ff] border-[#00f5ff] text-black" : "border-[#00f5ff]/20 text-gray-400 hover:border-[#00f5ff]"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Body Type</label>
        <div className="flex flex-wrap gap-2">
          {bodyTypes.map((b) => (
            <button key={b} onClick={() => handleFilter("body_type", b)}
              className={`px-3 py-1 rounded-full text-xs border transition ${
                filters.body_type === b ? "bg-[#7b2ff7] border-[#7b2ff7] text-white" : "border-[#7b2ff7]/20 text-gray-400 hover:border-[#7b2ff7]"
              }`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Transmission</label>
        <div className="flex flex-wrap gap-2">
          {transmissions.map((t) => (
            <button key={t} onClick={() => handleFilter("transmission", t)}
              className={`px-3 py-1 rounded-full text-xs border transition ${
                filters.transmission === t ? "bg-[#ff2d9b] border-[#ff2d9b] text-white" : "border-[#ff2d9b]/20 text-gray-400 hover:border-[#ff2d9b]"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">
          Max Price: <span className="text-[#00f5ff]">${filters.max_price.toLocaleString()}</span>
        </label>
        <input type="range" min={10000} max={120000} step={5000} value={filters.max_price}
          onChange={(e) => handleFilter("max_price", Number(e.target.value))}
          className="w-full accent-[#00f5ff]" />
      </div>

      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">
          Year: <span className="text-[#00f5ff]">{filters.min_year} – {filters.max_year}</span>
        </label>
        <input type="range" min={2010} max={2024} value={filters.min_year}
          onChange={(e) => handleFilter("min_year", Number(e.target.value))}
          className="w-full accent-[#ff2d9b]" />
        <input type="range" min={2010} max={2024} value={filters.max_year}
          onChange={(e) => handleFilter("max_year", Number(e.target.value))}
          className="w-full accent-[#ff2d9b] mt-1" />
      </div>

      <button onClick={resetFilters}
        className="w-full py-2 border border-[#ff2d9b]/40 text-[#ff2d9b] rounded-lg text-sm hover:bg-[#ff2d9b]/10 transition">
        Reset Filters
      </button>
    </div>
  );
}

export default function Cars() {
  const [cars, setCars]                     = useState([]);
  const [manufacturers, setManufacturers]   = useState(["All"]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [search, setSearch]                 = useState("");

  const [filters, setFilters] = useState({
    manufacturer: "All",
    engine_type: "All",
    body_type: "All",
    transmission: "All",
    min_year: 2010,
    max_year: 2024,
    max_price: 120000,
  });

  // ── Fetch manufacturers for the filter list ──────────────────────────────────
  const fetchManufacturers = () => {
    api.getManufacturers()
      .then((data) => setManufacturers(["All", ...data.map((m) => m.name)]))
      .catch((err) => console.error("Failed to load manufacturers:", err));
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  // Refetch manufacturers too when tab regains focus (so new/deleted manufacturers show up)
  useEffect(() => {
    window.addEventListener("focus", fetchManufacturers);
    return () => window.removeEventListener("focus", fetchManufacturers);
  }, []);

  // ── Fetch cars ────────────────────────────────────────────────────────────────
  const fetchCars = () => {
    setLoading(true);
    setError(null);
    api.getCars({ ...filters, search })
      .then(setCars)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(fetchCars, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, search]);

  useEffect(() => {
    window.addEventListener("focus", fetchCars);
    return () => window.removeEventListener("focus", fetchCars);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, search]);

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      manufacturer: "All", engine_type: "All", body_type: "All",
      transmission: "All", min_year: 2010, max_year: 2024, max_price: 120000,
    });
    setSearch("");
  };

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a2e]">
      <div className="bg-[#05051a] border-b border-[#ff2d9b]/20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2d9b] to-[#00f5ff] bg-clip-text text-transparent">
            Explore Cars
          </h1>
          <p className="text-gray-400 mt-1">
            {loading ? "Loading..." : `${cars.length} vehicles found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <button
          className="md:hidden fixed bottom-6 right-6 z-50 bg-[#ff2d9b] text-white px-5 py-3 rounded-full shadow-lg shadow-[#ff2d9b]/30 text-sm font-semibold"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "✕ Close" : "⚙ Filters"}
        </button>

        <aside className="hidden md:block w-64 shrink-0">
          <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-xl p-5 sticky top-24">
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Filters</h2>
            <FilterPanel search={search} setSearch={setSearch} filters={filters} handleFilter={handleFilter} resetFilters={resetFilters} manufacturers={manufacturers} />
          </div>
        </aside>

        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm">
            <div className="absolute right-0 top-0 h-full w-80 bg-[#0d0d3b] border-l border-[#00f5ff]/10 p-6 overflow-y-auto">
              <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Filters</h2>
              <FilterPanel search={search} setSearch={setSearch} filters={filters} handleFilter={handleFilter} resetFilters={resetFilters} manufacturers={manufacturers} />
            </div>
          </div>
        )}

        <div className="flex-1">
          {error && (
            <div className="text-center py-10 text-red-400 bg-red-500/5 border border-red-500/20 rounded-xl">
              <p className="text-2xl mb-2">⚠️</p>
              <p>Failed to load cars: {error}</p>
              <p className="text-gray-500 text-sm mt-2">Check that the backend server is running on port 5000.</p>
            </div>
          )}

          {loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-xl h-72 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && !error && cars.length === 0 && (
            <div className="text-center flex flex-col items-center text-gray-500 py-20">
              <img src={logo} alt="Logo" className="max-w-80 max-h-80 object-cover" />
              <p className="text-lg">No cars match your filters.</p>
              <button onClick={resetFilters} className="mt-4 text-[#00f5ff] hover:underline text-sm">
                Reset filters
              </button>
            </div>
          )}

          {!loading && !error && cars.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car.car_id} car={car} variant="default" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
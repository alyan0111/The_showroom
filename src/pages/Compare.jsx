import { useState, useEffect } from "react";
import { api } from "../api/client";
import CarCard from "../components/CarCard";

function CarSelector({ label, selected, onChange, exclude, cars }) {
  return (
    <div className="flex-1 min-w-[200px]">
      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">{label}</label>
      <select
        value={selected?.car_id || ""}
        onChange={(e) => {
          const car = cars.find((c) => c.car_id === Number(e.target.value));
          onChange(car || null);
        }}
        className="w-full bg-[#0d0d3b] border border-[#00f5ff]/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00f5ff] appearance-none cursor-pointer"
      >
        <option value="">— Select a car —</option>
        {cars.filter((c) => !exclude.includes(c.car_id)).map((c) => (
          <option key={c.car_id} value={c.car_id}>{c.model} ({c.year})</option>
        ))}
      </select>
    </div>
  );
}

export default function Compare() {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [carA, setCarA] = useState(null);
  const [carB, setCarB] = useState(null);
  const [carC, setCarC] = useState(null);
  const [showThird, setShowThird] = useState(false);

  // Detail cache — full spec data fetched per selected car
  const [details, setDetails] = useState({});

  useEffect(() => {
    api.getCars()
      .then((data) => {
        setAllCars(data);
        if (data.length >= 3) {
          setCarA(data[0]);
          setCarB(data[2]);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Fetch full detail (with specs) whenever a car is selected
  useEffect(() => {
    [carA, carB, carC].filter(Boolean).forEach((car) => {
      if (!details[car.car_id]) {
        api.getCar(car.car_id).then((full) => {
          setDetails((prev) => ({ ...prev, [car.car_id]: full }));
        }).catch(() => {});
      }
    });
  }, [carA, carB, carC, details]);

  const selected = [carA, carB, carC].filter(Boolean);
  const selectedFull = selected.map((c) => details[c.car_id] || c);

  const getBest = (key, lowerIsBetter = false) => {
    const vals = selectedFull.map((c) => parseFloat(c.specification?.[key])).filter((v) => !isNaN(v));
    if (vals.length === 0) return null;
    return lowerIsBetter ? Math.min(...vals) : Math.max(...vals);
  };

  const specRows = [
    { label: "Price", key: "price",        source: "root",  format: (v) => `$${Number(v).toLocaleString()}`, numeric: true, lowerBetter: true },
    { label: "Year",         key: "year",         source: "root",  format: (v) => v, numeric: true, lowerBetter: false },
    { label: "Engine",       key: "engine",        source: "spec",  format: (v) => v || "—", numeric: false },
    { label: "Horsepower",   key: "horsepower",    source: "spec",  format: (v) => v || "—", numeric: true, lowerBetter: false },
    { label: "Torque",       key: "torque",        source: "spec",  format: (v) => v || "—", numeric: true, lowerBetter: false },
    { label: "Transmission", key: "transmission", source: "root",  format: (v) => v, numeric: false },
    { label: "Drivetrain",   key: "drivetrain",    source: "spec",  format: (v) => v || "—", numeric: false },
    { label: "Fuel Economy", key: "fuel_economy",  source: "spec",  format: (v) => v || "—", numeric: false },
    { label: "0–60 mph",     key: "acceleration",  source: "spec",  format: (v) => v || "—", numeric: true, lowerBetter: true },
    { label: "Top Speed",    key: "top_speed",     source: "spec",  format: (v) => v || "—", numeric: true, lowerBetter: false },
    { label: "Seating",      key: "seating",        source: "spec",  format: (v) => v ? `${v} seats` : "—", numeric: true, lowerBetter: false },
    { label: "Curb Weight",  key: "weight",         source: "spec",  format: (v) => v || "—", numeric: false },
  ];

  const getValue = (car, row) =>
    row.source === "spec" ? car.specification?.[row.key] : car[row.key];

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-[#0a0a2e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ff2d9b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 min-h-screen bg-[#0a0a2e] text-center text-red-400">
        <p>Failed to load cars: {error}</p>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a2e]">
      <div className="bg-[#05051a] border-b border-[#ff2d9b]/20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2d9b] to-[#00f5ff] bg-clip-text text-transparent">
            Compare Cars
          </h1>
          <p className="text-gray-400 mt-1">Select up to 3 vehicles to compare side by side</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-6">
          <div className="flex flex-wrap gap-4 items-end">
            <CarSelector label="Car A" selected={carA} onChange={setCarA} cars={allCars}
              exclude={[carB?.car_id, carC?.car_id].filter(Boolean)} />
            <CarSelector label="Car B" selected={carB} onChange={setCarB} cars={allCars}
              exclude={[carA?.car_id, carC?.car_id].filter(Boolean)} />

            {showThird ? (
              <CarSelector label="Car C" selected={carC} onChange={setCarC} cars={allCars}
                exclude={[carA?.car_id, carB?.car_id].filter(Boolean)} />
            ) : (
              <button onClick={() => setShowThird(true)}
                className="flex-1 min-w-[200px] py-3 border-2 border-dashed border-[#7b2ff7]/40 text-[#7b2ff7] rounded-xl text-sm hover:border-[#7b2ff7] hover:bg-[#7b2ff7]/5 transition">
                + Add Third Car
              </button>
            )}

            {showThird && (
              <button onClick={() => { setShowThird(false); setCarC(null); }}
                className="px-4 py-3 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/10 transition">
                Remove C
              </button>
            )}
          </div>
        </div>

        {selectedFull.length >= 2 && (
          <>
            <div className={`grid gap-4 ${selectedFull.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
              {selectedFull.map((car) => (
                <CarCard key={car.car_id} car={car} variant="compare" />
              ))}
            </div>

            <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#00f5ff]">⚙</span> Specifications
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#0a0a2e]">
                      <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider w-36">Feature</th>
                      {selectedFull.map((car) => (
                        <th key={car.car_id} className="px-4 py-3 text-center text-xs text-gray-300 uppercase tracking-wider">
                          {car.model}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {specRows.map((row, i) => {
                      const bestVal = row.numeric ? getBest(row.key, row.lowerBetter) : null;
                      return (
                        <tr key={row.key} className={i % 2 === 0 ? "bg-[#0d0d3b]" : "bg-[#0a0a2e]"}>
                          <td className="px-4 py-3 text-sm text-gray-400 border-b border-white/5 font-medium">
                            {row.label}
                          </td>
                          {selectedFull.map((car) => {
                            const raw = row.source === "root" ? car[row.key] : car.specification?.[row.key];
                            const numVal = parseFloat(raw);
                            const isBest = row.numeric && numVal === bestVal;
                            return (
                              <td key={car.car_id}
                                className={`px-4 py-3 text-sm text-center border-b border-white/5 ${isBest ? "text-[#00f5ff] font-bold" : "text-gray-300"}`}>
                                {row.format(getValue(car, row))}
                                {isBest && (
                                  <span className="ml-1 text-[10px] text-[#00f5ff] bg-[#00f5ff]/10 px-1.5 py-0.5 rounded-full">BEST</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {selectedFull.length < 2 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-5xl mb-4">⚖️</p>
            <p className="text-lg">Select at least 2 cars to start comparing</p>
          </div>
        )}
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const typeColor = {
  Electric: { badge: "text-[#00f5ff] bg-[#00f5ff]/10 border border-[#00f5ff]/20", glow: "hover:border-[#00f5ff]/40" },
  Hybrid:   { badge: "text-[#7b2ff7] bg-[#7b2ff7]/10 border border-[#7b2ff7]/20", glow: "hover:border-[#7b2ff7]/40" },
  Diesel:   { badge: "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20", glow: "hover:border-yellow-400/40" },
  Petrol:   { badge: "text-[#ff2d9b] bg-[#ff2d9b]/10 border border-[#ff2d9b]/20", glow: "hover:border-[#ff2d9b]/40" },
};

const BACKEND_URL = "http://localhost:5000";

export default function CarCard({ car, variant = "default" }) {
  const engineType = car.engine_type || car.type;
  const name       = car.model || car.name;
  const colors     = typeColor[engineType] || typeColor.Petrol;
  const power      = car.specification?.horsepower || car.power || car.horsepower;

  // ── Resolve image URL ────────────────────────────────────────────────────────
  // car.image_url comes from the backend as a relative path like "/uploads/cars/xxx.jpg"
  // car.image / car.image_url as a full URL is also supported for legacy/mock data
  const rawImage = car.image_url || car.image;
  const image = rawImage
    ? (rawImage.startsWith("http") ? rawImage : `${BACKEND_URL}${rawImage}`)
    : null;

  if (variant === "featured") {
    return (
      <div className={`bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-xl overflow-hidden transition group ${colors.glow}`}>
        <div className="w-full h-44 overflow-hidden bg-[#1a1a4e]">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = logo;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-white font-bold text-lg">{name}</h3>
          <p className="text-gray-400 text-sm mt-1">{car.year} · {engineType} · {power}</p>
          <Link to={`/cars/${car.car_id || car.id}`} className="mt-4 inline-block text-sm text-[#00f5ff] hover:text-[#ff2d9b] transition">
            View Details →
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "compare") {
    return (
      <div className={`bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-5 text-center transition ${colors.glow}`}>
        <div className="w-full h-36 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a4e] to-[#05051a] mb-4">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = logo;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors.badge}`}>{engineType}</span>
        <h3 className="text-white font-bold text-base mt-2">{name}</h3>
        <p className="text-gray-400 text-sm">{car.year} · {car.body_type || car.body}</p>
        <p className="text-[#00f5ff] font-semibold mt-2">${Number(car.price).toLocaleString()}</p>
        <Link to={`/cars/${car.car_id || car.id}`} className="mt-3 inline-block text-xs text-[#ff2d9b] hover:underline">
          View Full Details →
        </Link>
      </div>
    );
  }

  return (
    <div className={`bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-xl overflow-hidden transition group ${colors.glow}`}>
      <div className="w-full h-44 overflow-hidden bg-gradient-to-br from-[#1a1a4e] to-[#0a0a2e] relative">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = logo;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
        )}
        <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm ${colors.badge}`}>
          {engineType}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-white font-bold text-lg leading-tight">{name}</h3>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-400 flex-wrap">
          <span>{car.year}</span>
          {(car.body_type || car.body) && <><span className="text-gray-600">·</span><span>{car.body_type || car.body}</span></>}
          {power && <><span className="text-gray-600">·</span><span>{power}</span></>}
        </div>
        {car.transmission && <p className="text-gray-500 text-xs mt-1">{car.transmission}</p>}
        <div className="flex items-center justify-between mt-4">
          {car.price && <span className="text-[#00f5ff] font-semibold text-base">${Number(car.price).toLocaleString()}</span>}
          <Link to={`/cars/${car.car_id || car.id}`}
            className="text-sm px-4 py-1.5 bg-[#ff2d9b]/10 border border-[#ff2d9b]/30 text-[#ff2d9b] rounded-lg hover:bg-[#ff2d9b] hover:text-white transition ml-auto">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
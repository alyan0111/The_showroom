import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { api } from "../api/client";

const typeColor = {
  Electric: "text-[#00f5ff] bg-[#00f5ff]/10 border-[#00f5ff]/30",
  Hybrid:   "text-[#7b2ff7] bg-[#7b2ff7]/10 border-[#7b2ff7]/30",
  Diesel:   "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Petrol:   "text-[#ff2d9b] bg-[#ff2d9b]/10 border-[#ff2d9b]/30",
};

const SpecRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/5">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className="text-white font-medium text-sm">{value || "—"}</span>
  </div>
);

function CarCarousel({ images }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#00f5ff]/10 shadow-[0_0_60px_#ff2d9b20] group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((src, i) => (
            <div key={i} className="relative min-w-full h-64 md:h-96 flex-shrink-0">
              <img src={src} alt={`View ${i + 1}`} className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a2e]/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 right-4 text-xs text-white/60 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                {i + 1} / {images.length}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={scrollPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 border border-[#ff2d9b]/40 text-white backdrop-blur-sm flex items-center justify-center hover:bg-[#ff2d9b] hover:border-[#ff2d9b] transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Previous image">‹</button>

      <button onClick={scrollNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 border border-[#ff2d9b]/40 text-white backdrop-blur-sm flex items-center justify-center hover:bg-[#ff2d9b] hover:border-[#ff2d9b] transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Next image">›</button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button key={i} onClick={() => emblaApi && emblaApi.scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === selected ? "w-5 h-2 bg-[#ff2d9b]" : "w-2 h-2 bg-white/30 hover:bg-white/60"
            }`} />
        ))}
      </div>
    </div>
  );
}

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    // eslint-disable-next-line
    setLoading(true);
    api.getCar(id)
      .then(setCar)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-[#0a0a2e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ff2d9b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="pt-20 min-h-screen bg-[#0a0a2e] flex flex-col items-center justify-center text-center px-4">
        <p className="text-6xl mb-4">🚗</p>
        <h2 className="text-2xl font-bold text-white mb-2">Car Not Found</h2>
        <p className="text-gray-400 mb-6">
          {error || "The car you're looking for doesn't exist in our database."}
        </p>
        <Link to="/cars" className="px-6 py-2 bg-[#ff2d9b] text-white rounded-lg hover:bg-[#e91e8c] transition">
          Back to Explore
        </Link>
      </div>
    );
  }

  const spec = car.specification || {};
  const images = car.image_url ? [car.image_url] : ["https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80"];

  const safetyFeatures     = car.features?.filter((f) => f.category === "Safety") || [];
  const comfortFeatures    = car.features?.filter((f) => f.category === "Comfort") || [];
  const technologyFeatures = car.features?.filter((f) => f.category === "Technology") || [];

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a2e]">
      <div className="relative bg-gradient-to-br from-[#0d0d3b] to-[#0a0a2e] border-b border-[#ff2d9b]/20">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <CarCarousel images={images} />

          <div>
            <span className={`text-xs px-3 py-1 rounded-full border font-medium ${typeColor[car.engine_type] || typeColor.Petrol}`}>
              {car.engine_type}
            </span>

            <h1 className="text-4xl font-bold text-white mt-3">{car.model}</h1>
            <p className="text-gray-400 mt-1 text-lg">
              {car.manufacturer_name} · {car.year} · {car.body_type}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl font-bold text-[#00f5ff]">
                ${Number(car.price).toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm">Starting MSRP</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { label: "Power", value: spec.horsepower },
                { label: "0–60 mph", value: spec.acceleration },
                { label: "Top Speed", value: spec.top_speed },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#0a0a2e] border border-[#00f5ff]/10 rounded-xl p-3 text-center">
                  <p className="text-[#00f5ff] font-bold text-sm">{stat.value || "—"}</p>
                  <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-[#ff2d9b]">⚙</span> Specifications
            </h2>
            <SpecRow label="Engine" value={spec.engine} />
            <SpecRow label="Horsepower" value={spec.horsepower} />
            <SpecRow label="Torque" value={spec.torque} />
            <SpecRow label="Transmission" value={car.transmission} />
            <SpecRow label="Drivetrain" value={spec.drivetrain} />
            <SpecRow label="Fuel Economy" value={spec.fuel_economy} />
            <SpecRow label="Acceleration" value={spec.acceleration} />
            <SpecRow label="Top Speed" value={spec.top_speed} />
            <SpecRow label="Seating" value={spec.seating ? `${spec.seating} passengers` : null} />
            <SpecRow label="Curb Weight" value={spec.weight} />
          </div>

          <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-[#00f5ff]">✦</span> Features
            </h2>
            {car.features?.length === 0 ? (
              <p className="text-gray-500 text-sm">No features listed for this vehicle yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "🛡 Safety", items: safetyFeatures },
                  { label: "🪑 Comfort", items: comfortFeatures },
                  { label: "📱 Technology", items: technologyFeatures },
                ].map((group) => (
                  <div key={group.label}>
                    <p className="text-sm font-semibold text-gray-300 mb-3">{group.label}</p>
                    {group.items.length === 0 ? (
                      <p className="text-gray-600 text-xs">None listed</p>
                    ) : (
                      <ul className="space-y-2">
                        {group.items.map((f) => (
                          <li key={f.feature_id} className="flex items-start gap-2 text-sm text-gray-400">
                            <span className="text-[#ff2d9b] mt-0.5">✔</span>
                            {f.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0d0d3b] border border-[#ff2d9b]/20 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white mb-2">Actions</h2>
            <Link to="/compare"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#ff2d9b] text-white font-semibold rounded-xl hover:bg-[#e91e8c] transition shadow-[0_0_20px_#ff2d9b40]">
              ⚖ Add to Compare
            </Link>
            <button onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 w-full py-3 border border-[#00f5ff]/30 text-[#00f5ff] font-semibold rounded-xl hover:bg-[#00f5ff]/10 transition">
              ← Back to Explore
            </button>
          </div>

          <div className="bg-gradient-to-br from-[#ff2d9b]/10 to-[#00f5ff]/10 border border-[#ff2d9b]/20 rounded-2xl p-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Quick Summary</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>🚗 <strong className="text-white">{car.body_type}</strong> body style</li>
              <li>⛽ <strong className="text-white">{car.engine_type}</strong> powertrain</li>
              <li>🔄 <strong className="text-white">{car.transmission}</strong> gearbox</li>
              <li>🧲 <strong className="text-white">{spec.drivetrain || "—"}</strong> drivetrain</li>
              <li>🪑 <strong className="text-white">{spec.seating || "—"} seats</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
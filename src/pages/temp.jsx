import { Link } from "react-router-dom";
import Hyperspeed from "../components/background";
import CarCard from "../components/CarCard";

const featuredCars = [
  { id: 1, name: "Toyota GR Supra", year: 2023, power: "382 hp", type: "Petrol" },
  { id: 2, name: "Tesla Model S", year: 2024, power: "670 hp", type: "Electric" },
  { id: 3, name: "BMW M4", year: 2023, power: "503 hp", type: "Petrol" },
];

const stats = [
  { label: "Cars Listed", value: "200+" },
  { label: "Manufacturers", value: "30+" },
  { label: "Electric Models", value: "40+" },
];

const reasons = [
  { icon: "🚗", title: "2010–Present Models", desc: "Only the latest generation vehicles." },
  { icon: "📊", title: "Accurate Specs", desc: "Real data from verified sources." },
  { icon: "⚡", title: "Compare Vehicles", desc: "Side-by-side performance comparison." },
];

export default function Home() {
  return (
    <div className="pt-0">
      {/* Hero */}
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Hyperspeed
            effectOptions={{
              onSpeedUp: () => {},
              onSlowDown: () => {},
              distortion: "turbulentDistortion",
              length: 400,
              roadWidth: 10,
              islandWidth: 2,
              lanesPerRoad: 4,
              fov: 90,
              fovSpeedUp: 150,
              speedUp: 2,
              carLightsFade: 0.4,
              totalSideLightSticks: 20,
              lightPairsPerRoadWay: 40,
              shoulderLinesWidthPercentage: 0.05,
              brokenLinesWidthPercentage: 0.1,
              brokenLinesLengthPercentage: 0.5,
              lightStickWidth: [0.12, 0.5],
              lightStickHeight: [1.3, 1.7],
              movingAwaySpeed: [60, 80],
              movingCloserSpeed: [-120, -160],
              carLightsLength: [12, 80],
              carLightsRadius: [0.05, 0.14],
              carWidthPercentage: [0.3, 0.5],
              carShiftX: [-0.8, 0.8],
              carFloorSeparation: [0, 5],
              colors: {
                roadColor: 0x0a0a2e,
                islandColor: 0x0d0d3b,
                background: 0x0a0a2e,
                shoulderLines: 0x7b2ff7,
                brokenLines: 0x7b2ff7,
                leftCars: [0xff2d9b, 0xe91e8c, 0xff06b7],
                rightCars: [0x00f5ff, 0x00bcd4, 0x0ef6ff],
                sticks: 0xff2d9b,
              },
            }}
          />
        </div>

        <div className="absolute z-10 text-white text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#ff2d9b] to-[#00f5ff] bg-clip-text text-transparent">
            Welcome to The Showroom
          </h1>
          <p className="text-lg mb-8 text-gray-300">
            Discover the future of cars. Explore, compare, and find your perfect
            vehicle from 2010 to present.
          </p>
          <Link
            to="/cars"
            className="px-8 py-3 bg-[#ff2d9b] text-white font-semibold rounded-lg hover:bg-[#e91e8c] transition shadow-[0_0_20px_#ff2d9b]"
          >
            Explore Now
          </Link>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-[#05051a] border-y border-[#ff2d9b]/20 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-[#ff2d9b]/20 text-center">
          {stats.map((s) => (
            <div key={s.label} className="py-2">
              <p className="text-3xl font-bold text-[#00f5ff]">{s.value}</p>
              <p className="text-gray-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Cars */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-2 text-center">
          <span className="bg-gradient-to-r from-[#ff2d9b] to-[#00f5ff] bg-clip-text text-transparent">
            Featured Cars
          </span>
        </h2>
        <p className="text-center text-gray-400 mb-10">
          Hand-picked highlights from our collection
        </p>
        {/* Car cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {featuredCars.map((car) => (
    <CarCard key={car.id} car={car} variant="featured" />
  ))}
</div>
      </section>

      {/* Why The Showroom */}
      <section className="bg-[#05051a] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-[#ff2d9b] to-[#00f5ff] bg-clip-text text-transparent">
              Why The Showroom?
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="text-center p-6 border border-[#7b2ff7]/30 rounded-xl hover:border-[#ff2d9b]/50 transition"
              >
                <div className="text-4xl mb-4">{r.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {r.title}
                </h3>
                <p className="text-gray-400 text-sm">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
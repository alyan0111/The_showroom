import { Link } from "react-router-dom";

const technologies = [
  { name: "React",         icon: "⚛️",  desc: "Frontend UI library for building component-based interfaces." },
  { name: "Redux",         icon: "🔄",  desc: "Global state management for filters, comparisons, and cart." },
  { name: "Tailwind CSS",  icon: "🎨",  desc: "Utility-first CSS framework for rapid, consistent styling." },
  { name: "React Router",  icon: "🧭",  desc: "Client-side routing for seamless SPA navigation." },
  { name: "SQL Database",  icon: "🗄️",  desc: "Relational database storing cars, specs, features, and manufacturers." },
  { name: "Three.js",      icon: "🌐",  desc: "WebGL-powered 3D animation for the Hyperspeed hero background." },
];

const timeline = [
  { year: "2010", label: "Coverage Starts",    desc: "The Showroom catalogs every major vehicle released from 2010 onward." },
  { year: "2015", label: "EV Expansion",       desc: "Electric and hybrid vehicles added as adoption accelerated globally." },
  { year: "2020", label: "Performance Era",    desc: "High-performance and limited-edition models given dedicated profiles." },
  { year: "2023", label: "Platform Launch",    desc: "The Showroom goes live with 200+ vehicles across 30+ manufacturers." },
  { year: "2024", label: "Compare Feature",    desc: "Side-by-side comparison tool launched with smart BEST-value detection." },
];

const teamStats = [
  { value: "200+", label: "Cars Listed"       },
  { value: "30+",  label: "Manufacturers"     },
  { value: "40+",  label: "Electric Models"   },
  { value: "7",    label: "Pages Built"       },
];

const erEntities = [
  {
    name: "Manufacturer",
    color: "#ff2d9b",
    fields: ["manufacturer_id (PK)", "name", "country", "founded_year"],
  },
  {
    name: "Car",
    color: "#00f5ff",
    fields: ["car_id (PK)", "manufacturer_id (FK)", "model", "year", "price", "body_type"],
  },
  {
    name: "Specification",
    color: "#7b2ff7",
    fields: ["spec_id (PK)", "car_id (FK)", "engine", "horsepower", "torque", "drivetrain", "fuel_economy"],
  },
  {
    name: "Feature",
    color: "#ff2d9b",
    fields: ["feature_id (PK)", "name", "category"],
  },
  {
    name: "Car_Feature",
    color: "#00f5ff",
    fields: ["car_id (FK)", "feature_id (FK)"],
  },
];

// ── Section Heading ───────────────────────────────────────────────────────────
function SectionHeading({ title, subtitle }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff2d9b] to-[#00f5ff]
                     bg-clip-text text-transparent">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 mt-2 text-sm max-w-xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}

export default function About() {
  return (
    <div className="pt-20 min-h-screen bg-[#0a0a2e]">

      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <div className="relative bg-[#05051a] border-b border-[#ff2d9b]/20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                          bg-[#ff2d9b]/5 rounded-full blur-3xl" />
          <div className="absolute top-[-40px] left-1/4 w-[300px] h-[300px]
                          bg-[#00f5ff]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <span className="inline-block text-xs uppercase tracking-widest text-[#ff2d9b]
                           border border-[#ff2d9b]/30 px-4 py-1 rounded-full mb-6">
            About The Project
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Built for Car Enthusiasts.<br />
            <span className="bg-gradient-to-r from-[#ff2d9b] to-[#00f5ff]
                             bg-clip-text text-transparent">
              Powered by Data.
            </span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            The Showroom is a modern, data-driven vehicle showcase platform built as an
            academic project. It combines a relational database backend with a futuristic
            React frontend to deliver a premium car browsing and comparison experience.
          </p>
        </div>
      </div>

      {/* ── Stats Strip ──────────────────────────────────────────────────────── */}
      <div className="bg-[#05051a] border-b border-[#ff2d9b]/10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4
                        divide-x divide-y md:divide-y-0 divide-[#ff2d9b]/10 text-center">
          {teamStats.map((s) => (
            <div key={s.label} className="py-8 px-4">
              <p className="text-3xl font-bold text-[#00f5ff]">{s.value}</p>
              <p className="text-gray-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">

        {/* ── Mission ──────────────────────────────────────────────────────────── */}
        <section>
          <SectionHeading
            title="Our Mission"
            subtitle="What The Showroom was built to achieve"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🚗",
                title: "Comprehensive Catalog",
                desc: "Every major vehicle from 2010 to present, with accurate specifications sourced from manufacturer data.",
                color: "#ff2d9b",
              },
              {
                icon: "⚡",
                title: "Instant Comparison",
                desc: "Compare up to 3 vehicles side by side with smart highlighting of the best values across every spec.",
                color: "#00f5ff",
              },
              {
                icon: "📊",
                title: "Data Transparency",
                desc: "All specs, features, and pricing pulled directly from a normalized relational database — no guesswork.",
                color: "#7b2ff7",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-6
                           hover:border-[#ff2d9b]/30 transition group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center
                              text-2xl mb-4 border"
                  style={{
                    backgroundColor: `${card.color}15`,
                    borderColor: `${card.color}30`,
                  }}
                >
                  {card.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Timeline ─────────────────────────────────────────────────────────── */}
        <section>
          <SectionHeading
            title="Timeline"
            subtitle="The history of what The Showroom covers"
          />
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px
                            bg-gradient-to-b from-[#ff2d9b] via-[#7b2ff7] to-[#00f5ff]
                            -translate-x-1/2" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex items-start gap-6
                    ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}
                    flex-row`}
                >
                  {/* Content */}
                  <div className="flex-1 md:text-right pl-16 md:pl-0 md:pr-10
                                  text-left">
                    {i % 2 !== 0 && <div className="hidden md:block" />}
                    <div
                      className={`bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-xl p-5
                                  hover:border-[#ff2d9b]/30 transition
                                  ${i % 2 !== 0 ? "md:ml-10" : "md:mr-10"}`}
                    >
                      <span className="text-xs font-bold tracking-widest text-[#ff2d9b]">
                        {item.year}
                      </span>
                      <h3 className="text-white font-semibold mt-1">{item.label}</h3>
                      <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2
                                  w-4 h-4 rounded-full bg-[#ff2d9b]
                                  border-4 border-[#0a0a2e] shadow-[0_0_12px_#ff2d9b]
                                  mt-5 shrink-0" />

                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Technologies ─────────────────────────────────────────────────────── */}
        <section>
          <SectionHeading
            title="Technologies Used"
            subtitle="The stack powering The Showroom from database to UI"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {technologies.map((tech) => (
              <div
                key={tech.name}
                className="flex items-start gap-4 bg-[#0d0d3b] border border-[#00f5ff]/10
                           rounded-xl p-5 hover:border-[#ff2d9b]/30 transition"
              >
                <span className="text-3xl shrink-0">{tech.icon}</span>
                <div>
                  <h3 className="text-white font-semibold">{tech.name}</h3>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ER Diagram ───────────────────────────────────────────────────────── */}
        <section>
          <SectionHeading
            title="Database Schema"
            subtitle="Entity-Relationship overview of The Showroom's data model"
          />

          {/* ER Diagram Visual */}
          <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-8 overflow-x-auto">
            <div className="flex flex-wrap justify-center gap-6 min-w-[600px]">
              {erEntities.map((entity) => (
                <div
                  key={entity.name}
                  className="rounded-xl border overflow-hidden min-w-[160px]"
                  style={{ borderColor: `${entity.color}40` }}
                >
                  {/* Entity Header */}
                  <div
                    className="px-4 py-2 text-sm font-bold text-center"
                    style={{
                      backgroundColor: `${entity.color}20`,
                      color: entity.color,
                    }}
                  >
                    {entity.name}
                  </div>
                  {/* Fields */}
                  <div className="divide-y divide-white/5">
                    {entity.fields.map((field) => (
                      <div
                        key={field}
                        className="px-4 py-2 text-xs text-gray-400 font-mono
                                   hover:bg-white/5 transition"
                      >
                        {field.includes("PK") ? (
                          <span>
                            <span style={{ color: entity.color }}>🔑 </span>
                            {field}
                          </span>
                        ) : field.includes("FK") ? (
                          <span>
                            <span className="text-[#7b2ff7]">🔗 </span>
                            {field}
                          </span>
                        ) : (
                          field
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Relationships Legend */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-[#ff2d9b]">🔑</span> Primary Key
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#7b2ff7]">🔗</span> Foreign Key
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#00f5ff]">──</span> One-to-Many
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#ff2d9b]">⇌</span> Many-to-Many (via Car_Feature)
              </div>
            </div>
          </div>

          {/* Relationship descriptions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { rel: "Manufacturer → Car",        type: "One-to-Many",  desc: "One manufacturer produces many car models."              },
              { rel: "Car → Specification",        type: "One-to-One",   desc: "Each car has exactly one specification record."          },
              { rel: "Car ↔ Feature",              type: "Many-to-Many", desc: "Cars have many features; features belong to many cars." },
              { rel: "Feature → Category",         type: "Grouped by",   desc: "Features grouped as Safety, Comfort, or Technology."    },
            ].map((r) => (
              <div
                key={r.rel}
                className="bg-[#0a0a2e] border border-[#00f5ff]/10 rounded-xl p-4
                           flex items-start gap-4"
              >
                <span className="text-[#ff2d9b] text-lg mt-0.5">⇌</span>
                <div>
                  <p className="text-white text-sm font-semibold">{r.rel}</p>
                  <span className="text-[10px] text-[#00f5ff] bg-[#00f5ff]/10
                                   px-2 py-0.5 rounded-full">
                    {r.type}
                  </span>
                  <p className="text-gray-400 text-xs mt-1">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────────── */}
        <section>
          <div className="bg-gradient-to-r from-[#ff2d9b]/10 to-[#00f5ff]/10
                          border border-[#ff2d9b]/20 rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to explore the collection?
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Browse 200+ vehicles, filter by your preferences, and compare the ones
              that catch your eye.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/cars"
                className="px-8 py-3 bg-[#ff2d9b] text-white font-semibold rounded-xl
                           hover:bg-[#e91e8c] transition shadow-[0_0_20px_#ff2d9b40]"
              >
                Explore Cars
              </Link>
              <Link
                to="/compare"
                className="px-8 py-3 border border-[#00f5ff]/30 text-[#00f5ff]
                           font-semibold rounded-xl hover:bg-[#00f5ff]/10 transition"
              >
                Compare Now
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
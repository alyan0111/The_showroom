import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/client";

const technologies = [
  { name: "React",         icon: "⚛️",  desc: "Frontend UI library powering all 7+ pages of the platform." },
  { name: "React Router",  icon: "🧭",  desc: "Client-side routing for seamless SPA navigation." },
  { name: "Tailwind CSS",  icon: "🎨",  desc: "Utility-first CSS framework for the dark neon design system." },
  { name: "Three.js",      icon: "🌐",  desc: "WebGL-powered 3D animation for the Hyperspeed hero background." },
  { name: "Express.js",    icon: "🚀",  desc: "REST API backend serving all car, manufacturer, and feature data." },
  { name: "MySQL",         icon: "🗄️",  desc: "Normalized relational database with 8 tables and full FK constraints." },
  { name: "JWT + bcrypt",  icon: "🔐",  desc: "Token-based admin authentication with hashed passwords." },
  { name: "Multer",        icon: "📸",  desc: "Handles main image and carousel gallery uploads for every car." },
  { name: "Embla Carousel",icon: "🎠",  desc: "Touch-friendly image carousel on the Car Details page." },
];

const timeline = [
  { year: "Phase 1", label: "UI & Hyperspeed Background",  desc: "React + Tailwind scaffold with a Three.js WebGL animated hero section." },
  { year: "Phase 2", label: "Core Pages Built",             desc: "Home, Explore, Car Details, Compare, About, and Contact fully designed." },
  { year: "Phase 3", label: "MySQL Database Design",        desc: "Normalized 8-table schema built and reverse-engineered in MySQL Workbench." },
  { year: "Phase 4", label: "REST API + Live Data",         desc: "Express backend wired to every page, replacing all hardcoded mock data." },
  { year: "Phase 5", label: "Image Uploads",                desc: "Multer integration for main card images and full carousel galleries." },
  { year: "Phase 6", label: "Admin Authentication",         desc: "JWT + bcrypt secured Admin Panel with full CRUD for every entity." },
  { year: "Phase 7", label: "Live Query Monitor",           desc: "Real-time floating panel showing every SQL query hitting the database." },
];

// ── Real ER Schema — matches the actual MySQL database ─────────────────────────
const erEntities = [
  {
    name: "manufacturers",
    color: "#ff2d9b",
    fields: ["manufacturer_id (PK)", "name", "country", "founded_year"],
  },
  {
    name: "cars",
    color: "#00f5ff",
    fields: ["car_id (PK)", "manufacturer_id (FK)", "model", "year", "price", "body_type", "engine_type", "transmission", "image_url"],
  },
  {
    name: "specifications",
    color: "#7b2ff7",
    fields: ["spec_id (PK)", "car_id (FK)", "engine", "horsepower", "torque", "drivetrain", "fuel_economy", "acceleration", "top_speed", "seating", "weight"],
  },
  {
    name: "car_images",
    color: "#00f5ff",
    fields: ["image_id (PK)", "car_id (FK)", "image_url", "is_primary", "sort_order"],
  },
  {
    name: "features",
    color: "#ff2d9b",
    fields: ["feature_id (PK)", "name", "category"],
  },
  {
    name: "car_features",
    color: "#7b2ff7",
    fields: ["car_id (FK)", "feature_id (FK)"],
  },
  {
    name: "messages",
    color: "#00f5ff",
    fields: ["message_id (PK)", "name", "email", "subject", "message", "is_read"],
  },
  {
    name: "admins",
    color: "#ff2d9b",
    fields: ["admin_id (PK)", "email", "password_hash", "name"],
  },
];

const relationships = [
  { rel: "Manufacturer → Car",        type: "One-to-Many",  desc: "One manufacturer produces many car models." },
  { rel: "Car → Specification",       type: "One-to-Many",  desc: "Each car links to its own specification record." },
  { rel: "Car → Car_Images",          type: "One-to-Many",  desc: "Each car has a main image plus a full carousel gallery." },
  { rel: "Car ↔ Feature",             type: "Many-to-Many", desc: "Resolved via car_features — cars have many features; features belong to many cars." },
  { rel: "Feature → Category",        type: "Grouped by",   desc: "Features grouped as Safety, Comfort, or Technology." },
  { rel: "Admin → Cars / Features",   type: "Manages",      desc: "Authenticated admins perform full CRUD across every entity." },
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
  // ── Live stats pulled from the real API — no more hardcoded placeholders ──
  const [stats, setStats] = useState({ cars: 0, manufacturers: 0, features: 0, electric: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([api.getManufacturers(), api.getCars(), api.getFeatures()])
      .then(([manufacturers, cars, features]) => {
        if (cancelled) return;
        setStats({
          cars: cars.length,
          manufacturers: manufacturers.length,
          features: features.length,
          electric: cars.filter((c) => c.engine_type === "Electric").length,
        });
      })
      .catch(() => {})
      .finally(() => {
        if (cancelled) return;
        setStatsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const teamStats = [
    { value: statsLoading ? "—" : stats.cars,          label: "Cars Listed"    },
    { value: statsLoading ? "—" : stats.manufacturers, label: "Manufacturers"  },
    { value: statsLoading ? "—" : stats.electric,      label: "Electric Models"},
    { value: "8",                                      label: "Database Tables"},
  ];

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a2e]">

      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <div className="relative bg-[#05051a] border-b border-[#ff2d9b]/20 overflow-hidden">
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
              Powered by a Real Database.
            </span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            The Showroom is a full-stack vehicle showcase platform built as an academic
            Complex Engineering Problem. It combines a normalized MySQL database, a
            secured Express REST API, and a futuristic React frontend to deliver a
            complete car browsing, comparison, and admin management experience.
          </p>
        </div>
      </div>

      {/* ── Stats Strip — LIVE from the database ────────────────────────────── */}
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
        <p className="text-center text-gray-600 text-xs pb-4">
          Live figures pulled directly from the MySQL database via the REST API
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">

        {/* ── Mission ──────────────────────────────────────────────────────────── */}
        <section>
          <SectionHeading
            title="Our Mission"
            subtitle="What The Showroom was built to achieve"
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: "🚗",
                title: "Comprehensive Catalog",
                desc: "Every vehicle sourced from a normalized relational database, with accurate specs and full image galleries.",
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
                desc: "All specs, features, and pricing pulled live from MySQL — no guesswork, no static mock data.",
                color: "#7b2ff7",
              },
              {
                icon: "🔐",
                title: "Secured Admin Access",
                desc: "JWT-authenticated Admin Panel with full CRUD, image uploads, and a live SQL query monitor.",
                color: "#ff2d9b",
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
            title="Development Timeline"
            subtitle="How The Showroom was built, phase by phase"
          />
          <div className="relative">
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
            title="Full Stack Used"
            subtitle="Every layer of The Showroom, from database to UI"
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
            subtitle="All 8 tables in The Showroom's normalized MySQL database"
          />

          {/* ER Diagram Visual */}
          <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-8 overflow-x-auto">
            <div className="flex flex-wrap justify-center gap-6 min-w-[900px]">
              {erEntities.map((entity) => (
                <div
                  key={entity.name}
                  className="rounded-xl border overflow-hidden min-w-[170px]"
                  style={{ borderColor: `${entity.color}40` }}
                >
                  <div
                    className="px-4 py-2 text-sm font-bold text-center font-mono"
                    style={{
                      backgroundColor: `${entity.color}20`,
                      color: entity.color,
                    }}
                  >
                    {entity.name}
                  </div>
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
                <span className="text-[#ff2d9b]">⇌</span> Many-to-Many (via car_features)
              </div>
            </div>
          </div>

          {/* Relationship descriptions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {relationships.map((r) => (
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

          <p className="text-center text-gray-500 text-xs mt-6">
            A formal Chen-notation version of this schema — with entity rectangles,
            relationship diamonds, and attribute ellipses — is available in the
            project documentation.
          </p>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────────── */}
        <section>
          <div className="bg-gradient-to-r from-[#ff2d9b]/10 to-[#00f5ff]/10
                          border border-[#ff2d9b]/20 rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to explore the collection?
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Browse the catalog, filter by your preferences, and compare the ones
              that catch your eye — all powered by a real, live database.
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
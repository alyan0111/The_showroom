import { useState, useEffect } from "react";
import { api } from "../api/client";

const typeColor = {
  Electric: "text-[#00f5ff] bg-[#00f5ff]/10",
  Hybrid:   "text-[#7b2ff7] bg-[#7b2ff7]/10",
  Diesel:   "text-yellow-400 bg-yellow-400/10",
  Petrol:   "text-[#ff2d9b] bg-[#ff2d9b]/10",
};
const categoryColor = {
  Safety:     "text-[#00f5ff] bg-[#00f5ff]/10",
  Comfort:    "text-[#7b2ff7] bg-[#7b2ff7]/10",
  Technology: "text-[#ff2d9b] bg-[#ff2d9b]/10",
};
const menuItems = [
  { id: "dashboard",     icon: "📊", label: "Dashboard" },
  { id: "manufacturers", icon: "🏭", label: "Manufacturers" },
  { id: "cars",          icon: "🚗", label: "Cars" },
  { id: "features",      icon: "✦",  label: "Features" },
  { id: "messages",      icon: "✉",  label: "Messages" },
];

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
function Input(props) {
  return (
    <input {...props}
      className="w-full bg-[#0a0a2e] border border-[#00f5ff]/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#00f5ff] transition" />
  );
}
function Select({ children, ...props }) {
  return (
    <select {...props}
      className="w-full bg-[#0a0a2e] border border-[#00f5ff]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00f5ff] transition appearance-none cursor-pointer">
      {children}
    </select>
  );
}
function ModalWrapper({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8 overflow-y-auto">
      <div className="bg-[#0d0d3b] border border-[#00f5ff]/20 rounded-2xl w-full max-w-2xl shadow-2xl my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-[#0d0d3b] rounded-t-2xl z-10">
          <h3 className="text-white font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition text-xl leading-none">✕</button>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
function DeleteConfirm({ name, onConfirm, onCancel }) {
  return (
    <ModalWrapper title="Confirm Delete" onClose={onCancel}>
      <p className="text-gray-300 text-sm">
        Are you sure you want to delete <span className="text-[#ff2d9b] font-semibold">"{name}"</span>? This action cannot be undone.
      </p>
      <div className="flex gap-3 pt-2">
        <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition">Delete</button>
        <button onClick={onCancel} className="flex-1 py-2.5 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/5 transition">Cancel</button>
      </div>
    </ModalWrapper>
  );
}
function Toast({ message, type }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-xl border backdrop-blur-sm
      ${type === "success" ? "bg-[#00f5ff]/10 border-[#00f5ff]/30 text-[#00f5ff]" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
      {type === "success" ? "✔ " : "✕ "}{message}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ manufacturers, cars, features }) {
  const stats = [
    { label: "Manufacturers", value: manufacturers.length, icon: "🏭" },
    { label: "Cars",          value: cars.length,          icon: "🚗" },
    { label: "Features",      value: features.length,      icon: "✦" },
    { label: "Electric Cars", value: cars.filter((c) => c.engine_type === "Electric").length, icon: "⚡" },
  ];
  const byType = ["Petrol", "Diesel", "Hybrid", "Electric"].map((t) => ({
    type: t, count: cars.filter((c) => c.engine_type === t).length,
  }));
  const maxCount = Math.max(...byType.map((b) => b.count), 1);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs px-2 py-0.5 rounded-full text-[#00f5ff] bg-[#00f5ff]/10">TOTAL</span>
            </div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-gray-400 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-6">Cars by Engine Type</h3>
        <div className="space-y-4">
          {byType.map((b) => (
            <div key={b.type} className="flex items-center gap-4">
              <span className="text-gray-400 text-sm w-20">{b.type}</span>
              <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(b.count / maxCount) * 100}%`,
                    backgroundColor: b.type === "Electric" ? "#00f5ff" : b.type === "Hybrid" ? "#7b2ff7" : b.type === "Diesel" ? "#facc15" : "#ff2d9b" }} />
              </div>
              <span className="text-white text-sm font-semibold w-6 text-right">{b.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">Recent Cars</h3>
        <div className="space-y-2">
          {cars.slice(-5).reverse().map((car) => (
            <div key={car.car_id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/5 transition">
              <div className="flex items-center gap-3">
                <span className="text-xl">🚗</span>
                <div>
                  <p className="text-white text-sm font-medium">{car.model}</p>
                  <p className="text-gray-500 text-xs">{car.manufacturer_name} · {car.year}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColor[car.engine_type]}`}>{car.engine_type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Manufacturers Panel ───────────────────────────────────────────────────────
function Manufacturers({ data, refresh, showToast }) {
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: "", country: "", founded_year: "" });
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setForm({ name: "", country: "", founded_year: "" }); setEditing(null); setModal("form"); };
  const openEdit = (m) => { setForm({ name: m.name, country: m.country, founded_year: m.founded_year }); setEditing(m.manufacturer_id); setModal("form"); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.country.trim() || !form.founded_year) return;
    setSaving(true);
    try {
      if (editing) {
        await api.updateManufacturer(editing, { ...form, founded_year: Number(form.founded_year) });
        showToast("Manufacturer updated!", "success");
      } else {
        await api.createManufacturer({ ...form, founded_year: Number(form.founded_year) });
        showToast("Manufacturer added!", "success");
      }
      setModal(null);
      refresh();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteManufacturer(deleteTarget.manufacturer_id);
      showToast("Manufacturer deleted.", "success");
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const filtered = data.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search manufacturers..."
          className="bg-[#0a0a2e] border border-[#00f5ff]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00f5ff] transition w-64" />
        <button onClick={openAdd} className="px-5 py-2.5 bg-[#ff2d9b] text-white text-sm font-semibold rounded-xl hover:bg-[#e91e8c] transition shadow-[0_0_15px_#ff2d9b40]">
          + Add Manufacturer
        </button>
      </div>

      <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0a0a2e] text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Country</th>
              <th className="px-5 py-3 text-left">Founded</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.manufacturer_id} className={`border-t border-white/5 hover:bg-white/5 transition ${i % 2 === 0 ? "bg-[#0d0d3b]" : "bg-[#0a0a2e]"}`}>
                <td className="px-5 py-3 text-white text-sm font-medium">{m.name}</td>
                <td className="px-5 py-3 text-gray-400 text-sm">{m.country}</td>
                <td className="px-5 py-3 text-gray-400 text-sm">{m.founded_year}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openEdit(m)} className="px-3 py-1 text-xs border border-[#00f5ff]/30 text-[#00f5ff] rounded-lg hover:bg-[#00f5ff]/10 transition">Edit</button>
                    <button onClick={() => setDeleteTarget(m)} className="px-3 py-1 text-xs border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-500 text-sm">No manufacturers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal === "form" && (
        <ModalWrapper title={editing ? "Edit Manufacturer" : "Add Manufacturer"} onClose={() => setModal(null)}>
          <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Toyota" /></Field>
          <Field label="Country"><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g. Japan" /></Field>
          <Field label="Founded Year"><Input type="number" value={form.founded_year} onChange={(e) => setForm({ ...form, founded_year: e.target.value })} placeholder="e.g. 1937" /></Field>
          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-[#ff2d9b] text-white rounded-xl text-sm font-semibold hover:bg-[#e91e8c] transition disabled:opacity-60">
              {saving ? "Saving..." : editing ? "Save Changes" : "Add Manufacturer"}
            </button>
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/5 transition">Cancel</button>
          </div>
        </ModalWrapper>
      )}

      {deleteTarget && <DeleteConfirm name={deleteTarget.name} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}

// ── Cars Panel ────────────────────────────────────────────────────────────────
// ── Cars Panel ────────────────────────────────────────────────────────────────
function Cars({ data, manufacturers, refresh, showToast }) {
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const [allFeatures, setAllFeatures] = useState([]);
  const [featuresLoading, setFeaturesLoading] = useState(false);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState([]);
  const [originalFeatureIds, setOriginalFeatureIds] = useState([]);

  const emptySpec = {
    engine: "", horsepower: "", torque: "", drivetrain: "",
    fuel_economy: "", acceleration: "", top_speed: "", seating: "", weight: "",
  };

  const [form, setForm] = useState({
    manufacturer_id: "", model: "", year: "", type: "Petrol", price: "", body_type: "Sedan", transmission: "Automatic",
  });
  const [spec, setSpec] = useState(emptySpec);

  // ── Image state ──────────────────────────────────────────────────────────────
  const [mainImageFile, setMainImageFile] = useState(null);   // File object staged for upload
  const [mainImagePreview, setMainImagePreview] = useState(null); // preview URL (blob or server URL)
  const [mainImageUploading, setMainImageUploading] = useState(false);

  const [carouselFiles, setCarouselFiles] = useState([]);      // File[] staged for upload
  const [carouselPreviews, setCarouselPreviews] = useState([]); // { url, isNew, imageId? }[]
  const [carouselUploading, setCarouselUploading] = useState(false);

  const loadFeatures = async () => {
    setFeaturesLoading(true);
    try {
      const featuresList = await api.getFeatures();
      setAllFeatures(featuresList);
    } catch {
      showToast("Failed to load features list.", "error");
    } finally {
      setFeaturesLoading(false);
    }
  };

  const resetImageState = () => {
    setMainImageFile(null);
    setMainImagePreview(null);
    setCarouselFiles([]);
    setCarouselPreviews([]);
  };

  const openAdd = async () => {
    setForm({ manufacturer_id: manufacturers[0]?.manufacturer_id || "", model: "", year: "", type: "Petrol", price: "", body_type: "Sedan", transmission: "Automatic" });
    setSpec(emptySpec);
    setEditing(null);
    setSelectedFeatureIds([]);
    setOriginalFeatureIds([]);
    resetImageState();
    setModal("form");
    await loadFeatures();
  };

  const openEdit = async (c) => {
    setForm({ manufacturer_id: c.manufacturer_id, model: c.model, year: c.year, type: c.engine_type, price: c.price, body_type: c.body_type, transmission: c.transmission });
    setEditing(c.car_id);
    resetImageState();
    setModal("form");
    await loadFeatures();

    try {
      const fullCar = await api.getCar(c.car_id);

      const currentIds = (fullCar.features || []).map((f) => f.feature_id);
      setSelectedFeatureIds(currentIds);
      setOriginalFeatureIds(currentIds);

      const s = fullCar.specification || {};
      setSpec({
        engine: s.engine || "", horsepower: s.horsepower || "", torque: s.torque || "",
        drivetrain: s.drivetrain || "", fuel_economy: s.fuel_economy || "",
        acceleration: s.acceleration || "", top_speed: s.top_speed || "",
        seating: s.seating || "", weight: s.weight || "",
      });

      // Existing main image preview
      if (fullCar.image_url) {
        setMainImagePreview(`http://localhost:5000${fullCar.image_url}`);
      }

      // Existing carousel images
      const existingImages = (fullCar.images || []).map((img) => ({
        url: `http://localhost:5000${img.image_url}`,
        isNew: false,
        imageId: img.image_id,
      }));
      setCarouselPreviews(existingImages);
    } catch {
      setSelectedFeatureIds([]);
      setOriginalFeatureIds([]);
      setSpec(emptySpec);
    }
  };

  const toggleFeature = (featureId) => {
    setSelectedFeatureIds((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
    );
  };

  // ── Main image handlers ──────────────────────────────────────────────────────
  const handleMainImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const removeMainImage = () => {
    setMainImageFile(null);
    setMainImagePreview(null);
  };

  // ── Carousel image handlers ──────────────────────────────────────────────────
  const handleCarouselSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setCarouselFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => ({ url: URL.createObjectURL(f), isNew: true }));
    setCarouselPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = ""; // allow re-selecting the same file
  };

  const removeCarouselImage = async (index, preview) => {
    if (!preview.isNew && preview.imageId && editing) {
      // Existing image on server — delete via API immediately
      try {
        await api.deleteCarImage(editing, preview.imageId);
        showToast("Image removed.", "success");
      } catch (err) {
        showToast(err.message, "error");
        return;
      }
    } else if (preview.isNew) {
      // New unsaved file — just remove it from staged files array
      const newFileIndex = carouselPreviews.slice(0, index).filter((p) => p.isNew).length;
      setCarouselFiles((prev) => prev.filter((_, i) => i !== newFileIndex));
    }
    setCarouselPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!form.model.trim() || !form.year || !form.price) return;
    setSaving(true);
    try {
      // ── Upload main image first if a new file was selected ──────────────────
      let imageUrl = null;
      if (mainImageFile) {
        setMainImageUploading(true);
        const { url } = await api.uploadMainImage(mainImageFile);
        imageUrl = url;
        setMainImageUploading(false);
      }

      const payload = {
        manufacturer_id: Number(form.manufacturer_id),
        model: form.model,
        year: Number(form.year),
        price: Number(form.price),
        body_type: form.body_type,
        engine_type: form.type,
        transmission: form.transmission,
        ...(imageUrl ? { image_url: imageUrl } : {}),
      };

      const specPayload = {
        engine: spec.engine || null,
        horsepower: spec.horsepower || null,
        torque: spec.torque || null,
        drivetrain: spec.drivetrain || null,
        fuel_economy: spec.fuel_economy || null,
        acceleration: spec.acceleration || null,
        top_speed: spec.top_speed || null,
        seating: spec.seating ? Number(spec.seating) : null,
        weight: spec.weight || null,
      };

      let carId;

      if (editing) {
        await api.updateCar(editing, payload);
        await api.updateCarSpecification(editing, specPayload);
        carId = editing;

        const toAdd    = selectedFeatureIds.filter((id) => !originalFeatureIds.includes(id));
        const toRemove = originalFeatureIds.filter((id) => !selectedFeatureIds.includes(id));

        await Promise.all([
          ...toAdd.map((fid) => api.addCarFeature(editing, fid)),
          ...toRemove.map((fid) => api.removeCarFeature(editing, fid)),
        ]);

        showToast("Car updated!", "success");
      } else {
        const created = await api.createCar({ ...payload, specification: specPayload });
        carId = created.car_id;

        await Promise.all(selectedFeatureIds.map((fid) => api.addCarFeature(carId, fid)));

        showToast("Car added!", "success");
      }

      // ── Upload new carousel files and attach their URLs ──────────────────────
      if (carouselFiles.length > 0) {
        setCarouselUploading(true);
        const { urls } = await api.uploadCarouselImages(carouselFiles);
        await api.attachCarImages(carId, urls);
        setCarouselUploading(false);
      }

      setModal(null);
      resetImageState();
      refresh();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
      setMainImageUploading(false);
      setCarouselUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteCar(deleteTarget.car_id);
      showToast("Car deleted.", "success");
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const filtered = data.filter((c) =>
    c.model.toLowerCase().includes(search.toLowerCase()) ||
    c.manufacturer_name.toLowerCase().includes(search.toLowerCase())
  );

  const featuresByCategory = allFeatures.reduce((acc, f) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f);
    return acc;
  }, {});

  const categoryTextColor = {
    Safety: "text-[#00f5ff]", Comfort: "text-[#7b2ff7]", Technology: "text-[#ff2d9b]",
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cars or manufacturer..."
          className="bg-[#0a0a2e] border border-[#00f5ff]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00f5ff] transition w-72" />
        <button onClick={openAdd} className="px-5 py-2.5 bg-[#ff2d9b] text-white text-sm font-semibold rounded-xl hover:bg-[#e91e8c] transition shadow-[0_0_15px_#ff2d9b40]">
          + Add Car
        </button>
      </div>

      <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0a0a2e] text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Model</th>
                <th className="px-5 py-3 text-left">Manufacturer</th>
                <th className="px-5 py-3 text-left">Year</th>
                <th className="px-5 py-3 text-left">Type</th>
                <th className="px-5 py-3 text-left">Price</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.car_id} className={`border-t border-white/5 hover:bg-white/5 transition ${i % 2 === 0 ? "bg-[#0d0d3b]" : "bg-[#0a0a2e]"}`}>
                  <td className="px-5 py-3 text-white text-sm font-medium">{c.model}</td>
                  <td className="px-5 py-3 text-gray-400 text-sm">{c.manufacturer_name}</td>
                  <td className="px-5 py-3 text-gray-400 text-sm">{c.year}</td>
                  <td className="px-5 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColor[c.engine_type]}`}>{c.engine_type}</span></td>
                  <td className="px-5 py-3 text-[#00f5ff] text-sm font-semibold">${Number(c.price).toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(c)} className="px-3 py-1 text-xs border border-[#00f5ff]/30 text-[#00f5ff] rounded-lg hover:bg-[#00f5ff]/10 transition">Edit</button>
                      <button onClick={() => setDeleteTarget(c)} className="px-3 py-1 text-xs border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-500 text-sm">No cars found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal === "form" && (
        <ModalWrapper title={editing ? "Edit Car" : "Add Car"} onClose={() => setModal(null)}>

          {/* ── Basic Info ── */}
          <p className="text-xs font-semibold text-[#ff2d9b] uppercase tracking-wider">Basic Info</p>

          <Field label="Model Name">
            <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="e.g. GR Supra" />
          </Field>

          <Field label="Manufacturer">
            <Select value={form.manufacturer_id} onChange={(e) => setForm({ ...form, manufacturer_id: e.target.value })}>
              {manufacturers.map((m) => <option key={m.manufacturer_id} value={m.manufacturer_id}>{m.name}</option>)}
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Year">
              <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2023" />
            </Field>
            <Field label="Engine Type">
              <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {["Petrol", "Diesel", "Hybrid", "Electric"].map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Body Type">
              <Select value={form.body_type} onChange={(e) => setForm({ ...form, body_type: e.target.value })}>
                {["Sedan", "SUV", "Coupe", "Hatchback"].map((b) => <option key={b} value={b}>{b}</option>)}
              </Select>
            </Field>
            <Field label="Transmission">
              <Select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })}>
                {["Automatic", "Manual"].map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
          </div>

          <Field label="Price (USD)">
            <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="55000" />
          </Field>

          {/* ── Main Card Image ── */}
          <p className="text-xs font-semibold text-[#00f5ff] uppercase tracking-wider pt-2 border-t border-white/5">
            Main Card Image
          </p>
          <p className="text-gray-500 text-xs -mt-2">
            Shown on car cards across Explore, Home, and Compare pages.
          </p>

          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl border border-[#00f5ff]/20 bg-[#0a0a2e] flex items-center justify-center overflow-hidden shrink-0">
              {mainImagePreview ? (
                <img src={mainImagePreview} alt="Main preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🚗</span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <label className="inline-block px-4 py-2 bg-[#0a0a2e] border border-[#00f5ff]/30 text-[#00f5ff] rounded-lg text-xs font-medium cursor-pointer hover:bg-[#00f5ff]/10 transition">
                {mainImagePreview ? "Change Image" : "Choose Image"}
                <input type="file" accept="image/*" onChange={handleMainImageSelect} className="hidden" />
              </label>
              {mainImagePreview && (
                <button onClick={removeMainImage} className="ml-2 text-xs text-red-400 hover:underline">
                  Remove
                </button>
              )}
              <p className="text-gray-600 text-xs">JPEG, PNG, or WEBP. Max 5MB.</p>
            </div>
          </div>

          {/* ── Carousel Images ── */}
          <p className="text-xs font-semibold text-[#7b2ff7] uppercase tracking-wider pt-2 border-t border-white/5">
            Car Details Carousel
          </p>
          <p className="text-gray-500 text-xs -mt-2">
            Multiple images shown in the image carousel on the Car Details page.
          </p>

          <div>
            <label className="inline-block px-4 py-2 bg-[#0a0a2e] border border-[#7b2ff7]/30 text-[#7b2ff7] rounded-lg text-xs font-medium cursor-pointer hover:bg-[#7b2ff7]/10 transition">
              + Add Images
              <input type="file" accept="image/*" multiple onChange={handleCarouselSelect} className="hidden" />
            </label>

            {carouselPreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {carouselPreviews.map((preview, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-white/10">
                    <img src={preview.url} alt={`Carousel ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeCarouselImage(idx, preview)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-xs
                                 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500"
                    >
                      ✕
                    </button>
                    {preview.isNew && (
                      <span className="absolute bottom-1 left-1 text-[9px] bg-[#7b2ff7]/80 text-white px-1.5 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {carouselPreviews.length === 0 && (
              <p className="text-gray-600 text-xs mt-2">No carousel images added yet.</p>
            )}
          </div>

          {/* ── Specifications ── */}
          <p className="text-xs font-semibold text-[#00f5ff] uppercase tracking-wider pt-2 border-t border-white/5">
            Specifications
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Engine">
              <Input value={spec.engine} onChange={(e) => setSpec({ ...spec, engine: e.target.value })} placeholder="e.g. 3.0L Turbo Inline-6" />
            </Field>
            <Field label="Horsepower">
              <Input value={spec.horsepower} onChange={(e) => setSpec({ ...spec, horsepower: e.target.value })} placeholder="e.g. 382 hp" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Torque">
              <Input value={spec.torque} onChange={(e) => setSpec({ ...spec, torque: e.target.value })} placeholder="e.g. 368 lb-ft" />
            </Field>
            <Field label="Drivetrain">
              <Input value={spec.drivetrain} onChange={(e) => setSpec({ ...spec, drivetrain: e.target.value })} placeholder="e.g. RWD" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Fuel Economy">
              <Input value={spec.fuel_economy} onChange={(e) => setSpec({ ...spec, fuel_economy: e.target.value })} placeholder="e.g. 22 mpg" />
            </Field>
            <Field label="Acceleration (0–60)">
              <Input value={spec.acceleration} onChange={(e) => setSpec({ ...spec, acceleration: e.target.value })} placeholder="e.g. 3.9s" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Top Speed">
              <Input value={spec.top_speed} onChange={(e) => setSpec({ ...spec, top_speed: e.target.value })} placeholder="e.g. 155 mph" />
            </Field>
            <Field label="Seating">
              <Input type="number" value={spec.seating} onChange={(e) => setSpec({ ...spec, seating: e.target.value })} placeholder="e.g. 2" />
            </Field>
          </div>

          <Field label="Curb Weight">
            <Input value={spec.weight} onChange={(e) => setSpec({ ...spec, weight: e.target.value })} placeholder="e.g. 3,382 lbs" />
          </Field>

          {/* ── Features ── */}
          <p className="text-xs font-semibold text-[#7b2ff7] uppercase tracking-wider pt-2 border-t border-white/5">
            Features
            {selectedFeatureIds.length > 0 && (
              <span className="text-[#00f5ff] ml-1 normal-case font-normal">({selectedFeatureIds.length} selected)</span>
            )}
          </p>

          {featuresLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 border-2 border-[#ff2d9b] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : allFeatures.length === 0 ? (
            <p className="text-gray-500 text-xs py-2">No features exist yet. Add some in the Features tab first.</p>
          ) : (
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1 border border-[#00f5ff]/10 rounded-xl p-4 bg-[#0a0a2e]">
              {Object.entries(featuresByCategory).map(([category, catFeatures]) => (
                <div key={category}>
                  <p className={`text-xs font-semibold mb-2 ${categoryTextColor[category] || "text-gray-400"}`}>
                    {category}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {catFeatures.map((f) => (
                      <label key={f.feature_id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs cursor-pointer transition
                          ${selectedFeatureIds.includes(f.feature_id)
                            ? "border-[#ff2d9b]/40 bg-white/5 text-white"
                            : "border-white/10 text-gray-400 hover:border-white/20"}`}>
                        <input type="checkbox" checked={selectedFeatureIds.includes(f.feature_id)}
                          onChange={() => toggleFeature(f.feature_id)} className="accent-[#ff2d9b]" />
                        {f.name}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 bg-[#ff2d9b] text-white rounded-xl text-sm font-semibold hover:bg-[#e91e8c] transition disabled:opacity-60">
              {saving
                ? mainImageUploading ? "Uploading main image..."
                : carouselUploading ? "Uploading carousel images..."
                : "Saving..."
                : editing ? "Save Changes" : "Add Car"}
            </button>
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/5 transition">
              Cancel
            </button>
          </div>
        </ModalWrapper>
      )}

      {deleteTarget && <DeleteConfirm name={deleteTarget.model} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}

// ── Features Panel ────────────────────────────────────────────────────────────
function Features({ data, refresh, showToast }) {
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Safety" });

  const openAdd = () => { setForm({ name: "", category: "Safety" }); setEditing(null); setModal("form"); };
  const openEdit = (f) => { setForm({ name: f.name, category: f.category }); setEditing(f.feature_id); setModal("form"); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await api.updateFeature(editing, form);
        showToast("Feature updated!", "success");
      } else {
        await api.createFeature(form);
        showToast("Feature added!", "success");
      }
      setModal(null);
      refresh();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteFeature(deleteTarget.feature_id);
      showToast("Feature deleted.", "success");
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const filtered = data.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search features..."
          className="bg-[#0a0a2e] border border-[#00f5ff]/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00f5ff] transition w-64" />
        <button onClick={openAdd} className="px-5 py-2.5 bg-[#ff2d9b] text-white text-sm font-semibold rounded-xl hover:bg-[#e91e8c] transition shadow-[0_0_15px_#ff2d9b40]">
          + Add Feature
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((f) => (
          <div key={f.feature_id} className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-xl p-4 hover:border-[#ff2d9b]/30 transition">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-white font-medium text-sm">{f.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${categoryColor[f.category]}`}>{f.category}</span>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => openEdit(f)} className="px-2.5 py-1 text-xs border border-[#00f5ff]/30 text-[#00f5ff] rounded-lg hover:bg-[#00f5ff]/10 transition">Edit</button>
                <button onClick={() => setDeleteTarget(f)} className="px-2.5 py-1 text-xs border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition">Del</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-3 text-center py-10 text-gray-500 text-sm">No features found.</div>}
      </div>

      {modal === "form" && (
        <ModalWrapper title={editing ? "Edit Feature" : "Add Feature"} onClose={() => setModal(null)}>
          <Field label="Feature Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Wireless Charging" /></Field>
          <Field label="Category">
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {["Safety", "Comfort", "Technology"].map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-[#ff2d9b] text-white rounded-xl text-sm font-semibold hover:bg-[#e91e8c] transition disabled:opacity-60">
              {saving ? "Saving..." : editing ? "Save Changes" : "Add Feature"}
            </button>
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/5 transition">Cancel</button>
          </div>
        </ModalWrapper>
      )}

      {deleteTarget && <DeleteConfirm name={deleteTarget.name} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}

// ── Messages Panel ────────────────────────────────────────────────────────────
function Messages({ showToast }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchMessages = () => {
    setLoading(true);
    api.getMessages().then(setMessages).finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchMessages();
  }, []);

  const markRead = async (id) => {
    await api.markMessageRead(id);
    setMessages((prev) => prev.map((m) => (m.message_id === id ? { ...m, is_read: 1 } : m)));
  };

  const deleteMsg = async (id) => {
    await api.deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m.message_id !== id));
    if (selected?.message_id === id) setSelected(null);
    showToast("Message deleted.", "success");
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  if (loading) {
    return <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#ff2d9b] border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-4">
        <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-xl px-5 py-3">
          <p className="text-2xl font-bold text-white">{messages.length}</p>
          <p className="text-gray-400 text-xs">Total Messages</p>
        </div>
        <div className="bg-[#0d0d3b] border border-[#ff2d9b]/20 rounded-xl px-5 py-3">
          <p className="text-2xl font-bold text-[#ff2d9b]">{unreadCount}</p>
          <p className="text-gray-400 text-xs">Unread</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 text-xs text-gray-500 uppercase tracking-wider">Inbox</div>
          <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-10">No messages yet.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.message_id} onClick={() => { setSelected(msg); if (!msg.is_read) markRead(msg.message_id); }}
                  className={`px-5 py-4 cursor-pointer transition hover:bg-white/5 ${selected?.message_id === msg.message_id ? "bg-white/5" : ""} ${!msg.is_read ? "border-l-2 border-[#ff2d9b]" : ""}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-medium truncate ${!msg.is_read ? "text-white" : "text-gray-300"}`}>{msg.name}</p>
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-[#ff2d9b] shrink-0" />}
                  </div>
                  <p className="text-gray-400 text-xs truncate mt-0.5">{msg.subject}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{new Date(msg.created_at).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-6">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-white font-bold">{selected.subject}</h3>
                  <p className="text-gray-400 text-sm mt-1">From: {selected.name} — <span className="text-[#00f5ff]">{selected.email}</span></p>
                  <p className="text-gray-600 text-xs mt-1">{new Date(selected.created_at).toLocaleString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${selected.is_read ? "bg-green-500/10 text-green-400" : "bg-[#ff2d9b]/10 text-[#ff2d9b]"}`}>
                  {selected.is_read ? "Read" : "Unread"}
                </span>
              </div>
              <div className="bg-[#0a0a2e] rounded-xl p-4 text-gray-300 text-sm leading-relaxed border border-white/5 min-h-[120px]">
                {selected.message}
              </div>
              <div className="flex gap-3">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="flex-1 py-2.5 bg-[#ff2d9b] text-white rounded-xl text-sm font-semibold text-center hover:bg-[#e91e8c] transition">
                  Reply via Email
                </a>
                <button onClick={() => deleteMsg(selected.message_id)}
                  className="px-4 py-2.5 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/10 transition">
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm py-16 text-center">
              <span className="text-4xl mb-3">✉️</span>
              <p>Select a message to read it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Root Admin Component ──────────────────────────────────────────────────────
export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [manufacturers, setManufacturers] = useState([]);
  const [cars, setCars] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = () => {
    setLoading(true);
    Promise.all([api.getManufacturers(), api.getCars(), api.getFeatures()])
      .then(([m, c, f]) => { setManufacturers(m); setCars(c); setFeatures(f); })
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const panelTitle = { dashboard: "Dashboard", manufacturers: "Manufacturers", cars: "Cars", features: "Features", messages: "Messages" };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-[#0a0a2e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ff2d9b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-[#0a0a2e] flex">
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 w-56 bg-[#05051a] border-r border-[#ff2d9b]/10 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="px-5 py-4 border-b border-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Admin Panel</p>
          <p className="text-white font-bold mt-0.5">The Showroom</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition
                ${activeTab === item.id ? "bg-[#ff2d9b]/10 text-[#ff2d9b] border border-[#ff2d9b]/20" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
              <span>{item.icon}</span><span>{item.label}</span>
              {activeTab === item.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ff2d9b]" />}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/5">
          <p className="text-xs text-gray-600">{manufacturers.length} manufacturers · {cars.length} cars</p>
        </div>
      </aside>

      <div className="flex-1 md:ml-56 flex flex-col min-h-[calc(100vh-4rem)]">
        <div className="sticky top-16 z-20 bg-[#05051a]/80 backdrop-blur-md border-b border-[#ff2d9b]/10 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-400 hover:text-white transition text-xl">☰</button>
            <div>
              <h1 className="text-white font-bold">{panelTitle[activeTab]}</h1>
              <p className="text-gray-500 text-xs">Manage your showroom data</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
            <span><span className="text-[#ff2d9b] font-semibold">{manufacturers.length}</span> manufacturers</span>
            <span><span className="text-[#00f5ff] font-semibold">{cars.length}</span> cars</span>
            <span><span className="text-[#7b2ff7] font-semibold">{features.length}</span> features</span>
          </div>
        </div>

        <div className="flex-1 p-6">
          {activeTab === "dashboard" && <Dashboard manufacturers={manufacturers} cars={cars} features={features} />}
          {activeTab === "manufacturers" && <Manufacturers data={manufacturers} refresh={fetchAll} showToast={showToast} />}
          {activeTab === "cars" && <Cars data={cars} manufacturers={manufacturers} refresh={fetchAll} showToast={showToast} />}
          {activeTab === "features" && <Features data={features} refresh={fetchAll} showToast={showToast} />}
          {activeTab === "messages" && <Messages showToast={showToast} />}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
import { useState } from "react";
import { api } from "../api/client";

const contactInfo = [
  {
    icon: "📧",
    label: "Email",
    value: "hello@theshowroom.com",
    sub: "We reply within 24 hours",
    color: "#ff2d9b",
  },
  {
    icon: "📍",
    label: "Location",
    value: "Abbottabad, Pakistan",
    sub: "A Database Project",
    color: "#00f5ff",
  },
  {
    icon: "🕐",
    label: "Support Hours",
    value: "Mon – Fri, 9am – 6pm",
    sub: "PKT (Pakistan Standard Time)",
    color: "#7b2ff7",
  },
];

const socialLinks = [
  { icon: "🐙", label: "GitHub",    href: "#", color: "#ff2d9b" },
  { icon: "💼", label: "LinkedIn",  href: "#", color: "#00f5ff" },
  { icon: "🐦", label: "Twitter",   href: "#", color: "#7b2ff7" },
  { icon: "📸", label: "Instagram", href: "#", color: "#ff2d9b" },
];

const faqs = [
  {
    q: "Is the car data accurate?",
    a: "Yes — all specifications are sourced from official manufacturer documentation and verified against multiple databases.",
  },
  {
    q: "Can I suggest a car to add?",
    a: "Absolutely. Use the contact form above and mention the make, model, and year. We review all submissions.",
  },
  {
    q: "Is this a commercial platform?",
    a: "No — The Showroom is an academic project built to demonstrate full-stack development with a relational database.",
  },
  {
    q: "How do I compare cars?",
    a: "Visit the Compare page, select up to 3 vehicles from the dropdowns, and the comparison table generates instantly.",
  },
];

// FAQ
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#00f5ff]/10 rounded-xl overflow-hidden hover:border-[#ff2d9b]/30 transition">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left
                   text-white font-medium text-sm hover:bg-white/5 transition"
      >
        <span>{q}</span>
        <span className={`text-[#ff2d9b] text-lg transition-transform duration-300
                          ${open ? "rotate-45" : "rotate-0"}`}>
          +
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed border-t border-white/5">
          {a}
        </div>
      )}
    </div>
  );
}

// Input Field
function InputField({ label, id, type = "text", placeholder, value, onChange, error }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-[#0a0a2e] border rounded-xl px-4 py-3 text-white text-sm
                    placeholder-gray-600 focus:outline-none transition
                    ${error
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-[#00f5ff]/20 focus:border-[#00f5ff]"
                    }`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

// Main Component
export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  // Validation
  const validate = () => {
    const e = {};
    if (!form.name.trim())                       e.name    = "Name is required.";
    if (!form.email.trim())                      e.email   = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))  e.email   = "Enter a valid email address.";
    if (!form.subject.trim())                    e.subject = "Subject is required.";
    if (!form.message.trim())                    e.message = "Message is required.";
    else if (form.message.trim().length < 20)    e.message = "Message must be at least 20 characters.";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      setStatus("idle");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      await api.sendMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch (err) {
      console.error("Message submission error:", err);
      setStatus("error");
      setErrorMsg(err.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a2e]">

      {/* Header */}
      <div className="relative bg-[#05051a] border-b border-[#ff2d9b]/20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-60px] right-1/4 w-[400px] h-[400px]
                          bg-[#ff2d9b]/5 rounded-full blur-3xl" />
          <div className="absolute top-[-40px] left-1/4 w-[300px] h-[300px]
                          bg-[#00f5ff]/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <span className="inline-block text-xs uppercase tracking-widest text-[#ff2d9b]
                           border border-[#ff2d9b]/30 px-4 py-1 rounded-full mb-6">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact{" "}
            <span className="bg-gradient-to-r from-[#ff2d9b] to-[#00f5ff]
                             bg-clip-text text-transparent">
              Us
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Have a question, suggestion, or just want to say hello?
            Fill out the form and we'll get back to you shortly.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {contactInfo.map((info) => (
            <div
              key={info.label}
              className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-6
                         hover:border-[#ff2d9b]/30 transition text-center"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center
                            text-2xl mx-auto mb-4 border"
                style={{
                  backgroundColor: `${info.color}15`,
                  borderColor: `${info.color}30`,
                }}
              >
                {info.icon}
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                {info.label}
              </p>
              <p className="text-white font-semibold">{info.value}</p>
              <p className="text-gray-500 text-xs mt-1">{info.sub}</p>
            </div>
          ))}
        </div>

        {/* Form + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-[#ff2d9b]">✉</span> Send a Message
            </h2>

            {/* ── Success State ── */}
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-[#00f5ff]/10 border
                                border-[#00f5ff]/30 flex items-center justify-center
                                text-3xl mb-4">
                  ✅
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Message Sent!</h3>
                <p className="text-gray-400 text-sm mb-2">
                  Your message has been saved to our database.
                </p>
                <p className="text-gray-500 text-xs mb-6">
                  We'll get back to you at{" "}
                  <span className="text-[#00f5ff]">{form.email || "your email"}</span>{" "}
                  within 24 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-6 py-2 border border-[#ff2d9b]/30 text-[#ff2d9b]
                             rounded-xl text-sm hover:bg-[#ff2d9b]/10 transition"
                >
                  Send Another
                </button>
              </div>

            ) : (
              /* ── Form Fields ── */
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    label="Your Name"
                    id="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange("name")}
                    error={errors.name}
                  />
                  <InputField
                    label="Email Address"
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange("email")}
                    error={errors.email}
                  />
                </div>

                <InputField
                  label="Subject"
                  id="subject"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={handleChange("subject")}
                  error={errors.subject}
                />

                {/* Textarea */}
                <div>
                  <label htmlFor="message"
                    className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Write your message here... (min. 20 characters)"
                    value={form.message}
                    onChange={handleChange("message")}
                    className={`w-full bg-[#0a0a2e] border rounded-xl px-4 py-3 text-white
                                text-sm placeholder-gray-600 focus:outline-none transition resize-none
                                ${errors.message
                                  ? "border-red-500/60 focus:border-red-500"
                                  : "border-[#00f5ff]/20 focus:border-[#00f5ff]"
                                }`}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.message
                      ? <p className="text-red-400 text-xs">{errors.message}</p>
                      : <span />
                    }
                    <p className={`text-xs ml-auto
                      ${form.message.length < 20 ? "text-gray-600" : "text-[#00f5ff]"}`}>
                      {form.message.length} / 20 min
                    </p>
                  </div>
                </div>

                {/* Error Banner */}
                {status === "error" && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10
                                  border border-red-500/30 rounded-xl text-red-400 text-sm">
                    <span className="text-lg">⚠</span>
                    <span>{errorMsg}</span>
                    <button
                      onClick={() => setStatus("idle")}
                      className="ml-auto text-red-400 hover:text-red-300 transition"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={status === "sending"}
                  className="w-full py-3 bg-[#ff2d9b] text-white font-semibold
                             rounded-xl hover:bg-[#e91e8c] transition
                             shadow-[0_0_20px_#ff2d9b40]
                             disabled:opacity-60 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                >
                  {status === "sending" ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white"
                           xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                                stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending to database...
                    </>
                  ) : (
                    "Send Message →"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Links */}
            <div className="bg-[#0d0d3b] border border-[#00f5ff]/10 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="text-[#00f5ff]">🌐</span> Follow Us
              </h3>
              <div className="space-y-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl
                               border border-white/5 hover:border-[#ff2d9b]/30
                               hover:bg-white/5 transition group"
                  >
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-gray-300 text-sm group-hover:text-white transition">
                      {s.label}
                    </span>
                    <span className="ml-auto text-gray-600 text-xs
                                     group-hover:text-[#ff2d9b] transition">
                      →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff2d9b] to-[#00f5ff]
                           bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Quick answers to common questions about The Showroom
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
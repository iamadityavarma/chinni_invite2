import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

// Paste your Apps Script web app URL here after deploying code.gs
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyAZzwPXNSj4NJ3_WoY-K3dIDTGXUNtkEDypdbK1fDkUF5J-HmEQ1qHKxFBD12pGn-4CA/exec";

export const Route = createFileRoute("/rsvp")({
  head: () => ({
    meta: [{ title: "RSVP — Aditya & Vineetha" }],
  }),
  component: RsvpPage,
});

type Status = "idle" | "sending" | "done" | "error";

function RsvpPage() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    guests: "1",
    wedding: "yes",
    reception: "yes",
  });
  const [status, setStatus] = useState<Status>("idle");

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (!SCRIPT_URL) { setStatus("done"); return; }
    setStatus("sending");
    try {
      await fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(form) });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #fdf6ec 0%, #fdebd0 100%)" }}>

      <Link to="/" className="self-start ml-2 mb-6 text-sm text-[#7C3D12] underline underline-offset-2">
        ← Back to invitation
      </Link>

      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-lg px-8 py-10 border border-amber-100">

        {/* Header */}
        <p className="font-script text-5xl text-center text-[#7C1D1D] mb-1" style={{ fontFamily: "Sacramento, cursive" }}>
          RSVP
        </p>
        <p className="text-center text-sm tracking-widest text-[#7C3D12] mb-8 uppercase">
          Aditya &amp; Vineetha · December 2026
        </p>

        {status === "done" ? (
          <div className="text-center py-6">
            <p className="text-3xl mb-3">🎉</p>
            <p className="font-semibold text-[#7C1D1D] text-lg mb-1">Thank you!</p>
            <p className="text-sm text-gray-500 mb-6">We've received your RSVP and can't wait to celebrate with you.</p>
            <Link to="/" className="text-sm text-[#7C3D12] underline underline-offset-2">← Back to invitation</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-5">

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold tracking-widest text-[#7C3D12] uppercase">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Your full name"
                className="border border-amber-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
              />
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold tracking-widest text-[#7C3D12] uppercase">Contact</label>
              <input
                required
                value={form.contact}
                onChange={(e) => set("contact", e.target.value)}
                placeholder="Phone or email"
                className="border border-amber-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
              />
            </div>

            {/* Number of guests */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold tracking-widest text-[#7C3D12] uppercase">Number of Guests</label>
              <input
                required
                type="number"
                min="1"
                max="20"
                value={form.guests}
                onChange={(e) => set("guests", e.target.value)}
                className="border border-amber-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white w-28"
              />
            </div>

            {/* Attending ceremony */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-widest text-[#7C3D12] uppercase">
                Attending Ceremony &amp; Muhurtham?
              </label>
              <div className="flex gap-3">
                {["yes", "no"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => set("wedding", v)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      form.wedding === v
                        ? "bg-[#7C1D1D] text-white border-[#7C1D1D]"
                        : "bg-white text-[#7C3D12] border-amber-200 hover:border-[#7C1D1D]"
                    }`}
                  >
                    {v === "yes" ? "✓ Yes" : "✗ No"}
                  </button>
                ))}
              </div>
            </div>

            {/* Attending afterparty/lunch */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-widest text-[#7C3D12] uppercase">
                Attending Afterparty?
              </label>
              <div className="flex gap-3">
                {["yes", "no"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => set("reception", v)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      form.reception === v
                        ? "bg-[#7C1D1D] text-white border-[#7C1D1D]"
                        : "bg-white text-[#7C3D12] border-amber-200 hover:border-[#7C1D1D]"
                    }`}
                  >
                    {v === "yes" ? "✓ Yes" : "✗ No"}
                  </button>
                ))}
              </div>
            </div>

            {status === "error" && (
              <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 w-full py-3 rounded-xl bg-[#7C1D1D] text-white font-semibold tracking-widest text-sm uppercase hover:bg-[#6a1818] transition-colors disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send RSVP"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

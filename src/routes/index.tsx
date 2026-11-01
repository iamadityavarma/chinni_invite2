import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { TurmericReveal } from "@/components/turmeric-reveal";
import cover from "@/assets/cover.jpg";
import weddingAudio from "@/assets/wedding audio.mpeg";
import card from "@/assets/wedding-invitation.jpeg";
import names from "@/assets/family-invitation.jpeg";
import events from "@/assets/events-schedule.jpeg";
import m1 from "@/assets/mangalasnanam.jpeg";
import m2 from "@/assets/pellikoduku.jpeg";
import m3 from "@/assets/m3.jpg";
import m4 from "@/assets/m4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aditya & Vineetha — Wedding Invitation" },
      { name: "description", content: "You are invited to celebrate the wedding of Aditya Varma & Vineetha Thrinethri, December 11–13, 2026." },
      { property: "og:title", content: "Aditya & Vineetha — Wedding Invitation" },
      { property: "og:description", content: "Join us for Mangalasnanam, Pellikoduku, Muhurtham & Afterparty — Dec 11–13, 2026." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://av-weddinginvite.netlify.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://av-weddinginvite.netlify.app/og-image.jpg" },
    ],
  }),
  component: Index,
});

const SOARING = "SoaringHeights, 145 Aero Country Road, McKinney, TX";
const PRISM = "Prism Las Colinas Irving TX";

const cal = (text: string, start: string, end: string, location: string) =>
  `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(text)}&dates=${start}/${end}&ctz=America/Chicago&location=${encodeURIComponent(location)}`;
const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

type Btn = { label: string; href: string; internal?: boolean };
type Ev = { key: string; img: string; btnClass: string; inkClass: string; textTop: string; lines: { t: string; c: string }[]; buttons: Btn[] };

const EVENTS: Ev[] = [
  {
    key: "m1", img: m1, btnClass: "btn-amber", inkClass: "ink-amber", textTop: "17%",
    lines: [],
    buttons: [{ label: "📅 Save Date", href: cal("Aditya's Mangalasnanam", "20261211T073000", "20261211T093000", SOARING) }],
  },
  {
    key: "m2", img: m2, btnClass: "btn-green", inkClass: "ink-green", textTop: "28%",
    lines: [],
    buttons: [{ label: "📅 Save Date", href: cal("Aditya's Pellikoduku Ceremony", "20261211T103000", "20261211T123000", SOARING) }],
  },
  {
    key: "m3", img: m3, btnClass: "btn-brick", inkClass: "ink-brick", textTop: "9%",
    lines: [
      { t: "Muhurtham", c: "font-script text-6xl" },
      { t: "Dec 12, 2026", c: "text-2xl font-bold tracking-[0.1em]" },
      { t: "9:18 AM", c: "text-3xl font-bold" },
      { t: "Venue: SoaringHeights", c: "text-lg font-semibold mt-3" },
      { t: "145 Aero Country Road, McKinney, TX", c: "text-base" },
    ],
    buttons: [
      { label: "📍 Directions", href: maps(SOARING) },
      { label: "📅 Save Date", href: cal("Aditya & Vineetha — Pelli Muhurtham", "20261212T091800", "20261212T113000", SOARING) },
    ],
  },
  {
    key: "m4", img: m4, btnClass: "btn-purple", inkClass: "ink-lavender", textTop: "25%",
    lines: [
      { t: "DECEMBER", c: "text-lg font-bold tracking-[0.4em] ink-goldglow" },
      { t: "SUNDAY 13 2026", c: "text-base font-bold tracking-[0.25em] ink-goldglow" },
      { t: "Wedding Afterparty", c: "font-script text-5xl mt-1" },
      { t: "An Elegant evening to celebrate a lifetime of togetherness", c: "text-base italic px-4" },
      { t: "Join us for a joyful soirée of music, dance and lots of bling", c: "text-base px-4 mt-1" },
      { t: "From 6:30 pm onwards · Followed by dinner", c: "text-base font-semibold mt-2" },
      { t: "Attire: Glitter & Glam", c: "text-base italic ink-goldglow" },
      { t: "Venue: Prism Las Colinas, Irving", c: "text-base font-semibold" },
    ],
    buttons: [
      { label: "💜 RSVP", href: "/rsvp", internal: true },
      { label: "📍 Directions", href: maps(PRISM) },
      { label: "📅 Save Date", href: cal("Aditya & Vineetha — Wedding Afterparty", "20261213T183000", "20261213T233000", PRISM) },
    ],
  },
];

const HUB = [
  { title: "MANGALASNANAM", sub: "Dec 11 | 7:00 A.M onwards", top: 30, left: 42, w: 34, align: "text-center" },
  { title: "PELLIKODUKU CEREMONY", sub: "Dec 11 | 10:30 A.M onwards", top: 41, left: 20.5, w: 33, align: "text-center" },
  { title: "PELLI MUHURTHAM", sub: "Dec 12 | 7:00 A.M onwards · Followed by lunch", top: 55.5, left: 37.5, w: 27.5, align: "text-center" },
  { title: "WEDDING AFTERPARTY", sub: "Dec 13 | 6:30 P.M onwards · Followed by dinner", top: 74.5, left: 32.5, w: 35.5, align: "text-center" },
];

function Reveal({ cls, children }: { cls: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rv ${cls}`}>{children}</div>;
}

function Film({ ev }: { ev: Ev }) {
  const [done, setDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDone(true), 5000); return () => clearTimeout(t); }, []);
  const text = (animated: boolean) => (
    <div className={`absolute inset-x-0 flex flex-col items-center text-center px-8 ${ev.inkClass}`} style={{ top: ev.textTop }}>
      {ev.lines.map((l, i) => (
        <div key={i} className={`${l.c} leading-tight ${animated ? "film-line" : ""}`} style={animated ? { animationDelay: `${0.8 + i * 0.45}s` } : undefined}>{l.t}</div>
      ))}
    </div>
  );
  return (
    <div className="film">
      <img src={ev.img} alt="" width={864} height={1536} className="film-bg absolute inset-0 h-full w-full object-cover" />
      {text(true)}
      <div className={`film-static ${done ? "show" : ""}`}>
        <img src={ev.img} alt="" width={864} height={1536} className="absolute inset-0 h-full w-full object-cover" />
        {text(false)}
      </div>
    </div>
  );
}

function Index() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [turmericVisible, setTurmericVisible] = useState(false);
  const revealTurmeric = useCallback(() => setTurmericVisible(false), []);
  const touchY = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = !open || active !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, active]);

  const openModal = (i: number) => { setTurmericVisible(i === 0); setActive(i); requestAnimationFrame(() => requestAnimationFrame(() => setShow(true))); };
  const ev = active !== null ? EVENTS[active] : undefined;
  const close = () => { setTurmericVisible(false); setShow(false); setTimeout(() => setActive(null), 480); };

  return (
    <main className="inv-col">
      {/* Cover */}
      <div className={`cover ${open ? "open" : ""}`}>
        <div className="cover-half cover-left"><img src={cover} alt="AV monogram" width={864} height={1536} /></div>
        <div className="cover-half cover-right"><img src={cover} alt="" width={864} height={1536} /></div>
        <div className="cover-ui absolute inset-0" style={{ pointerEvents: open ? "none" : "auto" }}>
          <button aria-label="Open invitation" className="medallion-btn" onClick={() => { setOpen(true); new Audio(weddingAudio).play(); }} />
          <p className="hint blink absolute inset-x-0 bottom-10">✦ Tap to open ✦</p>
        </div>
      </div>

      {/* Card */}
      <Reveal cls="rv-left">
        <section className="relative">
          <h1 className="sr-only">Aditya & Vineetha — Wedding Invitation</h1>
          <img src={card} alt="Wedding invitation with temple, banana leaves, and floral decorations" width={1080} height={1920} className="block w-full" />
        </section>
      </Reveal>

      {/* Names */}
      <Reveal cls="rv-up">
        <section className="relative">
          <img src={names} alt="Together with their families, Aditya Varma and Vineetha Thrinethri invite you to their wedding" loading="lazy" width={1080} height={1920} className="block w-full" />
        </section>
      </Reveal>

      {/* Events hub */}
      <Reveal cls="rv-scale">
        <section className="pb-10">
          <div className="float relative">
            <img src={events} alt="Events schedule with garlands, mandala pattern and wedding illustrations" loading="lazy" width={1080} height={1920} className="block w-full" />
            {HUB.map((h, i) => (
              <button
                key={i}
                aria-label={`View ${h.title}`}
                className={`absolute ${h.align} ev-tap`}
                style={{ top: `${h.top}%`, left: `${h.left}%`, width: `${h.w}%` }}
                onClick={() => openModal(i)}
              >
                <div className="ev-bob" style={{ animationDelay: `${i * 0.3}s` }}>
                  <div className="ev-title text-xl">{h.title}</div>
                  <div className="ev-sub text-sm mt-1">{h.sub}</div>
                </div>
              </button>
            ))}
          </div>
          <p className="hint blink mt-6 normal-case tracking-[0.2em] text-sm">✦ Tap on events to view ✦</p>
        </section>
      </Reveal>

      {/* Modal */}
      {ev && (
        <>
          <div className={`backdrop ${show ? "show" : ""}`} onClick={close} />
          <div
            className={`sheet ${show ? "show" : ""}`}
            onTouchStart={(e) => (touchY.current = e.touches[0]?.clientY ?? null)}
            onTouchEnd={(e) => { if (touchY.current !== null && (e.changedTouches[0]?.clientY ?? 0) - touchY.current > 60) close(); touchY.current = null; }}
          >
            <Film key={ev.key} ev={ev} />
            <div className="btn-bar">
              {ev.buttons.map((b) =>
                b.internal ? (
                  <Link key={b.label} to={b.href as "/rsvp"} className={`lux-btn ${ev.btnClass}`}>{b.label}</Link>
                ) : (
                  <a key={b.label} href={b.href} target="_blank" rel="noreferrer" className={`lux-btn ${ev.btnClass}`}>{b.label}</a>
                )
              )}
            </div>
          </div>
          {show && ev.key === "m1" && turmericVisible && <TurmericReveal onReveal={revealTurmeric} />}
          {show && <button aria-label="Close" className="close-btn" onClick={close}>✕</button>}
        </>
      )}
    </main>
  );
}

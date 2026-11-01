import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Eye, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import turmeric from "@/assets/turmeric-splash.jpg";

type Point = { x: number; y: number };

export function TurmericReveal({ onReveal }: { onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previous = useRef<Point | null>(null);
  const [cleared, setCleared] = useState(false);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) { onReveal(); return; }
    let cancelled = false;
    const image = new Image();
    const paint = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--turmeric").trim();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (image.complete && image.naturalWidth > 0) {
        const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
        const w = image.width * scale;
        const h = image.height * scale;
        ctx.drawImage(image, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      }
    };
    paint();
    image.onload = () => { if (!cancelled) paint(); };
    image.src = turmeric;
    const timer = window.setTimeout(() => setReady(true), 750);
    window.addEventListener("resize", paint);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("resize", paint);
    };
  }, [onReveal]);

  useEffect(() => {
    if (!cleared) return;
    const timer = window.setTimeout(onReveal, 650);
    return () => window.clearTimeout(timer);
  }, [cleared, onReveal]);

  const wipe = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !ready || cleared) return;
    setStarted(true);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const point = { x: (e.clientX - rect.left) * scale, y: (e.clientY - rect.top) * scale };
    const from = previous.current ?? point;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = Math.max(70, Math.min(rect.width * 0.26, 200)) * scale;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    previous.current = point;
  };

  const endWipe = () => {
    previous.current = null;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let erased = 0;
    let sampled = 0;
    for (let i = 3; i < pixels.length; i += 160) {
      sampled++;
      if ((pixels[i] ?? 255) < 80) erased++;
    }
    if (sampled > 0 && erased / sampled >= 0.4) setCleared(true);
  };

  return (
    <div className={`turmeric-reveal ${cleared ? "is-cleared" : ""}`}>
      <canvas
        ref={canvasRef}
        className="turmeric-canvas"
        role="button"
        tabIndex={0}
        aria-label="Wipe away the turmeric to reveal Mangalasnanam. Press Enter to reveal."
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCleared(true); } }}
        onPointerDown={(e) => {
          if (!ready || cleared) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          previous.current = null;
          wipe(e);
        }}
        onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) wipe(e); }}
        onPointerUp={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
          endWipe();
        }}
        onPointerCancel={endWipe}
      />
      {!started && !cleared && (
        <div className="turmeric-hint" aria-hidden="true">
          <Hand className="turmeric-hand" />
          <span>Swipe to reveal</span>
        </div>
      )}
      <Button variant="ghost" size="icon" className="turmeric-skip" aria-label="Reveal Mangalasnanam invitation" title="Reveal invitation" onClick={() => setCleared(true)}>
        <Eye aria-hidden="true" />
      </Button>
    </div>
  );
}
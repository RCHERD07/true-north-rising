import React, { useEffect, useMemo, useRef, useState } from "react";
import utahSunset from "./assets/utahSunset.jpg";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Shield,
  HeartHandshake,
  Compass,
  Phone,
  Mail,
  MapPin,
  X,
  Sparkles,
} from "lucide-react";

// Self-contained UI components (no shadcn/ui required)
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "icon";
};

function Button({ className = "", variant = "default", size = "default", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 select-none whitespace-nowrap rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };
  const sizes: Record<string, string> = {
    default: "px-4 py-2",
    icon: "h-10 w-10 p-0 rounded-full",
  };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}

function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/70 bg-white shadow-sm ${className}`}
      {...props}
    />
  );
}

function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}


/**
 * Modern landing page starter for a concierge-style support service.
 * - Blues/greys/greens palette
 * - Hero carousel directly under logo
 * - Prev/Next arrows
 * - Click to expand (lightbox)
 *
 * Replace sample images with real client photos (ensure you have consent).
 */

const SAMPLE_IMAGES = [
  {
    src: utahSunset,
    alt: "Sunset Living",
    caption: "Everyday life, supported with dignity.",
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    alt: "Community outing",
    caption: "Community access and meaningful participation.",
  },
  {
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
    alt: "Person smiling",
    caption: "Concierge-level support that respects independence.",
  },
];

function clampIndex(idx: number, len: number) {
  if (len <= 0) return 0;
  return ((idx % len) + len) % len;
}

function useInterval(callback: () => void, delay: number | null) {
  const savedRef = useRef(callback);
  useEffect(() => {
    savedRef.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedRef.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

function Carousel({ images = SAMPLE_IMAGES }: { images?: { src: string; alt: string; caption?: string }[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const safeIndex = useMemo(() => clampIndex(index, images.length), [index, images.length]);
  const current = images[safeIndex];

  useInterval(
    () => {
      setIndex((i) => i + 1);
    },
    paused || expanded ? null : 5500
  );

  const goPrev = () => setIndex((i) => i - 1);
  const goNext = () => setIndex((i) => i + 1);

  return (
    <div className="w-full">
      <div
        className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50 shadow-sm"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative aspect-[16/9] md:aspect-[21/9]">
          <AnimatePresence mode="wait">
            <motion.button
              key={current?.src}
              type="button"
              className="absolute inset-0 w-full h-full"
              onClick={() => setExpanded(true)}
              aria-label="Open image"
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <img
                src={current?.src}
                alt={current?.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
              {current?.caption ? (
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-left">
                  <p className="max-w-2xl text-sm md:text-base font-medium text-white/95 drop-shadow">
                    {current.caption}
                  </p>
                </div>
              ) : null}
            </motion.button>
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 md:p-4">
            <div className="flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-xs md:text-sm text-slate-700 shadow">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold">Customer moments</span>
              <span className="text-slate-500">
                {safeIndex + 1}/{images.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/85 hover:bg-white"
                onClick={goPrev}
                aria-label="Previous image"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/85 hover:bg-white"
                onClick={goNext}
                aria-label="Next image"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Dots */}
          <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 flex gap-1.5">
            {images.map((_, i) => {
              const active = i === safeIndex;
              return (
                <button
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    active ? "bg-emerald-400 w-6" : "bg-white/70 hover:bg-white"
                  }`}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {expanded ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Expanded image"
          >
            <motion.div
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-slate-900 shadow-2xl"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute right-3 top-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                onClick={() => setExpanded(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <img src={current?.src} alt={current?.alt} className="max-h-[78vh] w-full object-contain bg-slate-950" />
              {(current?.caption || current?.alt) && (
                <div className="p-4 text-white/90">
                  <p className="text-sm md:text-base font-medium">{current?.caption || current?.alt}</p>
                </div>
              )}
              <div className="absolute inset-y-0 left-2 flex items-center">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={goPrev}
                  aria-label="Previous image"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute inset-y-0 right-2 flex items-center">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={goNext}
                  aria-label="Next image"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function TrueNorthLanding() {
  return (
    <div className="relative min-h-screen text-slate-900">
      {/* Fixed background gradient stays in place while content scrolls */}
      <div className="pointer-events-none fixed inset-0 -z-30 bg-white" />

      {/* Soft blurred color layer */}
      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-[18vw] min-w-[120px] bg-gradient-to-b from-sky-200 via-blue-100 to-emerald-200" />
        <div className="absolute inset-y-0 right-0 w-[18vw] min-w-[120px] bg-gradient-to-b from-sky-200 via-blue-100 to-emerald-200" />

        <div className="absolute -top-16 left-0 h-56 w-[20vw] min-w-[140px] bg-blue-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-[22vw] min-w-[160px] bg-emerald-200/35 blur-3xl" />
        <div className="absolute -top-16 right-0 h-56 w-[20vw] min-w-[140px] bg-blue-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-[22vw] min-w-[160px] bg-emerald-200/35 blur-3xl" />
      </div>

      {/* White content surface */}
      <div className="relative z-10 mx-auto min-h-screen max-w-[1440px] bg-white shadow-[0_0_0_1px_rgba(148,163,184,0.14),0_24px_80px_rgba(15,23,42,0.08)]">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/88 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-sm">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-slate-600">True North Rising</div>
                <div className="-mt-0.5 text-base font-semibold tracking-tight">LLC</div>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" className="text-slate-700">Services</Button>
              <Button variant="ghost" className="text-slate-700">Approach</Button>
              <Button variant="ghost" className="text-slate-700">Contact</Button>
              <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">Request a call</Button>
            </div>

            <div className="md:hidden">
              <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">Request a call</Button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="grid gap-10 md:grid-cols-12 md:items-start">
            <div className="md:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Concierge-style support • Community-first
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Support that feels like real life — 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-emerald-600"> with dignity </span>
              </h1>

              <p className="mt-4 max-w-prose text-slate-600">
                Personalized in-home support and community-based day programming designed to help people access the same everyday opportunities most of us take for granted.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">
                  Get started
                </Button>
                <Button variant="outline" className="rounded-xl border-slate-300">
                  See services
                </Button>
              </div>

              <div className="mt-8 grid gap-3">
                <Card className="rounded-2xl border-slate-200/70">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold">Safety & stability</div>
                        <div className="text-sm text-slate-600">Consistent routines, dependable coverage, and clear communication.</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200/70">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                        <HeartHandshake className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold">Community access</div>
                        <div className="text-sm text-slate-600">Outings, activities, and support that respects independence.</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="md:col-span-7">
              <Carousel />

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Card className="rounded-2xl border-slate-200/70">
                  <CardContent className="p-4">
                    <div className="text-sm font-semibold">In-home support</div>
                    <div className="mt-1 text-xs text-slate-600">Flexible coverage, routines, and independence-building.</div>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-slate-200/70">
                  <CardContent className="p-4">
                    <div className="text-sm font-semibold">Tailored day program</div>
                    <div className="mt-1 text-xs text-slate-600">Community-first programming with 1:1 support.</div>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-slate-200/70">
                  <CardContent className="p-4">
                    <div className="text-sm font-semibold">Transportation</div>
                    <div className="mt-1 text-xs text-slate-600">Reliable rides to appointments, errands, and activities.</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Values strip */}
          <section className="mt-12">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-2xl border-slate-200/70">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">High standards</div>
                      <div className="text-sm text-slate-600">Professional, consistent, and responsive support.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-slate-200/70">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Privacy & respect</div>
                      <div className="text-sm text-slate-600">Customer-first decisions and careful communication.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-slate-200/70">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                      <HeartHandshake className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Real-life access</div>
                      <div className="text-sm text-slate-600">Helping people do more of what matters to them.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact */}
          <section className="mt-12" id="contact">
            <Card className="rounded-2xl border-slate-200/70">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Request a call</h2>
                    <p className="mt-1 text-slate-600">Tell us what support you’re looking for. We’ll respond within 1 business day.</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">
                      <Phone className="mr-2 h-4 w-4" /> Call
                    </Button>
                    <Button variant="outline" className="rounded-xl border-slate-300">
                      <Mail className="mr-2 h-4 w-4" /> Email
                    </Button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Phone className="h-4 w-4 text-emerald-600" />
                    <span>(442) 888-4419</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>hello@truenorth-rising.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <MapPin className="h-4 w-4 text-slate-600" />
                    <span>Coastal California</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <footer className="mt-12 pb-10 text-xs text-slate-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>© {new Date().getFullYear()} True North Rising LLC. All rights reserved.</div>
              <div className="flex gap-3">
                <a className="hover:text-slate-700" href="#">Privacy</a>
                <a className="hover:text-slate-700" href="#">Terms</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

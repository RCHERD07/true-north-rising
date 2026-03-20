import React, { useEffect, useMemo, useRef, useState } from "react";
import logo from "./assets/transparent_logo_notext.png";
import boardwalk from "./assets/boardwalk.jpg";
import piersunset from "./assets/piersunset.jpg";
import pier from "./assets/pier.jpg";
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
  Menu,
} from "lucide-react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "icon";
};

function Button({ className = "", variant = "default", size = "default", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 select-none whitespace-nowrap rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:pointer-events-none disabled:opacity-50";

  const variants: Record<string, string> = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };

  const sizes: Record<string, string> = {
    default: "px-4 py-2",
    icon: "h-10 w-10 rounded-full p-0",
  };

  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}

function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-2xl border border-slate-200/70 bg-white shadow-sm ${className}`} {...props} />;
}

function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}

const SAMPLE_IMAGES = [
  {
    src: boardwalk,
    alt: "boardwalk",
    caption: "Everyday life, supported with dignity.",
  },
  {
    src: piersunset,
    alt: "Pier sunset",
    caption: "Sunset views from the pier.",
  },
  {
    src: pier,
    alt: "Pier",
    caption: "Community access and meaningful participation.",
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
        className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-slate-50 shadow-sm"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative h-[220px] sm:h-[260px] md:h-[350px]">
          <AnimatePresence mode="wait">
            <motion.button
              key={current?.src}
              type="button"
              className="absolute inset-0 h-full w-full"
              onClick={() => setExpanded(true)}
              aria-label="Open image"
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <img src={current?.src} alt={current?.alt} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/45 via-slate-950/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-3 text-left sm:p-4 md:p-10">
                <div className="max-w-[72%] sm:max-w-[65%] md:max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm sm:px-3 sm:text-xs">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600 sm:h-4 sm:w-4" />
                    Customer Moments
                  </div>

                  <p className="mt-2 max-w-xs text-[11px] leading-4 text-white/90 sm:text-xs sm:leading-5 md:mt-3 md:max-w-xl md:text-base">
                    True North Rising provides dependable in-home and community-based support with dignity,
                    consistency, and real-life focus.
                  </p>

                  <div className="mt-3 flex max-w-[220px] flex-col gap-2 sm:max-w-none sm:flex-row md:mt-5 md:gap-3">
                    <Button className="w-full rounded-xl bg-blue-400 text-slate-900 hover:bg-blue-300 sm:w-auto">
                      Get started
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-white/70 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
                    >
                      See services
                    </Button>
                  </div>
                </div>
              </div>
            </motion.button>
          </AnimatePresence>

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 md:p-5">
            <div className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] text-slate-700 shadow-sm sm:px-3 sm:py-1.5 sm:text-xs">
              {safeIndex + 1} / {images.length}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-2xl bg-white/85 hover:bg-white md:h-10 md:w-10 md:rounded-full"
                onClick={goPrev}
                aria-label="Previous image"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-2xl bg-white/85 hover:bg-white md:h-10 md:w-10 md:rounded-full"
                onClick={goNext}
                aria-label="Next image"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="absolute bottom-3 right-3 flex gap-1.5 md:bottom-5 md:right-5">
            {images.map((_, i) => {
              const active = i === safeIndex;
              return (
                <button
                  key={i}
                  className={`h-2.5 rounded-full transition-all ${
                    active ? "w-6 bg-white" : "w-2.5 bg-white/60 hover:bg-white"
                  }`}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>

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
                  <p className="text-sm font-medium md:text-base">{current?.caption || current?.alt}</p>
                </div>
              )}

              <div className="absolute inset-y-0 left-2 flex items-center">
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-white/10 text-white hover:bg-white/20"
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
                  className="bg-white/10 text-white hover:bg-white/20"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);

  const businessPhoneDisplay = "(442) 888-4419";
  const businessPhoneHref = "tel:+14428884419";

  const handleBottomCallClick = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      window.location.href = businessPhoneHref;
    } else {
      setShowCallPopup(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-14 w-14 shrink-0 place-items-center md:h-16 md:w-16">
                <img src={logo} alt="True North Rising Logo" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm text-slate-600 md:text-base">True North Rising</div>
                <div className="-mt-0.5 text-xl font-semibold tracking-tight md:text-2xl">LLC</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex md:items-center md:gap-6">
                <a href="#about" className="text-sm text-slate-700 hover:text-slate-900">
                  About
                </a>
                <a href="#services" className="text-sm text-slate-700 hover:text-slate-900">
                  Services
                </a>
                <a href="#contact" className="text-sm text-slate-700 hover:text-slate-900">
                  Contact
                </a>
                <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">
                  Request a call
                </Button>
              </div>

              <Button className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 md:hidden">
                Call
              </Button>

              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 md:hidden"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="mt-3 rounded-2xl border border-slate-200/70 bg-white p-2 shadow-lg md:hidden">
              <a
                href="#about"
                className="block rounded-xl px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#services"
                className="block rounded-xl px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </a>
              <a
                href="#contact"
                className="block rounded-xl px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          )}
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pt-6 md:pt-8">
          <Carousel />
        </section>

        <section id="about" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">About</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Real support for lives of purpose and —
              <span className="bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">
                {" "}
                adventure{" "}
              </span>
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Personalized in-home support and community-based day programming designed to help people access the same
              everyday opportunities most of us take for granted.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              We provide personalized in-home support and community-based day programming designed to help people build
              meaningful routines, stronger independence, and fuller access to everyday life. Our approach is centered
              on dignity, purpose, connection, and the belief that everyone deserves the opportunity to live a rich and
              engaging life.
            </p>

            <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-full bg-sky-50 text-sky-700">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Dependable support</div>
                  <div className="text-sm text-slate-600">Consistent routines and thoughtful communication.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Real-life focus</div>
                  <div className="text-sm text-slate-600">Support built around daily life and participation.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-20 border-y border-slate-200/70 bg-slate-50/70">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Services</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">How we help</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
                Personalized services shaped around real needs, routines, and goals with thoughtful support tailored to
                each person’s daily life and independence.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-7 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sky-50 text-sky-700">
                    <Shield className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">In-home support</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Help with routines, structure, supervision, and independence-building in the home setting.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-7 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                    <Compass className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">Community access</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Outings, appointments, activities, and support that make everyday participation more possible.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-7 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-700">
                    <HeartHandshake className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">Tailored care</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Personalized support shaped around the individual’s goals, preferences, and daily needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-700">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">High standards</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Professional, consistent, and respectful support from start to finish.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-sky-700">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Privacy and respect</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Customer-first decisions, careful communication, and dignity in every interaction.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Real-life access</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Helping people do more of what matters in daily life, not just filling time.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="contact" className="scroll-mt-20 mx-auto max-w-6xl px-4 pb-14 md:pb-20">
          <Card className="overflow-hidden rounded-[28px]">
            <CardContent className="p-8 md:p-10">
              <div className="grid gap-8 md:grid-cols-[1.3fr_0.9fr] md:items-center">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Contact</div>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                    Let’s talk about the right support
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                    Reach out and share what kind of support you are looking for. We can help you figure out what makes
                    the most sense.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button
                      className="rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                      onClick={handleBottomCallClick}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                    <Button variant="outline" className="rounded-xl border-slate-300">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 p-4">
                    <Phone className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm text-slate-700">{businessPhoneDisplay}</span>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 p-4">
                    <Mail className="h-4 w-4 text-sky-700" />
                    <span className="text-sm text-slate-700">truenorthrisingsc@gmail.com</span>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 p-4">
                    <MapPin className="h-4 w-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Coastal Southern California</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-slate-200/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} True North Rising LLC. All rights reserved.</div>
          <div className="flex gap-3">
            <a className="hover:text-slate-700" href="#">
              Privacy
            </a>
            <a className="hover:text-slate-700" href="#">
              Terms
            </a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showCallPopup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCallPopup(false)}
          >
            <motion.div
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Call True North Rising"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Call Us</div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                    We’d love to hear from you
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCallPopup(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                Please give us a call at the number below. We’ll be happy to talk through your needs and answer any
                questions.
              </p>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <div className="text-sm text-slate-500">Business phone</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{businessPhoneDisplay}</div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={businessPhoneHref}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call from this device
                </a>

                <button
                  type="button"
                  onClick={() => setShowCallPopup(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
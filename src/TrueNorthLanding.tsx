import React, { useEffect, useMemo, useRef, useState } from "react";
//import logo from "./assets/transparent_logo_notext.png";
//import headerLogo from "./assets/trueNorthHeaderLogo.png";
import headerLogo from "./assets/newlogo_trans.png";
import beach from "./assets/beach.jpg";
import coconut from "./assets/coconut.jpg";
import erikChristmas from "./assets/erik_christmas.jpg";
import erikJake from "./assets/erik_jake.jpg";
import erikSail from "./assets/erik_sail.jpg";
import hotelJake from "./assets/hotel_jake.jpg";
import jakeKendall from "./assets/jake_kendall.png";
import kendall from "./assets/kendall.jpg";
import tower3 from "./assets/tower3.jpg";
import tower4 from "./assets/tower4.jpg";
import umbrella from "./assets/umbrella.jpg";
import tower6 from "./assets/tower6.jpg";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Shield,
  HeartHandshake,
  Route,
  //Luggage,
  //Mountain,
  //MapPinned,
  HouseHeart,
  Plane,
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
    "inline-flex items-center justify-center gap-2 select-none whitespace-nowrap rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-slate-600";

  const variants: Record<string, string> = {
    default: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
    outline:
      "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
  };

  const sizes: Record<string, string> = {
    default: "px-4 py-2",
    icon: "h-10 w-10 rounded-full p-0",
  };

  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}

function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 ${className}`}
      {...props}
    />
  );
}

function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}

const SAMPLE_IMAGES = [
  {
    src: beach,
    caption: "",
  },
  {
    src: coconut,
    caption: "",
  },
  {
    src: jakeKendall,
    caption: "",
  },
  {
    src: erikChristmas,
    caption: "",
  },
  {
    src: tower3,
    caption: "",
  },
  {
    src: kendall,
    caption: "",
  },
  {
    src: hotelJake,
    caption: "",
  },
  {
    src: umbrella,
    caption: "",
  },
  {
    src: tower4,
    caption: "",
  },
  {
    src: erikSail,
    caption: "",
  },
  {
    src: erikJake,
    caption: "",
  },
];

type InquiryFormData = {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  whoNeedsSupport: string;
  potentialCustomerName: string;
  servicesInterested: string[];
  preferredContactMethod: string;
  bestTimeToReach: string;
  situation: string;
  website: string;
};

const INITIAL_INQUIRY_FORM: InquiryFormData = {
  fullName: "",
  phone: "",
  email: "",
  location: "",
  whoNeedsSupport: "",
  potentialCustomerName: "",
  servicesInterested: [],
  preferredContactMethod: "",
  bestTimeToReach: "",
  situation: "",
  website: "",
};

const SERVICE_OPTIONS = [
  "In-home support",
  "Day program",
  "Community access",
  "Tailored care",
  "Not sure yet",
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

function Carousel({
  images = SAMPLE_IMAGES,
  onGetStarted,
}: {
  images?: { src: string; alt?: string; caption?: string }[];
  onGetStarted?: () => void;
}) {
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
        className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-slate-50 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative h-[280px] sm:h-[360px] md:h-[480px] lg:h-[560px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current?.src}
              className="absolute inset-0 h-full w-full"
              onClick={() => setExpanded(true)}
              role="button"
              tabIndex={0}
              aria-label="Open image"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setExpanded(true);
                }
              }}
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <img
                src={current?.src}
                alt={current?.alt || ""}
                className="h-full w-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/45 via-slate-950/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-3 text-left sm:p-4 md:p-10">
                <div className="max-w-[72%] sm:max-w-[65%] md:max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm dark:bg-slate-900/85 dark:text-slate-100 sm:px-3 sm:text-xs">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300 sm:h-4 sm:w-4" />
                    Customer Moments
                  </div>

                  <p className="mt-2 max-w-xs text-[11px] leading-4 text-white/90 sm:text-xs sm:leading-5 md:mt-3 md:max-w-xl md:text-base">
                    True North Rising provides dependable in-home and community-based support with dignity,
                    consistency, and real-life focus.
                  </p>

                  <div className="mt-3 flex max-w-[220px] flex-col gap-2 sm:max-w-none sm:flex-row md:mt-5 md:gap-3">
                    <Button
                      className="w-full rounded-xl bg-blue-500 text-white hover:bg-blue-400 dark:bg-blue-400 dark:text-slate-950 dark:hover:bg-blue-300 sm:w-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGetStarted?.();
                      }}
                    >
                      Get started
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 md:p-5">
            <div className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] text-slate-700 shadow-sm dark:bg-slate-900/85 dark:text-slate-100 sm:px-3 sm:py-1.5 sm:text-xs">
              {safeIndex + 1} / {images.length}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-2xl bg-white/85 hover:bg-white dark:bg-slate-900/85 dark:hover:bg-slate-800 md:h-10 md:w-10 md:rounded-full"
                onClick={goPrev}
                aria-label="Previous image"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-2xl bg-white/85 hover:bg-white dark:bg-slate-900/85 dark:hover:bg-slate-800 md:h-10 md:w-10 md:rounded-full"
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
                className="absolute right-3 top-3 z-20 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                onClick={() => setExpanded(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <img
                src={current?.src}
                alt={current?.alt || ""}
                className="max-h-[78vh] w-full object-contain bg-slate-950"
              />

              {(current?.caption || current?.alt) && (
                <div className="relative z-10 p-4 text-white/90">
                  <p className="text-sm font-medium md:text-base">{current?.caption || current?.alt}</p>
                </div>
              )}

              <div className="absolute inset-y-0 left-2 flex items-center">
                <Button
                  variant="secondary"
                  size="icon"
                  className="z-20 bg-white/10 text-white hover:bg-white/20"
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
                  className="z-20 bg-white/10 text-white hover:bg-white/20"
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

function ImageRevealSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);

  return (
    <section
      ref={sectionRef}
      aria-label="Coastal image scroll reveal"
      className="relative h-[120vh] min-h-[900px] bg-slate-950"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.img
          src={tower6}
          alt="tower 6"
          style={{ y: imageY }}
          className="absolute inset-x-0 top-0 h-[135vh] w-full object-cover object-top"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-slate-950/20" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="h-[14vh] bg-slate-950" />
          <div className="flex-1" />
          <div className="h-[14vh] bg-slate-950" />
        </div>
      </div>
    </section>
  );
}

export default function TrueNorthLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [showInquiryPopup, setShowInquiryPopup] = useState(false);
  const [inquiryForm, setInquiryForm] = useState<InquiryFormData>(INITIAL_INQUIRY_FORM);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  const businessPhoneDisplay = "(442) 888-4419";
  const businessPhoneHref = "tel:+14428884419";
  const businessEmailHref = "mailto:truenorthrisingsc@gmail.com?subject=True%20North%20Rising%20Inquiry";

  const handleCallClick = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      window.location.href = businessPhoneHref;
    } else {
      setShowCallPopup(true);
    }
  };

  const openInquiryPopup = () => {
    setFormError("");
    setFormSuccess("");
    setShowInquiryPopup(true);
  };

  const closeInquiryPopup = () => {
    if (isSubmittingInquiry) return;
    setShowInquiryPopup(false);
  };

  const updateInquiryField = (field: keyof InquiryFormData, value: string) => {
    setInquiryForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleServiceOption = (service: string) => {
    setInquiryForm((prev) => {
      const alreadySelected = prev.servicesInterested.includes(service);

      return {
        ...prev,
        servicesInterested: alreadySelected
          ? prev.servicesInterested.filter((item) => item !== service)
          : [...prev.servicesInterested, service],
      };
    });
  };

  const validateInquiryForm = () => {
    if (!inquiryForm.fullName.trim()) return "Please enter your name.";
    if (!inquiryForm.phone.trim()) return "Please enter a phone number.";
    if (!inquiryForm.email.trim()) return "Please enter an email address.";
    if (!inquiryForm.location.trim()) return "Please enter your city or location.";
    if (!inquiryForm.whoNeedsSupport.trim()) return "Please let us know who needs support.";
    if (!inquiryForm.preferredContactMethod.trim()) return "Please select a preferred contact method.";
    if (!inquiryForm.situation.trim()) return "Please share a little about your situation.";

    return "";
  };

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormError("");
    setFormSuccess("");

    const validationMessage = validateInquiryForm();
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    try {
      setIsSubmittingInquiry(true);

      const response = await fetch("/.netlify/functions/submit-intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryForm),
      });

      const rawText = await response.text();
      let data: any = {};

      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data?.message || `Request failed with status ${response.status}.`);
      }

      setFormSuccess("Thank you for reaching out. We received your information and will be in touch soon.");
      setInquiryForm(INITIAL_INQUIRY_FORM);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not send your request right now. Please try again or call us directly.";

      setFormError(message);
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-slate-950 text-slate-100 transition-colors">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <img
                src={headerLogo}
                alt="True North Rising"
                className="h-14 w-auto max-w-[200px] object-contain sm:h-16 sm:max-w-[230px] md:h-20 md:max-w-[290px] lg:h-24 lg:max-w-[340px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex md:items-center md:gap-6">
                <a
                  href="#about"
                  className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  About
                </a>
                <a
                  href="#services"
                  className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Services
                </a>
                <a
                  href="#contact"
                  className="text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Contact Us
                </a>
                {/* <Button
                  className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  onClick={handleCallClick}
                >
                  Call us
                </Button> */}
              </div>

              <Button
                className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white md:hidden"
                onClick={handleCallClick}
              >
                Call
              </Button>

              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 md:hidden"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="mt-3 rounded-2xl border border-slate-200/70 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900 md:hidden">
              <a
                href="#about"
                className="block rounded-xl px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#services"
                className="block rounded-xl px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </a>
              <a
                href="#contact"
                className="block rounded-xl px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
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
          <Carousel onGetStarted={openInquiryPopup} />
        </section>

        <section id="about" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">About</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
              Real Life Experiences for Lives of Purpose and
              <span className="bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent"> Adevnture</span>
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
              Our mission is to provide personalized in-home support and community-based programming that give individuals
              equal access to the everyday opportunities available to others. Our approach is rooted in dignity, purpose,
              and connection, and in the belief that everyone deserves the opportunity to live a meaningful and deeply
              fulfilling life.
            </p>

            <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Dependable support</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Through active listening and thoughtful observation, we create environments that reflect each
                    individual’s wants and needs so they can truly thrive.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Real-life Focus</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    We create meaningful everyday experiences centered on what brings individuals joy, laughter, and a
                    sense of belonging.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ImageRevealSection />

        <section id="services" className="scroll-mt-20 border-y border-slate-800 bg-slate-950 transition-colors">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">Services</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
                How We Help
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">
                Personalized services shaped around real needs, routines, and goals with thoughtful support tailored to
                each person’s daily life and independence.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-7 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Route className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-slate-100">Community Access</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    We structure a tailored day program and hands-on community activities that reflect each persons interests,
                    strengths, and goals. By building strong partnerships with local vendors, we open the door to
                    opportunites to be part of real-world experiences that feel meanginful; not routine. The result is a
                    more independent, self-directed life rooted in choice, connection, and contribution.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-7 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <HouseHeart className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-slate-100">In-Home Support</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    We provide personalized in-home support that helps build routines, encourage independence, and meet each
                    individual’s goals, preferences, and daily needs. Our approach is thoughtful and individualized,
                    helping each person build confidence, grow in independence, and feel supported in everyday life.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-7 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                  
                    <Plane className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-slate-100">Adventure</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    We work closely with our consumers to create accessible and enriching travel experiences through
                    thoughtful planning and personalized support. Our services include day trips to amusement parks and
                    attractions, overnight staycations, and air or road travel for seasonal adventures such as skiing,
                    deep-sea fishing, scenic tours, and visits to national monuments. We are committed to making
                    adventure and travel more accessible so our consumers can enjoy the same experiences and opportunities
                    as others.
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
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">High Standards</div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Professional, consistent, and respectful support from start to finish.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Privacy and Respect</div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Customer-first decisions, careful communication, and dignity in every interaction.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Real-life Access</div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
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
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">Contact</div>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    Let’s Talk About the Right Support
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                    Reach out and share what kind of support you are looking for. We can help you figure out what makes
                    the most sense.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button
                      className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                      onClick={openInquiryPopup}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get started
                    </Button>

                    <Button
                      className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                      onClick={handleCallClick}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>

                    <a
                      href={businessEmailHref}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 p-4 transition-colors dark:border-slate-800 dark:bg-slate-900/70">
                    <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                    <span className="text-sm text-slate-700 dark:text-slate-200">{businessPhoneDisplay}</span>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 p-4 transition-colors dark:border-slate-800 dark:bg-slate-900/70">
                    <Mail className="h-4 w-4 text-sky-700 dark:text-sky-300" />
                    <span className="text-sm text-slate-700 dark:text-slate-200">truenorthrisingsc@gmail.com</span>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 p-4 transition-colors dark:border-slate-800 dark:bg-slate-900/70">
                    <MapPin className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    <span className="text-sm text-slate-700 dark:text-slate-200">Coastal Southern California</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-slate-200/70 transition-colors dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} True North Rising LLC. All rights reserved.</div>
          <div className="flex gap-3">
            <a className="hover:text-slate-700 dark:hover:text-slate-200" href="#">
              Privacy
            </a>
            <a className="hover:text-slate-700 dark:hover:text-slate-200" href="#">
              Terms
            </a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showInquiryPopup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeInquiryPopup}
          >
            <motion.div
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl transition-colors dark:bg-slate-900 md:p-8"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Tell us about your needs"
            >
              <div className="flex items-start justify-between gap-4">
                {!formSuccess ? (
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
                      Get Started
                    </div>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                      Tell us about your needs
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Share a little about your needs and we’ll reach out to learn how we can help.
                    </p>
                  </div>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={closeInquiryPopup}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  aria-label="Close"
                  disabled={isSubmittingInquiry}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formSuccess ? (
                <div className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/70 dark:bg-emerald-950/30">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                    <div>
                      <div className="font-semibold text-emerald-900 dark:text-emerald-200">Request received</div>
                      <p className="mt-1 text-sm leading-6 text-emerald-800 dark:text-emerald-300">{formSuccess}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Button
                      type="button"
                      className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                      onClick={closeInquiryPopup}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <form className="mt-6" onSubmit={handleInquirySubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Full name *</label>
                      <input
                        type="text"
                        value={inquiryForm.fullName}
                        onChange={(e) => updateInquiryField("fullName", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Phone number *</label>
                      <input
                        type="tel"
                        value={inquiryForm.phone}
                        onChange={(e) => updateInquiryField("phone", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                        placeholder="(555) 555-5555"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email *</label>
                      <input
                        type="email"
                        value={inquiryForm.email}
                        onChange={(e) => updateInquiryField("email", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">City / location *</label>
                      <input
                        type="text"
                        value={inquiryForm.location}
                        onChange={(e) => updateInquiryField("location", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                        placeholder="City, area, or region"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Who needs support? *</label>
                      <select
                        value={inquiryForm.whoNeedsSupport}
                        onChange={(e) => updateInquiryField("whoNeedsSupport", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                      >
                        <option value="">Select one</option>
                        <option value="Self">Self</option>
                        <option value="Child">Child</option>
                        <option value="Adult family member">Adult family member</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Potential customer name</label>
                      <input
                        type="text"
                        value={inquiryForm.potentialCustomerName}
                        onChange={(e) => updateInquiryField("potentialCustomerName", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Preferred contact method *
                      </label>
                      <select
                        value={inquiryForm.preferredContactMethod}
                        onChange={(e) => updateInquiryField("preferredContactMethod", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                      >
                        <option value="">Select one</option>
                        <option value="Call">Call</option>
                        <option value="Text">Text</option>
                        <option value="Email">Email</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Best time to reach you</label>
                      <input
                        type="text"
                        value={inquiryForm.bestTimeToReach}
                        onChange={(e) => updateInquiryField("bestTimeToReach", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                        placeholder="Morning, afternoons, weekdays, etc."
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-200">Services of interest</label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {SERVICE_OPTIONS.map((service) => {
                        const checked = inquiryForm.servicesInterested.includes(service);

                        return (
                          <label
                            key={service}
                            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleServiceOption(service)}
                              className="h-4 w-4 rounded border-slate-300"
                            />
                            <span>{service}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Tell us about your situation *
                    </label>
                    <textarea
                      value={inquiryForm.situation}
                      onChange={(e) => updateInquiryField("situation", e.target.value)}
                      rows={5}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                      placeholder="Share a little about the kind of support you are looking for."
                    />
                  </div>

                  <div className="hidden">
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={inquiryForm.website}
                      onChange={(e) => updateInquiryField("website", e.target.value)}
                    />
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                    <div className="flex items-start gap-3">
                      <Shield className="mt-0.5 h-5 w-5 text-slate-600 dark:text-slate-300" />
                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                        For your privacy, please do not include Social Security numbers, insurance details, medical
                        diagnoses, or other highly sensitive personal information in this form.
                      </p>
                    </div>
                  </div>

                  {formError && (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-300">
                      {formError}
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="submit"
                      className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                      disabled={isSubmittingInquiry}
                    >
                      {isSubmittingInquiry ? "Sending..." : "Submit"}
                    </Button>

                    <button
                      type="button"
                      onClick={closeInquiryPopup}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                      disabled={isSubmittingInquiry}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl transition-colors dark:bg-slate-900"
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
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Call Us</div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    We’d love to hear from you
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCallPopup(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Please give us a call at the number below. We’ll be happy to talk through your needs and answer any
                questions.
              </p>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800/70">
                <div className="text-sm text-slate-500 dark:text-slate-400">Business phone</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{businessPhoneDisplay}</div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={businessPhoneHref}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call from this device
                </a>

                <button
                  type="button"
                  onClick={() => setShowCallPopup(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
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
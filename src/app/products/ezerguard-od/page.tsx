"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  Volume2,
  Hand,
  Zap,
  Syringe,
  Activity,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface PageImage {
  page: string;
  image_key: string;
  image_url: string | null;
}

const stats = [
  { value: "81,000+", label: "Opioid overdose deaths in the US (2023, CDC)" },
  { value: "69-75%", label: "Overdose deaths where the user was alone" },
  {
    value: "Rising",
    label: "Synthetic opioids like fentanyl in street drugs",
  },
  { value: "50 States", label: "Naloxone available without prescription" },
];

const steps = [
  {
    icon: Hand,
    title: "Device Activation",
    description:
      "The drug user places the EzerGuard-OD device on the forearm and turns it on prior to drug use.",
    imageKey: "od_step_0",
    detail: "Audio instructions are given. Drug user choses mode of operation.",
  },
  {
    icon: Volume2,
    title: "Audio Alarm Monitoring",
    description: "Audio alarm sounds every 90 seconds.",
    imageKey: "od_step_1",
    detail:
      "If user is conscious- presses respond button. Device reset for audio alarm every 90 seconds.",
  },
  {
    icon: Zap,
    title: "Mild Electrical Stimulation",
    description:
      "If user does not respond to audio alarm a mild electric shock is given. If after the shock the presses respond, the device is reset to audio alarms. If there is not a response in 30 seconds a more intense electric shock is given.",
    imageKey: "od_step_2",
    detail: "",
  },
  {
    icon: Syringe,
    title: "First Naloxone Dose",
    description:
      "If the user does not respond to the second more intense shock in 30 seconds, the first naloxone is given.",
    imageKey: "od_step_3",
    detail: "",
  },
  {
    icon: Activity,
    title: "Sustained Stimulation",
    description:
      "The device delivers an electric shock every 45 seconds to stimulate spontaneous respiration until naloxone has taken effect (4 min). The device can be turned off by the user if consciousness is regained.",
    imageKey: "od_step_4",
    detail: "",
  },
  {
    icon: Syringe,
    title: "Second Dose If Needed",
    description:
      "If after 4 minutes the user is still unresponsive, a second dose of naloxone is administered and electric shocks is applied every 40 seconds.",
    imageKey: "od_step_5",
    detail: "",
  },
];

export default function EzerGuardODPage() {
  const statsRef = useRef(null);
  const stepsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const stepsInView = useInView(stepsRef, { once: true, margin: "-100px" });
  const [stepImages, setStepImages] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/page-images?page=ezerguard-od")
      .then((res) => res.json())
      .then((data) => {
        const map: Record<string, string> = {};
        (data.images || []).forEach((img: PageImage) => {
          if (img.image_url) map[img.image_key] = img.image_url;
        });
        setStepImages(map);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero pt-36 pb-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-heading text-sm mb-8"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="accent-line" />
                <span className="font-heading text-xs font-semibold text-brand-secondary uppercase tracking-[0.2em]">
                  Opioid Overdose Response
                </span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                EzerGuard-OD
              </h1>
              <p className="mt-6 font-body text-lg text-white/60 leading-relaxed max-w-2xl">
                Explore our vision for to deliver the opioid overdose antidote- naloxone during a drug overdose.
              </p>
              <p className="mt-3 font-body text-lg text-white/60 leading-relaxed max-w-2xl">
                Discover our plan to provide naloxone in cases of opioid overdose.
              </p>
            </motion.div>
          </div>
          <div className="hero-feather" />
        </section>

        {/* The Crisis - Stats */}
        <section className="py-16 lg:py-20 bg-brand-bg" ref={statsRef}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mb-10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="accent-line" />
                <span className="font-heading text-xs font-semibold text-brand-secondary uppercase tracking-[0.2em]">
                  The Crisis
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-dark leading-tight">
                Narcotic Overdose: A National Emergency
              </h2>
              <div className="mt-6 space-y-4 font-body text-base text-brand-text-muted leading-relaxed">
                <p>
                  Narcotic overdose deaths in the US surpasses deaths due to auto accidents and firearms.
                </p>
                <p>
                  In the US, there were over 81,000 deaths due opioid overdose in 2023 (CDC statistics) 69-75% of drug overdose death occurred in situations where the drug user was alone.
                </p>
                <p>
                  New highly potent synthetic opioids such as fentanyl are being found in street drugs.
                </p>
                <p>
                  Naloxone rapidly reverses the effects of all opioids and is available without a prescription in all 50 States.
                </p>
              </div>
            </motion.div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                  className="glass-card rounded-2xl p-6 text-center"
                >
                  <div className="font-display text-3xl font-bold text-brand-secondary">
                    {stat.value}
                  </div>
                  <div className="mt-2 font-body text-sm text-brand-text-muted">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Alert callout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 glass-card-alert rounded-2xl p-6 flex items-start gap-4"
            >
              <AlertTriangle
                size={24}
                className="text-red-500 mt-0.5 shrink-0"
              />
              <div>
                <h4 className="font-heading font-semibold text-red-900">
                  The Critical Gap
                </h4>
                <p className="mt-1 font-body text-sm text-red-700">
                  The naloxone nasal spray system requires conscious self-administration or delivery by a bystander.
                </p>
              </div>
            </motion.div>

            {/* Cell phone interaction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 glass-card rounded-2xl p-6"
            >
              <p className="font-body text-base text-brand-text-muted leading-relaxed">
                The EzerGuard-OD system has operational modes and can interact with a cell phone app.
              </p>
            </motion.div>
          </div>
        </section>

        {/* How It Works - Step by Step */}
        <section className="py-16 lg:py-20 gradient-dark text-white" ref={stepsRef}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={stepsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="accent-line" />
                <span className="font-heading text-xs font-semibold text-brand-secondary uppercase tracking-[0.2em]">
                  How It Works
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Intelligent Escalation Protocol
              </h2>
            </motion.div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-secondary/40 via-brand-secondary/20 to-transparent hidden lg:block" />

              <div className="space-y-6">
                {steps.map((step, i) => {
                  const hasImage = stepImages[step.imageKey];

                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={stepsInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                      className="relative flex gap-6 lg:gap-8 items-start"
                    >
                      {/* Step icon */}
                      <div className="relative z-10 w-16 h-16 rounded-2xl glass-icon flex items-center justify-center shrink-0">
                        <step.icon size={24} className="text-brand-secondary" />
                      </div>

                      {/* Content */}
                      <div className="glass-card-dark rounded-2xl p-6 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-display text-xs font-bold text-brand-secondary/60">
                            STEP {i + 1}
                          </span>
                        </div>
                        <h3 className="font-heading text-lg font-semibold">
                          {step.title}
                        </h3>
                        <p className="mt-2 font-body text-sm text-white/50 leading-relaxed">
                          {step.description}
                        </p>
                        {step.detail && (
                          <p className="mt-2 font-body text-sm text-white/40 leading-relaxed">
                            {step.detail}
                          </p>
                        )}

                        {/* Only show image area if an image has been uploaded */}
                        {hasImage && (
                          <div className="mt-4 rounded-xl overflow-hidden aspect-[16/9]">
                            <img
                              src={hasImage}
                              alt={step.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-brand-bg">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark">
              Help Us Save Lives
            </h2>
            <p className="mt-4 font-body text-brand-text-muted max-w-xl mx-auto">
              The EzerGuard-OD represents a paradigm shift in overdose response.
              Join us in bringing this technology to those who need it most.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/#contact"
                className="rounded-full bg-brand-secondary px-8 py-3.5 font-heading font-semibold text-white hover:bg-brand-primary transition-all"
              >
                Investment Opportunities
              </a>
              <Link
                href="/products/ezerguard-military"
                className="rounded-full border border-brand-dark/20 px-8 py-3.5 font-heading font-semibold text-brand-dark hover:bg-brand-dark/5 transition-all inline-flex items-center gap-2"
              >
                Next: EzerGuard-Military
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

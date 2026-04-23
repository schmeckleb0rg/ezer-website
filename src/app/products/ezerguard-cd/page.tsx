"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowLeft,
  Users,
  Smartphone,
  MapPin,
  Bell,
  Zap,
  Syringe,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

const howItWorks = [
  {
    icon: Bell,
    title: "Civil Defense Alert",
    description:
      "Civil defense agencies and Home Front Commands already have established systems to communicate using cell phones with civilian populations to seek shelter from conventional missiles and rockets. If there is a possibility of a chemical weapon being used, the population is altered to don the EzerGuard-CD and set the device for either nerve agent of opioid aerosols.",
  },
  {
    icon: Users,
    title: "Device Configuration",
    description:
      "The wearer activates the device and sets it for either nerve agent or opioid aerosol mode, based on the threat communicated by authorities.",
  },
  {
    icon: Bell,
    title: "Auditory/Vibratory Monitoring",
    description:
      "Similar to the military device, the wearer receives auditory/vibratory signals. A response is required to this alarm.",
  },
  {
    icon: Zap,
    title: "Electrical Stimulation",
    description:
      "If no reponse, an electric stimulation is administered.",
  },
  {
    icon: Syringe,
    title: "Antidote Delivery",
    description:
      "Only if there is no response (due to the wearer being incapacitated) the appropriate antidote is delivered.",
  },
  {
    icon: Smartphone,
    title: "Location & Communication",
    description:
      "The device communicates with wear\u2019s cell phone that the device has been activated and the location of the wearer via GPS.",
  },
];

export default function EzerGuardCDPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero pt-36 pb-20">
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
                  Civilian Chemical Defense
                </span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                EzerGuard-CD
              </h1>
              <p className="mt-6 font-body text-lg text-white/60 leading-relaxed max-w-2xl">
                EzerGuard-CD is a wearable device designed for the civilian population to deliver antidotes for both nerve agents or aerosolized narcotics.
              </p>
              <p className="mt-3 font-body text-lg text-white/60 leading-relaxed max-w-2xl">
                Explore our vision for a wearable to be worn by civilians in situations where they may be targets of chemical warfare.
              </p>
              <p className="mt-3 font-body text-lg text-white/60 leading-relaxed max-w-2xl">
                Explore our vision for a wearable device to be worn by civilians to deliver antidotes for chemical warfare agents.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Context */}
        <section className="py-24 bg-brand-bg">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="accent-line" />
                  <span className="font-heading text-xs font-semibold text-brand-secondary uppercase tracking-[0.2em]">
                    Civilian Protection
                  </span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-dark leading-tight">
                  Chemical Threats Are Not Limited to the Battlefield
                </h2>
                <div className="mt-6 space-y-4 font-body text-base text-brand-text-muted leading-relaxed">
                  <p>
                    Not only is the solider on the battlefield a potential target for chemical warfare. The civilian population can be victims.
                  </p>
                  <p>
                    Our vision is a wearable device similar to EzerGuard-Military but for the civilian population. Civil defense agencies and Home Front Commands already have established systems to communicate using cell phones with civilian populations to seek shelter from conventional missiles and rockets. If there is a possibility of a chemical weapon being used, the population is altered to don the EzerGuard-CD and set the device for either nerve agent of opioid aerosols.
                  </p>
                  <p>
                    Similar to the military device, the wearer receives auditory/vibratory signals. A response is required to this alarm. If no reponse, an electric stimulation is administered. Only if there is no response (due to the wearer being incapacitated) the appropriate antidote is delivered.
                  </p>
                  <p>
                    The device communicates with wear&apos;s cell phone that the device has been activated and the location of the wearer via GPS.
                  </p>
                </div>
              </div>

              {/* Image placeholder */}
              <div className="media-zone aspect-[4/3]">
                <ImageIcon size={40} className="text-brand-secondary/25" />
                <span className="font-heading text-sm text-brand-dark/30">
                  EzerGuard-CD Device Image
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 gradient-dark text-white" ref={ref}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="accent-line" />
                <span className="font-heading text-xs font-semibold text-brand-secondary uppercase tracking-[0.2em]">
                  How It Works
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Civilian Defense Protocol
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {howItWorks.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className="glass rounded-2xl p-8 relative"
                >
                  <span className="absolute top-4 right-4 font-display text-3xl font-bold text-brand-secondary/10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-brand-secondary/20 flex items-center justify-center">
                    <step.icon size={20} className="text-brand-secondary" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-body text-sm text-white/50 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Differentiators */}
        <section className="py-20 bg-brand-bg">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-2xl border border-brand-light bg-white p-8 text-center">
                <MapPin
                  size={32}
                  className="text-brand-secondary mx-auto mb-4"
                />
                <h3 className="font-heading font-semibold text-brand-dark">
                  GPS Location
                </h3>
                <p className="mt-2 font-body text-sm text-brand-text-muted">
                  Automatic GPS transmission to emergency services upon device
                  activation
                </p>
              </div>
              <div className="rounded-2xl border border-brand-light bg-white p-8 text-center">
                <Smartphone
                  size={32}
                  className="text-brand-secondary mx-auto mb-4"
                />
                <h3 className="font-heading font-semibold text-brand-dark">
                  Cell Phone Integration
                </h3>
                <p className="mt-2 font-body text-sm text-brand-text-muted">
                  Communicates with the wearer&apos;s phone and civil defense alert
                  systems
                </p>
              </div>
              <div className="rounded-2xl border border-brand-light bg-white p-8 text-center">
                <Users
                  size={32}
                  className="text-brand-secondary mx-auto mb-4"
                />
                <h3 className="font-heading font-semibold text-brand-dark">
                  Civilian Optimized
                </h3>
                <p className="mt-2 font-body text-sm text-brand-text-muted">
                  Designed for ease of use by the general population with simple
                  setup
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark">
                Protecting Civilian Populations
              </h2>
              <p className="mt-4 font-body text-brand-text-muted max-w-xl mx-auto">
                EzerGuard-CD brings military-grade chemical defense to the
                civilian population. Be part of the solution.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/#contact"
                  className="rounded-full bg-brand-secondary px-8 py-3.5 font-heading font-semibold text-white hover:bg-brand-primary transition-all"
                >
                  Investment Opportunities
                </a>
                <Link
                  href="/products/ezerguard-od"
                  className="rounded-full border border-brand-dark/20 px-8 py-3.5 font-heading font-semibold text-brand-dark hover:bg-brand-dark/5 transition-all"
                >
                  See EzerGuard-OD →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

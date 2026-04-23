"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Activity, Cpu, Smartphone, ShieldCheck } from "lucide-react";

const techSteps = [
  {
    icon: Activity,
    step: "01",
    title: "Detection & Monitoring",
    description:
      "Continuous biometric and environmental monitoring detects potential emergencies through sensor arrays and connected systems.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Verification Protocol",
    description:
      "Multi-stage alert system with audio, tactile, and electrical stimulation verifies the wearer's state of consciousness before acting.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Autonomous Delivery",
    description:
      "If the wearer is confirmed unresponsive, the device automatically delivers the appropriate antidote — naloxone or nerve agent treatment.",
  },
  {
    icon: Smartphone,
    step: "04",
    title: "Connected Response",
    description:
      "The device communicates with smartphones and command systems, notifying emergency services and transmitting GPS location.",
  },
];

export default function TechnologySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="technology"
      className="relative py-20 lg:py-28 gradient-dark text-white overflow-hidden"
      ref={ref}
    >
      {/* Decorative glass orbs */}
      <div className="glass-orb glass-orb-dark w-[350px] h-[350px] top-20 -right-32 animate-float-slow" />
      <div className="glass-orb glass-orb-dark w-[200px] h-[200px] bottom-40 left-10 animate-float-slow" style={{ animationDelay: '-6s' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="accent-line" />
              <span className="font-heading text-xs font-semibold text-brand-secondary uppercase tracking-[0.2em]">
                How It Works
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
            >
              Intelligent Wearable
              <br />
              Drug{" "}
              <span className="text-brand-secondary">Delivery</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-body text-lg text-white/40 leading-relaxed lg:pb-2"
          >
            Our technology uses wearable devices and interactive software to
            provide lifesaving medications in emergency situations. Discover our
            innovative solutions that deliver life saving medications via
            wearable devices.
          </motion.p>
        </div>

        {/* Steps — glass cards in a 2-col grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {techSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
              className="glass-card-dark rounded-2xl p-8 group"
            >
              <div className="flex items-start gap-6">
                <div className="shrink-0">
                  <div className="step-number">
                    {step.step}
                  </div>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-lg glass-icon flex items-center justify-center mb-4">
                    <step.icon size={20} className="text-brand-secondary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-body text-sm text-white/40 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

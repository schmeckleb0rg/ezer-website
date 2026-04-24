"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Image as ImageIcon, GraduationCap } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo_url: string | null;
  sort_order: number;
}

interface Credential {
  degree: string;
  institution: string;
  year?: string;
}

interface ParsedMember {
  raw: TeamMember;
  specialty?: string;
  credentials: Credential[];
}

function parseCredentials(member: TeamMember): ParsedMember {
  const bio = member.bio || "";
  const lines = bio.split("\n").filter(Boolean);
  return {
    raw: member,
    credentials: lines.map((line) => {
      const parts = line.split(" — ");
      if (parts.length >= 2) {
        return { degree: parts[0].trim(), institution: parts.slice(1).join(" — ").trim() };
      }
      return { degree: "", institution: line };
    }),
  };
}

const fallbackMembers: TeamMember[] = [
  {
    id: "1",
    name: "Irving Kaplan, MD",
    title: "CEO",
    bio: "Radiation Oncologist — Harvard Medical School\nMD — Stanford University Medical School\nBS — University of Rochester",
    photo_url: null,
    sort_order: 1,
  },
  {
    id: "2",
    name: "Howie Zaretsky, BEE, MSEE, JD",
    title: "CTO, CIPO",
    bio: "JD — Brooklyn Law School (1994)\nMSEE — Polytechnic University of New York (1987)\nBEE — SUNY at Stony Brook (1983)",
    photo_url: null,
    sort_order: 2,
  },
  {
    id: "3",
    name: "Ed Holpuka, PhD",
    title: "CSO",
    bio: "PhD, Physics — Brown University\nMA, Mathematics — Boston University\nBS — Clark University",
    photo_url: null,
    sort_order: 3,
  },
];

export default function TeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [members, setMembers] = useState<TeamMember[]>(fallbackMembers);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        if (data.members && data.members.length > 0) {
          setMembers(data.members);
        }
      })
      .catch(() => {});
  }, []);

  const parsed = members.map(parseCredentials);

  return (
    <section id="team" className="relative py-20 lg:py-28 bg-brand-bg overflow-hidden" ref={ref}>
      {/* Decorative glass orbs */}
      <div className="glass-orb w-[250px] h-[250px] top-20 right-10 animate-float-slow" style={{ animationDelay: '-3s' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="accent-line" />
          <span className="font-heading text-xs font-semibold text-brand-secondary uppercase tracking-[0.2em]">
            Our Team
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-brand-dark leading-[1.05] tracking-tight"
          >
            The People Behind{" "}
            <span className="text-brand-secondary">Ezer</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-body text-lg text-brand-text-muted leading-relaxed lg:pb-2"
          >
            Our team brings together expertise in medical devices, software
            engineering, military systems, and regulatory affairs to deliver
            life-saving wearable technology.
          </motion.p>
        </div>

        {/* Team Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${parsed.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-10`}>
          {parsed.map((member, i) => (
            <motion.div
              key={member.raw.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
              className="group"
            >
              {/* Photo with glass effect */}
              <div className="aspect-[3/4] mb-6 rounded-2xl overflow-hidden glass-card">
                {member.raw.photo_url ? (
                  <img
                    src={member.raw.photo_url}
                    alt={member.raw.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="media-zone w-full h-full group-hover:border-brand-secondary/50 transition-colors rounded-2xl">
                    <ImageIcon size={32} className="text-brand-secondary/25" />
                    <span className="font-heading text-xs text-brand-dark/25 tracking-wide">
                      Headshot Photo
                    </span>
                  </div>
                )}
              </div>

              {/* Name & Title */}
              <h3 className="font-heading text-lg font-semibold text-brand-dark">
                {member.raw.name}
              </h3>
              <p className="mt-1 font-heading text-sm font-medium text-brand-secondary">
                {member.raw.title}
              </p>

              {/* Credentials */}
              {member.credentials.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {member.credentials.map((cred, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <GraduationCap size={13} className="text-brand-secondary/50 mt-0.5 shrink-0" />
                      <span className="font-body text-xs text-brand-text-muted leading-snug">
                        {cred.degree && (
                          <span className="font-heading font-semibold text-brand-dark/70">
                            {cred.degree}
                          </span>
                        )}
                        {cred.degree && " — "}
                        {cred.institution}
                        {cred.year && (
                          <span className="text-brand-text-muted/60"> ({cred.year})</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

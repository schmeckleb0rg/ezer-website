"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Image as ImageIcon, GraduationCap, Briefcase } from "lucide-react";

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
  const name = member.name;
  const bio = member.bio || "";

  if (name.includes("Kaplan")) {
    return {
      raw: member,
      specialty: "Radiation Oncologist, Harvard Medical School",
      credentials: [
        { degree: "MD", institution: "Stanford University Medical School" },
        { degree: "BS", institution: "University of Rochester" },
      ],
    };
  }

  if (name.includes("Zaretsky")) {
    return {
      raw: member,
      credentials: [
        { degree: "JD", institution: "Brooklyn Law School", year: "1994" },
        { degree: "MSEE", institution: "Polytechnic University of New York", year: "1987" },
        { degree: "BEE", institution: "SUNY at Stony Brook", year: "1983" },
      ],
    };
  }

  if (name.includes("Holpuka")) {
    return {
      raw: member,
      credentials: [
        { degree: "PhD, Physics", institution: "Brown University" },
        { degree: "MA, Mathematics", institution: "Boston University" },
        { degree: "BS", institution: "Clark University" },
      ],
    };
  }

  const lines = bio.split("\n").filter(Boolean);
  return {
    raw: member,
    credentials: lines.map((line) => ({ degree: "", institution: line })),
  };
}

const fallbackMembers: TeamMember[] = [
  {
    id: "1",
    name: "Irving Kaplan, MD",
    title: "CEO",
    bio: "Radiation Oncologist - Harvard Medical School\nEducation: undergrad- University of Rochester\nMD- Stanford University Medical School",
    photo_url: null,
    sort_order: 1,
  },
  {
    id: "2",
    name: "Howie Zaretsky, BEE, MSEE, JD",
    title: "CTO, CIPO",
    bio: "Brooklyn Law School (JD, 1994)\nPolytechnic University of New York (MSEE, 1987)\nState University of New York (SUNY) at Stony Brook (BEE, 1983)",
    photo_url: null,
    sort_order: 2,
  },
  {
    id: "3",
    name: "Ed Holpuka, PhD",
    title: "CSO",
    bio: "PhD Physics (Brown)\nMA in Mathematics (Boston University) Undergrad (Clark University)",
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

              {/* Specialty if present */}
              {member.specialty && (
                <div className="mt-3 flex items-start gap-2">
                  <Briefcase size={13} className="text-brand-dark/30 mt-0.5 shrink-0" />
                  <span className="font-body text-xs text-brand-dark/70 leading-snug">
                    {member.specialty}
                  </span>
                </div>
              )}

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

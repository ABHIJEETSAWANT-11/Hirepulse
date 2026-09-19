import React from "react";
import { motion } from "framer-motion";
import { Brain, FileSearch, Target, MessageSquare, CalendarCheck, Rocket, FolderKanban, Timer } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Interview Coach",
    description: "Real-time feedback on speech, clarity, and confidence",
  },
  {
    icon: FileSearch,
    title: "ATS Resume Scoring",
    description: "Instant compatibility score with skill-gap analysis",
  },
  {
    icon: Target,
    title: "Smart Job Matching",
    description: "Curated openings that fit your profile and goals",
  },
  {
    icon: MessageSquare,
    title: "Mock Interviews",
    description: "Unlimited practice with contextual follow-up questions",
  },
  {
    icon: CalendarCheck,
    title: "Interview Scheduler",
    description: "Keep track of every round and preparation session",
  },
  {
    icon: Rocket,
    title: "Placement Prep",
    description: "Structured DSA paths and aptitude training built in",
  },
  {
    icon: FolderKanban,
    title: "Application Tracker",
    description: "One board for every application and its status",
  },
  {
    icon: Timer,
    title: "Daily Goals",
    description: "Personalized targets that keep your prep on pace",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-24 bg-slate relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-ink">
            Everything you need to <span className="text-primary">succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features tailored to streamline your placement journey and interview preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm hover:border-primary/50 transition-all duration-300 group"
              whileHover={{
                y: -5,
                boxShadow: "0 20px 40px -15px rgba(119, 167, 25, 0.25)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.05,
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <div className="mb-4 p-3 bg-primary-tint rounded-xl inline-block text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-heading text-ink">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;

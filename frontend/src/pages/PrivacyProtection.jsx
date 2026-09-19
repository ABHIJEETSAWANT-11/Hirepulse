import React from "react";
import { motion } from "framer-motion";
import { FaLock, FaShieldAlt, FaUserSecret } from "react-icons/fa";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const backgroundData = [
  "fSdD2iui", "8dkFaZ4H", "gGxT3zkf", "x6t9wpR", "PuUKgx9c", "FiM5dhXzW", "WDPvDCBG",
  "QztXTafcF", "gGzot4rF", "NaOt7yWVD", "LrkBMa6gS", "OqlilAo9w", "xKxv9tHW", "QuT2rkF",
  "5kKx+FSJ", "vZw4Tf3E", "F1kaf12Ij", "1FQ2+x48", "8vepZkY", "O6k5FHz9", "mP1+suK",
  "NA6TY0wcE", "qqW6dY2", "FiM5dhXzW", "YDDves2RE", "Tf3Em", "QztXTafcF", "PuUKgx9c"
];

const glowWords = backgroundData.map((text, i) => (
  <motion.span
    key={i}
    className="text-xs text-primary/20 font-mono select-none px-1"
    animate={{ opacity: [0.1, 0.4, 0.1], y: [0, -2, 0] }}
    transition={{
      repeat: Infinity,
      repeatType: "loop",
      duration: 3 + Math.random() * 2,
      delay: i * 0.02,
    }}
  >
    {text}
  </motion.span>
));

const particlesInit = async (engine) => {
  await loadSlim(engine);
};

const PrivacyProtection = () => {
  return (
    <section className="relative min-h-[600px] bg-ink flex flex-col items-center justify-center text-white overflow-hidden px-6 py-20">

      {/* 3D Grid Effect */}
      <div className="absolute inset-0 z-0 perspective-[1000px] overflow-hidden opacity-30">
        <div className="absolute bottom-0 w-full h-[500px] [transform-style:preserve-3d] animate-gridWave">
          <div className="w-full h-full bg-[linear-gradient(to_right,hsl(var(--primary))_1px,transparent_1px),linear-gradient(to_top,hsl(var(--primary))_1px,transparent_1px)] bg-[size:40px_40px] scale-150 blur-[1px] opacity-20" />
        </div>
      </div>

      {/* Particle Effect */}
      <div className="absolute inset-0 z-0 opacity-40">
        <ParticlesProvider init={particlesInit}>
        <Particles
          id="tsparticles"
          className="absolute inset-0"
          options={{
            fullScreen: false,
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            interactivity: {
              events: { onHover: { enable: true, mode: "repulse" }, resize: true },
              modes: { repulse: { distance: 100 } },
            },
            particles: {
              color: { value: "#77A719" }, // HireFlow olive
              links: {
                color: "#77A719",
                distance: 120,
                enable: true,
                opacity: 0.2,
                width: 1,
              },
              move: { enable: true, speed: 0.5, direction: "none", outMode: "bounce" },
              number: { value: 40 },
              opacity: { value: 0.3 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 2 } },
            },
            detectRetina: true,
          }}
        />
        </ParticlesProvider>
      </div>

      {/* Floating glow text */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-wrap items-center justify-center text-center blur-sm z-10 pointer-events-none opacity-50">
        {glowWords}
      </div>

      <div className="relative z-20 max-w-4xl mx-auto text-center">
        {/* Lock icon */}
        <motion.div
          className="flex justify-extreme-center mb-6"
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-primary/20 p-6 rounded-full ring-1 ring-primary/50 shadow-[0_0_50px_rgba(119,167,25,0.4)] mx-auto">
            <FaLock className="text-primary text-5xl" />
          </div>
        </motion.div>

        {/* Tag */}
        <motion.div
          className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-sm text-primary font-medium mb-6 border border-primary/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <FaShieldAlt className="text-xs" /> Enterprise-Grade Security
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Privacy By Design
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-center text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          Your data is end-to-end encrypted. We prioritize your anonymity and data protection, ensuring that your interview practice remains confidential.
        </motion.p>
      </div>
    </section>
  );
};

export default PrivacyProtection;

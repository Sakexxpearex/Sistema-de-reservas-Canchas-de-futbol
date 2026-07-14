import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="relative h-[420px] bg-green-950 overflow-hidden">
      <img
        src="/images/hero.webp" 
        alt="Cancha de fútbol 7 con césped sintético"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/75" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white mb-4 leading-tight tracking-tight text-center w-full">
            Reserva tu cancha
            <span className="block text-[#4ADE80]">en minutos</span>
          </h1>
          <p className="text-base sm:text-lg text-white/70 max-w-md mx-auto leading-relaxed">
            Consulta la disponibilidad y asegura tu horario de forma rápida y sencilla. Sin complicaciones.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

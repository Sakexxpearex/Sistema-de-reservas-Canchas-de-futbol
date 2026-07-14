import { motion } from "motion/react";
import { Court, TimeSlot } from "@/types";
import { TimeSlotChip } from "./TimeSlotChip";

interface CourtCardProps {
  court: Court;
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
}

export function CourtCard({ court, selectedSlot, onSlotSelect }: CourtCardProps) {
  const availableCount = court.slots.filter((s) => s.status !== "occupied").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-shadow overflow-hidden"
    >
      <div className="relative h-80 bg-green-950 overflow-hidden">
        <img
          src="/images/courtPhoto.webp" 
          alt="Cancha"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 right-3">
          <span className="bg-[#16A34A]/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full shadow">
            {availableCount} disponibles
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="text-[#0F172A] font-bold text-xl mb-5">{court.name}</h3>

        <div className="border-t border-[#E2E8F0] pt-5" id={court.id === "c1" ? "courts" : undefined}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-black text-[#64748B] uppercase tracking-widest">
              Horarios disponibles
            </p>
            <p className="text-[11px] text-[#64748B]">
              {availableCount} de {court.slots.length}
            </p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
            {court.slots.map((slot) => (
              <TimeSlotChip
                key={slot.id}
                slot={slot}
                selected={selectedSlot?.id === slot.id}
                onSelect={onSlotSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
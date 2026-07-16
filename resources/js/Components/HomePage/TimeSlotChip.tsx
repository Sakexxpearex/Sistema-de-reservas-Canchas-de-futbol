import { motion } from "motion/react";
import { Clock } from "lucide-react";
import { TimeSlot } from "@/types";
import { fmtPrice } from "@/data/courts";

interface TimeSlotChipProps {
  slot: TimeSlot;
  selected: boolean;
  onSelect: (slot: TimeSlot) => void;
}

export function TimeSlotChip({ slot, selected, onSelect }: TimeSlotChipProps) {
  const isOccupied = slot.status === "occupied";
  const isPromo = slot.status === "promo";

  return (
    <motion.button
      whileHover={!isOccupied ? { scale: 1.05, y: -1 } : {}}
      whileTap={!isOccupied ? { scale: 0.95 } : {}}
      onClick={() => !isOccupied && onSelect(slot)}
      disabled={isOccupied}
      className={`relative flex flex-col items-center gap-1 px-2.5 py-3.5 rounded-xl border transition-all duration-200 text-center min-w-0
        ${isOccupied
          ? "bg-[#F8FAFC] border-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed"
          : selected
          ? "bg-[#16A34A] border-[#16A34A] text-white shadow-lg shadow-green-500/30"
          : "bg-white border-[#E2E8F0] hover:border-[#16A34A]/50 hover:shadow-md cursor-pointer"
        }`}
    >
      {isPromo && !isOccupied && !selected && (
        <span className="absolute -top-2 -right-1.5 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full leading-none z-10 shadow">
          PROMO
        </span>
      )}
      <Clock size={14} className={isOccupied ? "text-[#CBD5E1]" : selected ? "text-green-100" : "text-[#64748B]"} />
      <span className={`text-xs font-bold leading-tight whitespace-nowrap ${isOccupied ? "text-[#CBD5E1]" : selected ? "text-white" : "text-[#0F172A]"}`}>
        {slot.time}
      </span>
      <span className={`text-xs font-bold leading-none ${isOccupied ? "text-[#CBD5E1]" : selected ? "text-green-100" : "text-[#16A34A]"}`}>
        {isOccupied ? "Ocupado" : fmtPrice(slot.price)}
      </span>
    </motion.button>
  );
}

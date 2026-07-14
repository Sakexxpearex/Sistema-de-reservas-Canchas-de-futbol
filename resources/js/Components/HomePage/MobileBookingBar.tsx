import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { BookingState } from "@/types";
import { fmtPrice } from "@/data/courts";

interface MobileBookingBarProps {
  booking: BookingState;
  onContinue: () => void;
}

export function MobileBookingBar({ booking, onContinue }: MobileBookingBarProps) {
  return (
    <motion.div
      initial={{ y: 88, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 88, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-[#E2E8F0] shadow-2xl px-4 py-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#64748B] font-medium">
            {booking.court?.name} · {booking.slot?.time}
          </p>
          <p className="font-black text-[#0F172A] text-xl leading-tight">
            {fmtPrice(booking.slot?.price ?? 0)}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onContinue}
          className="px-6 py-3.5 bg-[#16A34A] text-white font-bold rounded-xl shadow-lg shadow-green-500/30 flex items-center gap-2 text-sm"
        >
          Reservar <ChevronRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

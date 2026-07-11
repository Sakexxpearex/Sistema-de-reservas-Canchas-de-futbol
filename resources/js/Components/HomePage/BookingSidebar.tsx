import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, ChevronRight, Lock, Shield } from "lucide-react";
import { BookingState } from "@/types";
import { fmtDate, fmtPrice } from "@/data/courts";


interface BookingSidebarProps {
  booking: BookingState;
  onContinue: () => void;
}

export function BookingSidebar({ booking, onContinue }: BookingSidebarProps) {
  const hasSelection = booking.court && booking.slot;

  return (
    <div className="sticky top-[88px] space-y-3">
      <motion.div
        layout
        className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300
          ${hasSelection ? "border-[#16A34A]/30 shadow-green-100/80" : "border-[#E2E8F0]"}`}
      >
        <div className={`px-5 pt-5 pb-4 border-b border-[#E2E8F0] ${hasSelection ? "bg-[#F0FDF4]" : ""}`}>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${hasSelection ? "bg-[#16A34A]" : "bg-[#F1F5F9]"}`}>
              <Calendar size={14} className={hasSelection ? "text-white" : "text-[#64748B]"} />
            </div>
            <span className="font-bold text-[#0F172A] text-sm">Tu reserva</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {hasSelection ? (
            <motion.div key="filled" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5">
              <div className="space-y-4 mb-5">
                <div>
                  <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-1">Cancha</p>
                  <p className="font-bold text-[#0F172A] text-sm">{booking.court!.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-1">Fecha</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#16A34A]" />
                    <p className="text-sm font-semibold text-[#0F172A]">{fmtDate(booking.date)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-1">Horario</p>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-[#16A34A]" />
                    <p className="text-sm font-semibold text-[#0F172A]">{booking.slot!.time}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B] font-medium">Total</span>
                  <span className="text-2xl font-black text-[#0F172A]">{fmtPrice(booking.slot!.price)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onContinue}
                className="w-full py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 text-sm"
              >
                Confirmar reserva <ChevronRight size={16} />
              </motion.button>

              <div className="flex items-center justify-center gap-1.5 mt-3">
                <Lock size={11} className="text-[#94A3B8]" />
                <p className="text-[11px] text-[#94A3B8]">Pago 100% seguro</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-3">
                <Calendar size={20} className="text-[#94A3B8]" />
              </div>
              <p className="text-[#0F172A] font-semibold text-sm mb-1">Ningún horario seleccionado</p>
              <p className="text-[#94A3B8] text-xs leading-relaxed">Elige una cancha y un horario disponible para continuar</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] p-4">
        <div className="flex items-start gap-3">
          <Shield size={15} className="text-[#16A34A] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#15803D] mb-0.5">Reserva sin riesgo</p>
            <p className="text-[11px] text-[#166534] leading-relaxed">Sin registro requerido. Cancela hasta 2 horas antes sin costo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

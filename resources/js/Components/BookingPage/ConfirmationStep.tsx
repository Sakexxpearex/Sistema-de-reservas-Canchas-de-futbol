import { motion } from "motion/react";
import { CheckCircle, Calendar, Clock, Download, Home } from "lucide-react";
import { BookingState, FormValues } from "@/types";
import { Navbar } from "../HomePage/Navbar";
import { fmtDate, fmtPrice } from "@/data/courts";
import { StepProgress } from "./StepProgress";



interface ConfirmationStepProps {
  booking: BookingState;
  formValues: FormValues;
  codigo: string;
  correoEnviado: boolean;
  onReset: () => void;
}

export function ConfirmationStep({ booking, formValues, codigo, correoEnviado, onReset }: ConfirmationStepProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="pt-[72px] flex justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="mt-8">
            <StepProgress current={3} />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
          >
            <div className="bg-[#F0FDF4] px-6 py-10 flex flex-col items-center text-center border-b border-[#BBF7D0]">
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 18 }}
                className="w-20 h-20 bg-[#16A34A] rounded-full flex items-center justify-center mb-5 shadow-2xl shadow-green-500/35"
              >
                <CheckCircle size={38} className="text-white" strokeWidth={2.5} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <h2 className="text-3xl font-black text-[#0F172A] mb-2">¡Reserva confirmada!</h2>
                {correoEnviado ? (
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    Hemos enviado los detalles a<br />
                    <span className="font-semibold text-[#0F172A]">{formValues.email}</span>
                  </p>
                ) : (
                  <p className="text-[#B45309] text-sm leading-relaxed">
                    No pudimos enviarte el correo de confirmación.<br />
                    <span className="font-semibold">Guarda tu código de reserva.</span>
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48 }}
                className="mt-5 bg-white/80 rounded-xl px-6 py-3 border border-[#BBF7D0]"
              >
                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-0.5">Código de reserva</p>
                <p className="text-xl font-black text-[#16A34A] tracking-wider">{codigo || "—"}</p>
              </motion.div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-3">Detalles</p>
                <div className="space-y-0">
                  {[
                    { icon: <span>⚽</span>, label: "Cancha", value: booking.court?.name ?? "—" },
                    { icon: <Calendar size={14} />, label: "Fecha", value: fmtDate(booking.date) },
                    { icon: <Clock size={14} />, label: "Horario", value: booking.slot?.time ?? "—" },
                    { icon: <span className="text-[#16A34A] font-black text-xs">$</span>, label: "Total pagado", value: fmtPrice(booking.slot?.price ?? 0) },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-0">
                      <div className="flex items-center gap-2 text-[#64748B] text-sm">
                        <span className="text-[#94A3B8]">{icon}</span>
                        {label}
                      </div>
                      <span className="font-semibold text-[#0F172A] text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FFFBEB] rounded-xl border border-[#FDE68A] p-4 text-center">
                <p className="text-[#92400E] text-xs font-semibold">Preséntate 10 minutos antes · Cancela hasta 2 horas antes sin costo</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  className="py-3 rounded-xl border-2 border-[#E2E8F0] text-[#0F172A] font-bold text-sm flex items-center justify-center gap-2 hover:border-[#16A34A]/40 hover:bg-[#F0FDF4] transition-all"
                >
                  <Download size={14} />
                  Descargar
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onReset}
                  className="py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-500/25"
                >
                  <Home size={14} />
                  Nueva reserva
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

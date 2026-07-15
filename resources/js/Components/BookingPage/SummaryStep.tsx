import { motion } from "motion/react";
import { Calendar, Clock, ChevronRight, User, Mail, Phone } from "lucide-react";
import { Navbar } from "../HomePage/Navbar";
import { StepProgress } from "./StepProgress";
import { fmtDate, fmtPrice } from "@/data/courts";
import { BookingState, FormValues } from "@/types";

interface SummaryStepProps {
  booking: BookingState;
  formValues: FormValues;
  onContinue: () => void;
  onBack: () => void;
}

export function SummaryStep({ booking, formValues, onContinue, onBack }: SummaryStepProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar onBack={onBack} backLabel="Editar datos" />
      <div className="pt-[72px] flex justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="mt-8">
            <StepProgress current={1} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
          >
            <div className="px-6 pt-6 pb-5 border-b border-[#E2E8F0]">
              <h2 className="text-2xl font-extrabold text-[#0F172A]">Resumen</h2>
              <p className="text-[#64748B] text-sm mt-1">Confirma los detalles antes de pagar</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-3">Detalles de la reserva</p>
                <div className="space-y-0">
                  {[
                    { icon: <span>⚽</span>, label: "Cancha", value: booking.court?.name ?? "—" },
                    { icon: <Calendar size={14} />, label: "Fecha", value: fmtDate(booking.date) },
                    { icon: <Clock size={14} />, label: "Horario", value: booking.slot?.time ?? "—" },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-0">
                      <div className="flex items-center gap-2 text-[#64748B] text-sm">
                        <span className="text-[#94A3B8]">{icon}</span>
                        {label}
                      </div>
                      <span className="font-semibold text-[#0F172A] text-sm text-right max-w-[60%]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-3">Datos del cliente</p>
                <div className="bg-[#F8FAFC] rounded-xl p-4 space-y-2.5 border border-[#E2E8F0]">
                  <div className="flex items-center gap-3"><User size={13} className="text-[#94A3B8]" /><span className="text-[#0F172A] text-sm font-semibold">{formValues.name}</span></div>
                  <div className="flex items-center gap-3"><Mail size={13} className="text-[#94A3B8]" /><span className="text-[#0F172A] text-sm">{formValues.email}</span></div>
                  <div className="flex items-center gap-3"><Phone size={13} className="text-[#94A3B8]" /><span className="text-[#0F172A] text-sm">{formValues.phone}</span></div>
                </div>
              </div>

              <div className="bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] p-4 flex items-center justify-between">
                <span className="text-[#15803D] font-bold text-sm">Total a pagar</span>
                <span className="text-3xl font-black text-[#0F172A]">{fmtPrice(booking.slot?.price ?? 0)}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onContinue}
                className="w-full py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 text-sm"
              >
                Continuar al pago <ChevronRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

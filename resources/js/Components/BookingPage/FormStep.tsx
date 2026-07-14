import { motion } from "motion/react";
import { User, Mail, Phone, ChevronRight } from "lucide-react";
import { BookingState, FormValues } from "@/types";
import { Navbar } from "../HomePage/Navbar";
import { StepProgress } from "./StepProgress";
import { fmtDate, fmtPrice } from "@/data/courts";

interface FormStepProps {
  booking: BookingState;
  formValues: FormValues;
  onChange: (v: FormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const INPUT_CLS =
  "w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] text-sm placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all";

export function FormStep({ booking, formValues, onChange, onSubmit, onBack }: FormStepProps) {
  const isValid = formValues.name.trim() && formValues.email.trim() && formValues.phone.trim();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar onBack={onBack} backLabel="Volver a canchas" />
      <div className="pt-[72px] flex justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="mt-8">
            <StepProgress current={0} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
          >
            <div className="px-6 pt-6 pb-5 border-b border-[#E2E8F0]">
              <h2 className="text-2xl font-extrabold text-[#0F172A]">Tus datos</h2>
              <p className="text-[#64748B] text-sm mt-1">No es necesario crear una cuenta ni iniciar sesión</p>
            </div>

            {booking.court && booking.slot && (
              <div className="mx-6 mt-5 p-4 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl flex-shrink-0">⚽</span>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0F172A] text-sm truncate">{booking.court.name}</p>
                    <p className="text-xs text-[#64748B] truncate">{fmtDate(booking.date)} · {booking.slot.time}</p>
                  </div>
                </div>
                <span className="font-black text-[#16A34A] text-lg flex-shrink-0 ml-3">{fmtPrice(booking.slot.price)}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-1.5">Nombre completo</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
                  <input type="text" placeholder="Carlos García" value={formValues.name} onChange={e => onChange({ ...formValues, name: e.target.value })} className={INPUT_CLS + " pl-10"} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-1.5">Correo electrónico</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
                  <input type="email" placeholder="carlos@ejemplo.com" value={formValues.email} onChange={e => onChange({ ...formValues, email: e.target.value })} className={INPUT_CLS + " pl-10"} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-1.5">Teléfono</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
                  <input type="tel" placeholder="+56 9 1234 5678" value={formValues.phone} onChange={e => onChange({ ...formValues, phone: e.target.value })} className={INPUT_CLS + " pl-10"} required />
                </div>
              </div>

              <motion.button
                whileHover={isValid ? { scale: 1.02 } : {}}
                whileTap={isValid ? { scale: 0.98 } : {}}
                type="submit"
                disabled={!isValid}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-2 transition-all
                  ${isValid ? "bg-[#16A34A] hover:bg-[#15803D] text-white shadow-lg shadow-green-500/25 cursor-pointer" : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"}`}
              >
                Continuar al resumen <ChevronRight size={16} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

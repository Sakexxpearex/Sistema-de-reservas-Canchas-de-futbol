import { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, ChevronRight } from "lucide-react";
import { BookingState, FormValues } from "@/types";
import { Navbar } from "../HomePage/Navbar";
import { StepProgress } from "./StepProgress";
import { fmtDate, fmtPrice } from "@/data/courts";
import {
  LIMITES,
  erroresFormulario,
  limpiarEmail,
  limpiarNombre,
  telefonoADigitos,
  telefonoGuardado,
  telefonoVisible,
} from "@/lib/validation";

interface FormStepProps {
  booking: BookingState;
  formValues: FormValues;
  onChange: (v: FormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const INPUT_CLS =
  "w-full px-4 py-3 rounded-xl border bg-[#F8FAFC] text-[#0F172A] text-sm placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 transition-all";
const INPUT_OK = "border-[#E2E8F0] focus:border-[#16A34A] focus:ring-[#16A34A]/20";
const INPUT_ERROR = "border-[#FCA5A5] focus:border-[#DC2626] focus:ring-[#DC2626]/20";

type Campo = keyof FormValues;

export function FormStep({ booking, formValues, onChange, onSubmit, onBack }: FormStepProps) {
  const [tocados, setTocados] = useState<Record<Campo, boolean>>({ name: false, email: false, phone: false });

  const errores = erroresFormulario(formValues);
  const isValid = Object.values(errores).every(e => e === null);
  const digitos = telefonoADigitos(formValues.phone);

  const marcarTocado = (campo: Campo) => setTocados(prev => ({ ...prev, [campo]: true }));

  /** El error se muestra recién cuando el campo se deja atrás, no mientras se escribe. */
  const errorVisible = (campo: Campo) => (tocados[campo] ? errores[campo] : null);

  const claseInput = (campo: Campo) => `${INPUT_CLS} pl-10 ${errorVisible(campo) ? INPUT_ERROR : INPUT_OK}`;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTocados({ name: true, email: true, phone: true });
    if (isValid) onSubmit(e);
  }

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

            <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-1.5" htmlFor="cliente-nombre">Nombre completo</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
                  <input
                    id="cliente-nombre"
                    type="text"
                    placeholder="Carlos García"
                    value={formValues.name}
                    onChange={e => onChange({ ...formValues, name: limpiarNombre(e.target.value) })}
                    onBlur={() => marcarTocado("name")}
                    maxLength={LIMITES.nombre.max}
                    autoComplete="name"
                    aria-invalid={Boolean(errorVisible("name"))}
                    className={claseInput("name")}
                  />
                </div>
                <FieldFooter error={errorVisible("name")} contador={`${formValues.name.length}/${LIMITES.nombre.max}`} />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-1.5" htmlFor="cliente-email">Correo electrónico</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
                  <input
                    id="cliente-email"
                    type="email"
                    inputMode="email"
                    placeholder="carlos@ejemplo.com"
                    value={formValues.email}
                    onChange={e => onChange({ ...formValues, email: limpiarEmail(e.target.value) })}
                    onBlur={() => marcarTocado("email")}
                    maxLength={LIMITES.email.max}
                    autoComplete="email"
                    aria-invalid={Boolean(errorVisible("email"))}
                    className={claseInput("email")}
                  />
                </div>
                <FieldFooter error={errorVisible("email")} contador={`${formValues.email.length}/${LIMITES.email.max}`} />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-1.5" htmlFor="cliente-telefono">Teléfono</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
                  <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#64748B] pointer-events-none">+56</span>
                  <input
                    id="cliente-telefono"
                    type="tel"
                    inputMode="numeric"
                    placeholder="9 1234 5678"
                    value={telefonoVisible(digitos)}
                    onChange={e => onChange({ ...formValues, phone: telefonoGuardado(telefonoADigitos(e.target.value)) })}
                    onBlur={() => marcarTocado("phone")}
                    maxLength={LIMITES.telefonoDigitos + 2} // los dos espacios del formato
                    autoComplete="tel-national"
                    aria-invalid={Boolean(errorVisible("phone"))}
                    className={`${claseInput("phone")} pl-[4.25rem]`}
                  />
                </div>
                <FieldFooter
                  error={errorVisible("phone")}
                  contador={`${digitos.length}/${LIMITES.telefonoDigitos}`}
                />
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

function FieldFooter({ error, contador }: { error: string | null; contador: string }) {
  return (
    <div className="flex items-start justify-between gap-3 mt-1.5 min-h-[16px]">
      <p className="text-[11px] font-semibold text-[#DC2626]">{error}</p>
      <span className="text-[11px] text-[#94A3B8] flex-shrink-0 tabular-nums">{contador}</span>
    </div>
  );
}

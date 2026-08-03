import { motion } from "motion/react";
import { CheckCircle, Clock, Calendar, Download, Home } from "lucide-react";
import { BookingState, FormValues, PayMethod, ReservaEstado } from "@/types";
import { Navbar } from "../HomePage/Navbar";
import { fmtDate, fmtPrice } from "@/data/courts";
import { PAY_METHOD_LABELS } from "@/data/payments";
import { StepProgress } from "./StepProgress";



interface ConfirmationStepProps {
  booking: BookingState;
  formValues: FormValues;
  codigo: string;
  correoEnviado: boolean;
  estado: ReservaEstado;
  metodoPago: PayMethod;
  onReset: () => void;
}

/** La reserva pendiente ya ocupa el horario, pero el cobro sigue abierto. */
const TEMA = {
  confirmada: {
    icon: CheckCircle,
    titulo: "¡Reserva confirmada!",
    header: "bg-[#F0FDF4] border-[#BBF7D0]",
    badge: "bg-white/80 border-[#BBF7D0]",
    circulo: "bg-[#16A34A] shadow-green-500/35",
    codigoColor: "text-[#16A34A]",
    etiquetaTotal: "Total pagado",
    aviso: "Preséntate 10 minutos antes · Cancela hasta 2 horas antes sin costo",
  },
  pendiente: {
    icon: Clock,
    titulo: "¡Horario reservado!",
    header: "bg-[#FFFBEB] border-[#FDE68A]",
    badge: "bg-white/80 border-[#FDE68A]",
    circulo: "bg-[#D97706] shadow-amber-500/35",
    codigoColor: "text-[#B45309]",
    etiquetaTotal: "Total a pagar",
    aviso: "Tu reserva queda pendiente hasta que registremos el pago · Cancela hasta 2 horas antes sin costo",
  },
} as const;

export function ConfirmationStep({ booking, formValues, codigo, correoEnviado, estado, metodoPago, onReset }: ConfirmationStepProps) {
  const pendiente = estado === "pendiente";
  const tema = pendiente ? TEMA.pendiente : TEMA.confirmada;
  const Icono = tema.icon;

  const instrucciones = metodoPago === "transferencia"
    ? "Transfiere el total y envíanos el comprobante con tu código de reserva."
    : "Paga en la recepción del recinto al llegar.";

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
            <div className={`px-6 py-10 flex flex-col items-center text-center border-b ${tema.header}`}>
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 18 }}
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 shadow-2xl ${tema.circulo}`}
              >
                <Icono size={38} className="text-white" strokeWidth={2.5} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <h2 className="text-3xl font-black text-[#0F172A] mb-2">{tema.titulo}</h2>
                {pendiente && (
                  <p className="text-[#B45309] text-sm font-semibold mb-1.5">{instrucciones}</p>
                )}
                {correoEnviado ? (
                  <p className="text-[#64748B] text-sm leading-relaxed">
                    Hemos enviado los detalles a<br />
                    <span className="font-semibold text-[#0F172A]">{formValues.email}</span>
                  </p>
                ) : (
                  <p className="text-[#B45309] text-sm leading-relaxed">
                    No pudimos enviarte el correo con los detalles.<br />
                    <span className="font-semibold">Guarda tu código de reserva.</span>
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48 }}
                className={`mt-5 rounded-xl px-6 py-3 border ${tema.badge}`}
              >
                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-0.5">Código de reserva</p>
                <p className={`text-xl font-black tracking-wider ${tema.codigoColor}`}>{codigo || "—"}</p>
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
                    { icon: <span className="text-[#64748B] font-black text-xs">•</span>, label: "Método de pago", value: PAY_METHOD_LABELS[metodoPago] },
                    { icon: <span className="text-[#16A34A] font-black text-xs">$</span>, label: tema.etiquetaTotal, value: fmtPrice(booking.slot?.price ?? 0) },
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
                <p className="text-[#92400E] text-xs font-semibold">{tema.aviso}</p>
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

import { useState } from "react";
import { motion } from "motion/react";
import { Banknote, CreditCard, Landmark, Lock, Shield } from "lucide-react";
import { BookingState, PayMethod } from "@/types";
import { Navbar } from "../HomePage/Navbar";
import { StepProgress } from "./StepProgress";
import { fmtDate, fmtPrice } from "@/data/courts";
import { BANK_DETAILS, PAY_METHODS, isCardMethod } from "@/data/payments";


interface PaymentStepProps {
  booking: BookingState;
  paymentMethod: PayMethod;
  onPaymentMethodChange: (m: PayMethod) => void;
  loading: boolean;
  onPay: () => void;
  onBack: () => void;
}

const INPUT_CLS =
  "w-full px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] text-sm placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all font-medium";

export function PaymentStep({ booking, paymentMethod, onPaymentMethodChange, loading, onPay, onBack }: PaymentStepProps) {
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardName, setCardName] = useState("Carlos García");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("123");

  const conTarjeta = isCardMethod(paymentMethod);
  const total = booking.slot?.price ?? 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar onBack={onBack} backLabel="Volver al resumen" />
      <div className="pt-[72px] flex justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="mt-8">
            <StepProgress current={2} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
          >
            <div className="px-6 pt-6 pb-5 border-b border-[#E2E8F0] flex items-center gap-3">
              <div className="w-9 h-9 bg-[#F0FDF4] rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock size={17} className="text-[#16A34A]" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#0F172A]">{conTarjeta ? "Pago seguro" : "Método de pago"}</h2>
                <p className="text-[#64748B] text-xs">
                  {conTarjeta
                    ? "Simulación de pasarela de pago · Sin cobro real"
                    : "Pagas al confirmar en el recinto · Sin cobro en línea"}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-[#F8FAFC] rounded-xl p-4 flex items-center justify-between border border-[#E2E8F0]">
                <div>
                  <p className="text-xs font-semibold text-[#0F172A]">{booking.court?.name}</p>
                  <p className="text-xs text-[#64748B]">{fmtDate(booking.date)} · {booking.slot?.time}</p>
                </div>
                <span className="font-black text-[#0F172A] text-xl">{fmtPrice(total)}</span>
              </div>

              <div>
                <p className="text-sm font-bold text-[#0F172A] mb-2.5">Método de pago</p>
                <div className="grid grid-cols-3 gap-2">
                  {PAY_METHODS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => onPaymentMethodChange(m.id)}
                      className={`py-3 rounded-xl border-2 text-xs font-bold transition-all
                        ${paymentMethod === m.id ? "border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]" : "border-[#E2E8F0] text-[#64748B] hover:border-[#16A34A]/40"}`}
                    >
                      <div className="text-xl mb-1">{m.emoji}</div>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {conTarjeta && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5">Número de tarjeta</label>
                    <div className="relative">
                      <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
                      <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className={INPUT_CLS + " pl-10"} maxLength={19} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-1.5">Nombre en la tarjeta</label>
                    <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} className={INPUT_CLS} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1.5">Vencimiento</label>
                      <input type="text" value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/AA" className={INPUT_CLS} maxLength={5} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0F172A] mb-1.5">CVV</label>
                      <input type="text" value={cvv} onChange={e => setCvv(e.target.value)} placeholder="123" className={INPUT_CLS} maxLength={4} />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === "efectivo" && (
                <div className="bg-[#FFFBEB] rounded-xl border border-[#FDE68A] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[#92400E] font-bold text-sm">
                    <Banknote size={15} />
                    Pago en efectivo
                  </div>
                  <p className="text-[#92400E] text-xs leading-relaxed">
                    Apartamos tu horario de inmediato, pero la reserva queda <strong>pendiente</strong> hasta que pagues
                    en la recepción del recinto. Llega 15 minutos antes de tu bloque.
                  </p>
                </div>
              )}

              {paymentMethod === "transferencia" && (
                <div className="bg-[#FFFBEB] rounded-xl border border-[#FDE68A] p-4 space-y-3">
                  <div className="flex items-center gap-2 text-[#92400E] font-bold text-sm">
                    <Landmark size={15} />
                    Datos para la transferencia
                  </div>
                  <div className="bg-white/70 rounded-lg border border-[#FDE68A] divide-y divide-[#FDE68A]/60">
                    {BANK_DETAILS.map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between px-3 py-2">
                        <span className="text-[#92400E] text-xs">{label}</span>
                        <span className="text-[#0F172A] text-xs font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[#92400E] text-xs leading-relaxed">
                    Apartamos tu horario de inmediato. La reserva queda <strong>pendiente</strong> hasta que enviemos la
                    confirmación del pago: transfiere e indícanos tu código de reserva.
                  </p>
                </div>
              )}

              <motion.button
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                onClick={onPay}
                disabled={loading}
                className="w-full py-4 bg-[#16A34A] hover:bg-[#15803D] text-white font-black rounded-xl transition-colors flex items-center justify-center gap-2.5 shadow-xl shadow-green-500/25 text-base disabled:opacity-80"
              >
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full" />
                    {conTarjeta ? "Procesando pago..." : "Reservando horario..."}
                  </>
                ) : conTarjeta ? (
                  <><Lock size={15} />Pagar {fmtPrice(total)}</>
                ) : (
                  <>Reservar y pagar después</>
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-2">
                <Shield size={11} className="text-[#94A3B8]" />
                <p className="text-[11px] text-[#94A3B8]">
                  {conTarjeta
                    ? "Simulación · No se realizará ningún cobro real"
                    : "No se realizará ningún cobro en línea"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

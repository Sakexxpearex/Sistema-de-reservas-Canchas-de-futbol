import { CardMethod, PayMethod } from "@/types";

export const CARD_METHODS: CardMethod[] = ["visa", "mastercard", "debit"];

export const PAY_METHODS: { id: PayMethod; label: string; emoji: string }[] = [
  { id: "visa", label: "Visa", emoji: "💳" },
  { id: "mastercard", label: "Mastercard", emoji: "💳" },
  { id: "debit", label: "Débito", emoji: "🏦" },
  { id: "efectivo", label: "Efectivo", emoji: "💵" },
  { id: "transferencia", label: "Transferencia", emoji: "🏧" },
];

export const PAY_METHOD_LABELS: Record<PayMethod, string> = Object.fromEntries(
  PAY_METHODS.map(m => [m.id, m.label])
) as Record<PayMethod, string>;

/** Solo la tarjeta se "cobra" al instante y deja la reserva confirmada. */
export const isCardMethod = (m: PayMethod): m is CardMethod =>
  (CARD_METHODS as PayMethod[]).includes(m);

/** Datos de la cuenta para la transferencia (demo). */
export const BANK_DETAILS: { label: string; value: string }[] = [
  { label: "Banco", value: "Banco Estado" },
  { label: "Tipo de cuenta", value: "Cuenta Corriente" },
  { label: "N° de cuenta", value: "123456789" },
  { label: "RUT", value: "76.543.210-K" },
  { label: "Titular", value: "HayCancha SpA" },
  { label: "Correo", value: "pagos@haycancha.cl" },
];

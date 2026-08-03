export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash: {
        reserva_codigo: string | null;
        reserva_correo_enviado: boolean | null;
        reserva_estado: ReservaEstado | null;
        reserva_metodo_pago: PayMethod | null;
    };
};

export type Step = "browse" | "form" | "summary" | "payment" | "confirmed";
export type CardMethod = "visa" | "mastercard" | "debit";
export type OffsiteMethod = "efectivo" | "transferencia";
export type PayMethod = CardMethod | OffsiteMethod;
export type ReservaEstado = "confirmada" | "pendiente" | "cancelada";
export type ReservationStatus = "confirmed" | "pending" | "cancelled";

export interface TimeSlot {
  id: string;
  time: string;
  price: number;
  status: "available" | "occupied" | "promo";
}

export interface Court {
  id: string;
  name: string;
  location: string;
  surface: string;
  capacity: string;
  lighting: boolean;
  covered: boolean;
  premium: boolean;
  parking: boolean;
  type: string;
  slots: TimeSlot[];
}

export interface BookingState {
  court: Court | null;
  date: Date | null;
  slot: TimeSlot | null;
}

export interface FormValues {
  name: string;
  email: string;
  phone: string;
}

export interface Reservation {
  id: string;
  court: string;
  date: string;
  rawDate?: string;
  time: string;
  customer: string;
  email: string;
  phone: string;
  price: number;
  status: ReservationStatus;
}

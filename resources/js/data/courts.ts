import { Court } from "@/types";

export const DAY_NAMES = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
export const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const DATES: Date[] = (() => {
  const base = new Date(2026, 6, 9);
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d;
  });
})();

export const fmtPrice = (price: number) => "$" + price.toLocaleString("es-CL");

export const fmtDate = (date: Date | null) =>
  date
    ? `${DAY_NAMES[date.getDay()]}, ${date.getDate()} de ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
    : "—";

export const COURTS: Court[] = [
  {
    id: "c1",
    name: "Cancha 1",
    location: "Sector Norte · Bloque A",
    surface: "Césped sintético",
    capacity: "7 vs 7",
    lighting: true,
    covered: true,
    premium: true,
    parking: true,
    type: "Fútbol 7",
    slots: [
      { id: "c1-1", time: "08:00 - 09:00", price: 18000, status: "occupied" },
      { id: "c1-2", time: "09:00 - 10:00", price: 18000, status: "available" },
      { id: "c1-3", time: "10:00 - 11:00", price: 18000, status: "available" },
      { id: "c1-4", time: "11:00 - 12:00", price: 20000, status: "occupied" },
      { id: "c1-5", time: "14:00 - 15:00", price: 22000, status: "available" },
      { id: "c1-6", time: "15:00 - 16:00", price: 22000, status: "promo" },
      { id: "c1-7", time: "16:00 - 17:00", price: 24000, status: "available" },
      { id: "c1-8", time: "17:00 - 18:00", price: 24000, status: "occupied" },
      { id: "c1-9", time: "19:00 - 20:00", price: 28000, status: "available" },
      { id: "c1-10", time: "20:00 - 21:00", price: 28000, status: "available" },
      { id: "c1-11", time: "21:00 - 22:00", price: 28000, status: "occupied" },
      { id: "c1-12", time: "22:00 - 23:00", price: 25000, status: "available" },
    ],
  },
  {
    id: "c2",
    name: "Cancha 2",
    location: "Sector Sur · Bloque B",
    surface: "Césped natural",
    capacity: "7 vs 7",
    lighting: true,
    covered: false,
    premium: false,
    parking: true,
    type: "Fútbol 7",
    slots: [
      { id: "c2-1", time: "08:00 - 09:00", price: 22000, status: "available" },
      { id: "c2-2", time: "09:00 - 10:00", price: 22000, status: "occupied" },
      { id: "c2-3", time: "10:00 - 11:00", price: 22000, status: "available" },
      { id: "c2-4", time: "11:00 - 12:00", price: 24000, status: "available" },
      { id: "c2-5", time: "14:00 - 15:00", price: 26000, status: "promo" },
      { id: "c2-6", time: "15:00 - 16:00", price: 26000, status: "available" },
      { id: "c2-7", time: "16:00 - 17:00", price: 28000, status: "occupied" },
      { id: "c2-8", time: "17:00 - 18:00", price: 28000, status: "available" },
      { id: "c2-9", time: "19:00 - 20:00", price: 32000, status: "available" },
      { id: "c2-10", time: "20:00 - 21:00", price: 32000, status: "available" },
      { id: "c2-11", time: "21:00 - 22:00", price: 30000, status: "occupied" },
      { id: "c2-12", time: "22:00 - 23:00", price: 28000, status: "available" },
    ],
  },
  {
    id: "c3",
    name: "Cancha 3",
    location: "Sector Oriente · Bloque C",
    surface: "Césped sintético premium",
    capacity: "7 vs 7",
    lighting: true,
    covered: false,
    premium: true,
    parking: false,
    type: "Fútbol 7",
    slots: [
      { id: "c3-1", time: "08:00 - 09:00", price: 35000, status: "occupied" },
      { id: "c3-2", time: "09:00 - 10:00", price: 35000, status: "available" },
      { id: "c3-3", time: "10:00 - 11:00", price: 35000, status: "available" },
      { id: "c3-4", time: "11:00 - 12:00", price: 38000, status: "promo" },
      { id: "c3-5", time: "14:00 - 15:00", price: 40000, status: "available" },
      { id: "c3-6", time: "15:00 - 16:00", price: 40000, status: "occupied" },
      { id: "c3-7", time: "16:00 - 17:00", price: 42000, status: "available" },
      { id: "c3-8", time: "17:00 - 18:00", price: 42000, status: "available" },
      { id: "c3-9", time: "19:00 - 20:00", price: 48000, status: "available" },
      { id: "c3-10", time: "20:00 - 21:00", price: 48000, status: "occupied" },
      { id: "c3-11", time: "21:00 - 22:00", price: 45000, status: "available" },
      { id: "c3-12", time: "22:00 - 23:00", price: 42000, status: "available" },
    ],
  },
];

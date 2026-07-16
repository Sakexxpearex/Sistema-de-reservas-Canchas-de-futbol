
export const DAY_NAMES = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
export const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const DATES: Date[] = (() => {
  const base = new Date();
  base.setHours(0, 0, 0, 0); // Fecha de hoy
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


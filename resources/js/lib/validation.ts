import { FormValues } from "@/types";

export const LIMITES = {
  nombre: { min: 3, max: 60 },
  email: { max: 100 },
  telefonoDigitos: 9,
} as const;

/**
 * Letras (con tildes), espacios y los signos que sí aparecen en nombres reales.
 * Van dos versiones porque `.test()` con el flag `g` arrastra `lastIndex` y
 * devolvería resultados distintos en llamadas consecutivas.
 */
const NOMBRE_PROHIBIDO = /[^\p{L}\s'’-]/u;
const NOMBRE_PROHIBIDO_GLOBAL = /[^\p{L}\s'’-]/gu;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/** Descarta lo que no corresponde en vez de dejar escribirlo y luego retar al usuario. */
export const limpiarNombre = (valor: string) =>
  valor.replace(NOMBRE_PROHIBIDO_GLOBAL, "").replace(/\s{2,}/g, " ").trimStart().slice(0, LIMITES.nombre.max);

export const limpiarEmail = (valor: string) =>
  valor.replace(/\s/g, "").slice(0, LIMITES.email.max);

// El teléfono se guarda como "+56 9 1234 5678", pero se edita como 9 dígitos
// sueltos: el prefijo +56 es fijo en la interfaz.
export const telefonoADigitos = (guardado: string) =>
  guardado.replace(/^\+56/, "").replace(/\D/g, "").slice(0, LIMITES.telefonoDigitos);

export const telefonoVisible = (digitos: string) =>
  [digitos.slice(0, 1), digitos.slice(1, 5), digitos.slice(5, 9)].filter(Boolean).join(" ");

export const telefonoGuardado = (digitos: string) =>
  digitos ? `+56 ${telefonoVisible(digitos)}` : "";

export function errorNombre(valor: string): string | null {
  const nombre = valor.trim();

  if (!nombre) return "Ingresa tu nombre.";
  if (nombre.replace(/[^\p{L}]/gu, "").length < LIMITES.nombre.min) {
    return `El nombre debe tener al menos ${LIMITES.nombre.min} letras.`;
  }
  if (NOMBRE_PROHIBIDO.test(nombre)) return "El nombre solo puede contener letras.";

  return null;
}

export function errorEmail(valor: string): string | null {
  const email = valor.trim();

  if (!email) return "Ingresa tu correo.";
  if (!EMAIL_RE.test(email)) return "Ingresa un correo válido, por ejemplo carlos@ejemplo.com.";

  return null;
}

export function errorTelefono(digitos: string): string | null {
  if (!digitos) return "Ingresa tu teléfono.";
  if (digitos.length < LIMITES.telefonoDigitos) {
    return `El teléfono debe tener ${LIMITES.telefonoDigitos} dígitos.`;
  }
  if (!digitos.startsWith("9")) return "El número móvil debe empezar con 9.";

  return null;
}

export function erroresFormulario(valores: FormValues): Record<keyof FormValues, string | null> {
  return {
    name: errorNombre(valores.name),
    email: errorEmail(valores.email),
    phone: errorTelefono(telefonoADigitos(valores.phone)),
  };
}

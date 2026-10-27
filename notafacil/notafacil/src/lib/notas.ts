import type { Bimestre } from "./tipos";

// ============================================================
// Lógica de notas: promedio y literales.
// TODO lo que tiene que ver con cómo se calcula la nota está
// AQUÍ, en funciones puras, para que sea fácil de cambiar.
// ============================================================

/** Nota mínima y máxima permitida */
export const NOTA_MIN = 0;
export const NOTA_MAX = 20;

/**
 * calcula el promedio simple de una lista de notas (solo las definidas),
 * redondeado al entero más cercano. Devuelve null si no hay notas.
 * ⬅ Cambia aquí si mañana el promedio es ponderado.
 */
export function calcularPromedio(notas: (number | undefined)[]): number | null {
  const validas = notas.filter(
    (n) => typeof n === "number" && !Number.isNaN(n)
  ) as number[];
  if (validas.length === 0) return null;
  const suma = validas.reduce((acc, n) => acc + n, 0);
  return Math.round(suma / validas.length);
}

/** Tipo de literal de logro */
export type Literal = "AD" | "A" | "B" | "C";

/**
 * Convierte una nota numérica a su literal:
 * AD = 18–20, A = 14–17, B = 11–13, C = 0–10.
 */
export function obtenerLiteral(nota: number | null): Literal | null {
  if (nota === null) return null;
  if (nota >= 18) return "AD";
  if (nota >= 14) return "A";
  if (nota >= 11) return "B";
  return "C";
}

/** Colores y estilos de cada literal (solo azul y amarillo, sin verde ni rojo) */
export const ESTILOS_LITERAL: Record<
  Literal,
  { clases: string; fondo: string; texto: string }
> = {
  AD: {
    clases: "bg-[#1E40AF] text-white", // azul fuerte con texto blanco
    fondo: "#1E40AF",
    texto: "#FFFFFF",
  },
  A: {
    clases: "bg-[#93C5FD] text-[#0F172A]", // azul claro
    fondo: "#93C5FD",
    texto: "#0F172A",
  },
  B: {
    clases: "bg-[#FDE68A] text-[#0F172A]", // amarillo claro
    fondo: "#FDE68A",
    texto: "#0F172A",
  },
  C: {
    clases: "bg-[#F59E0B] text-[#0F172A]", // amarillo fuerte con texto oscuro
    fondo: "#F59E0B",
    texto: "#0F172A",
  },
};

/** Devuelve el texto del literal ("—", "AD", "A"...) para mostrar */
export function textoLiteral(nota: number | null): string {
  const literal = obtenerLiteral(nota);
  return literal ?? "—";
}

/** Valida y "sujeta" el texto de un input de nota: "" | entero 0-20 */
export function validarEntradaNota(texto: string): string {
  if (texto === "") return "";
  const n = Math.round(Number(texto));
  if (Number.isNaN(n)) return "";
  if (n < NOTA_MIN) return String(NOTA_MIN);
  if (n > NOTA_MAX) return String(NOTA_MAX);
  return String(n);
}

/** Ordena bimestres en orden escolar */
export function ordenBimestre(b: Bimestre): number {
  return ["I", "II", "III", "IV"].indexOf(b);
}

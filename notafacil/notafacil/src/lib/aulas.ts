import type { Aula } from "./tipos";

// Aulas fijas del colegio (constante en el código).
// aulaId = nivel en minúscula + "-" + grado, ej: "inicial-4", "primaria-3".

interface DefAula {
  nivel: "Inicial" | "Primaria" | "Secundaria";
  grado: string;
}

const DEFINICION: DefAula[] = [
  { nivel: "Inicial", grado: "3" },
  { nivel: "Inicial", grado: "4" },
  { nivel: "Inicial", grado: "5" },
  { nivel: "Primaria", grado: "1" },
  { nivel: "Primaria", grado: "2" },
  { nivel: "Primaria", grado: "3" },
  { nivel: "Primaria", grado: "4" },
  { nivel: "Primaria", grado: "5" },
  { nivel: "Primaria", grado: "6" },
  { nivel: "Secundaria", grado: "1" },
  { nivel: "Secundaria", grado: "2" },
];

/** Sufijo de etiqueta según nivel (Inicial usa "años") */
function sufijo(nivel: string): string {
  return nivel === "Inicial" ? "años" : "°";
}

/** Lista de las 11 aulas del colegio */
export const AULAS: Aula[] = DEFINICION.map((d) => ({
  id: `${d.nivel.toLowerCase()}-${d.grado}`,
  nivel: d.nivel,
  grado: d.grado,
  etiqueta: `${d.nivel} ${d.grado} ${sufijo(d.nivel)}`,
}));

/** Agrupa las aulas por nivel para mostrarlas en columnas */
export function agruparPorNivel(): Record<string, Aula[]> {
  const grupos: Record<string, Aula[]> = {
    Inicial: [],
    Primaria: [],
    Secundaria: [],
  };
  for (const aula of AULAS) grupos[aula.nivel].push(aula);
  return grupos;
}

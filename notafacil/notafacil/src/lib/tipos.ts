// Tipos de datos de NotaFácil.
// Más adelante, Firebase reemplazará el almacenamiento pero NO estas formas.

/** Competencia dentro de un curso */
export interface Competencia {
  id: string;
  nombre: string;
}

/** Curso de un aula, con sus competencias */
export interface Curso {
  id: string;
  nombre: string;
  competencias: Competencia[];
}

/** Alumno (en demo se genera; con Firebase se leerá en vivo) */
export interface Alumno {
  dni: string;
  nombre: string;
  nivel: string;
  grado: string;
}

/** Bimestres escolares permitidos */
export type Bimestre = "I" | "II" | "III" | "IV";

export const BIMESTRES: Bimestre[] = ["I", "II", "III", "IV"];

/** nota[cursoId][bimestre][dni][compId] = entero 0-20 */
export type NotasDelAula = Record<
  string,
  Record<string, Record<string, Record<string, number>>>
>;

/** Aula seleccionada por el docente */
export interface Aula {
  id: string;       // ej: "primaria-3"
  nivel: string;    // "Inicial" | "Primaria" | "Secundaria"
  grado: string;    // "3", "4", "1"...
  etiqueta: string; // ej: "Primaria 3°"
}

/** Estado completo de un aula cargada (alumnos + cursos + notas) */
export interface Estado {
  aula: Aula;
  alumnos: Alumno[];
  cursos: Curso[];
  notas: NotasDelAula;
}

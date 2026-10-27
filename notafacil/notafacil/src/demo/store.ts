import type { Aula, Curso, Bimestre, Estado } from "../lib/tipos";
import { AULAS } from "../lib/aulas";
import { crearDatosDemo } from "./datosDemo";

// ============================================================
// "STORE" DE DATOS (capa de servicio).
// En modo demo trabaja en memoria con datos de ejemplo.
// Más adelante se reemplaza por Firebase con la MISMA interfaz:
//   - iniciarSesion / cerrarSesion
//   - guardarNota / borrarNota
//   - crearCurso / renombrarCurso / eliminarCurso
//   - crearCompetencia / renombrarCompetencia / eliminarCompetencia
// ============================================================

const CLAVE_SESION = "notafacil.aula";

/** Aula con todos sus datos en memoria (misma forma que lib/tipos.Estado) */
export type EstadoAula = Estado;

let aulaActual: Estado | null = null;

/** Suscriptores: las pantallas se redibujan cuando cambia el estado */
const suscriptores = new Set<() => void>();

function notificar() {
  suscriptores.forEach((fn) => fn());
}

/** Se suscribe a los cambios del store (para useSyncExternalStore) */
export function suscribirse(fn: () => void): () => void {
  suscriptores.add(fn);
  return () => suscriptores.delete(fn);
}

/** Estado actual del aula cargada (o null si no se ingresó aún) */
export function obtenerEstado(): EstadoAula | null {
  return aulaActual;
}

/** Construye un aula con sus datos demo */
function cargarAula(aula: Aula): EstadoAula {
  const demo = crearDatosDemo(aula);
  return { aula, ...demo };
}

/**
 * Inicia la sesión del docente en un aula.
 * En MODO DEMO cualquier contraseña entra; se guarda el aula
 * en localStorage para simular sesión persistente.
 */
export function iniciarSesion(aula: Aula, _clave: string): void {
  void _clave; // en demo se ignora la contraseña
  aulaActual = cargarAula(aula);
  localStorage.setItem(CLAVE_SESION, aula.id);
  notificar();
}

/** Cierra la sesión y vuelve a la pantalla de aulas */
export function cerrarSesion(): void {
  aulaActual = null;
  localStorage.removeItem(CLAVE_SESION);
  notificar();
}

/** Restaura la sesión guardada (si la hay) */
export function restaurarSesion(): void {
  const idGuardado = localStorage.getItem(CLAVE_SESION);
  if (!idGuardado) return;
  const aula = AULAS.find((a) => a.id === idGuardado);
  if (aula) aulaActual = cargarAula(aula);
}

// ============================================================
// Operaciones sobre CURSOS (memoria, sin persistencia)
// ============================================================

/** Crea un curso nuevo en el aula actual */
export function crearCurso(nombre: string): Curso {
  const curso: Curso = { id: `curso-${Date.now()}`, nombre, competencias: [] };
  aulaActual!.cursos.push(curso);
  notificar();
  return curso;
}

/** Cambia el nombre de un curso */
export function renombrarCurso(cursoId: string, nombre: string): void {
  const curso = aulaActual!.cursos.find((c) => c.id === cursoId);
  if (curso) curso.nombre = nombre;
  notificar();
}

/** Elimina el curso junto con todas sus notas */
export function eliminarCurso(cursoId: string): void {
  aulaActual!.cursos = aulaActual!.cursos.filter((c) => c.id !== cursoId);
  delete aulaActual!.notas[cursoId];
  notificar();
}

// ============================================================
// Operaciones sobre COMPETENCIAS
// ============================================================

/** Agrega una competencia a un curso */
export function crearCompetencia(cursoId: string, nombre: string): void {
  const curso = aulaActual!.cursos.find((c) => c.id === cursoId);
  if (!curso) return;
  curso.competencias.push({ id: `comp-${Date.now()}`, nombre });
  notificar();
}

/** Renombra una competencia */
export function renombrarCompetencia(
  cursoId: string,
  compId: string,
  nombre: string
): void {
  const curso = aulaActual!.cursos.find((c) => c.id === cursoId);
  const comp = curso?.competencias.find((c) => c.id === compId);
  if (comp) comp.nombre = nombre;
  notificar();
}

/** Elimina la competencia y sus notas de todos los alumnos */
export function eliminarCompetencia(cursoId: string, compId: string): void {
  const curso = aulaActual!.cursos.find((c) => c.id === cursoId);
  if (!curso) return;
  curso.competencias = curso.competencias.filter((c) => c.id !== compId);
  // Limpia la nota en todos los alumnos y bimestres
  const notasCurso = aulaActual!.notas[cursoId] ?? {};
  for (const bimestre of Object.keys(notasCurso)) {
    for (const dni of Object.keys(notasCurso[bimestre])) {
      delete notasCurso[bimestre][dni][compId];
    }
  }
  notificar();
}

/** Reordena una competencia una posición arriba (-1) o abajo (1) */
export function moverCompetencia(
  cursoId: string,
  compId: string,
  direccion: -1 | 1
): void {
  const curso = aulaActual!.cursos.find((c) => c.id === cursoId);
  if (!curso) return;
  const idx = curso.competencias.findIndex((c) => c.id === compId);
  const destino = idx + direccion;
  if (idx < 0 || destino < 0 || destino >= curso.competencias.length) return;
  const [comp] = curso.competencias.splice(idx, 1);
  curso.competencias.splice(destino, 0, comp);
  notificar();
}

// ============================================================
// Operaciones sobre NOTAS
// ============================================================

/** Guarda (o borra, si nota es null) la nota de una celda */
export function guardarNota(
  cursoId: string,
  bimestre: Bimestre,
  dni: string,
  compId: string,
  nota: number | null
): void {
  const notasCurso = (aulaActual!.notas[cursoId] ??= {});
  const notasBim = (notasCurso[bimestre] ??= {});
  const notasAlumno = (notasBim[dni] ??= {});
  if (nota === null) {
    delete notasAlumno[compId]; // celda vacía = sin nota
  } else {
    notasAlumno[compId] = nota;
  }
  notificar();
}

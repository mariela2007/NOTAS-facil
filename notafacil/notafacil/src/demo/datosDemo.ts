import type { Aula, Alumno, Curso, NotasDelAula } from "../lib/tipos";
import { AULAS } from "../lib/aulas";

// ============================================================
// DATOS DE EJEMPLO (MODO DEMO)
// Todo vive en memoria. Más adelante este módulo se reemplaza
// por Firebase sin tocar las pantallas.
// ============================================================

/** Nombres ficticios para generar alumnos */
const NOMBRES = [
  "María", "José", "Lucía", "Mateo", "Sofía", "Diego", "Valentina", "Sebastián",
  "Camila", "Alejandro", "Isabella", "Samuel", "Catalina", "Thiago", "Antonella",
  "Joaquín", "Rafaela", "Emiliano", "Julieta", "Benjamín",
];

const APELLIDOS = [
  "Quispe", "Flores", "Rojas", "Vargas", "Huamán", "Sánchez", "Cruz", "Ríos",
  "Mendoza", "Castillo", "Espinoza", "Aguilar", "Chávez", "Paredes", "Salazar",
  "Cárdenas", "Bustamante", "Zapata", "Villanueva", "Cabrera",
];

/** Genera un número pseudoaleatorio con semilla simple (para datos estables) */
function azar(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Crea una lista de alumnos ficticios para un aula */
function crearAlumnos(aula: Aula, cantidad: number): Alumno[] {
  const usados = new Set<string>();
  const alumnos: Alumno[] = [];
  while (alumnos.length < cantidad) {
    const nombre = NOMBRES[azar(0, NOMBRES.length - 1)];
    const apellido = APELLIDOS[azar(0, APELLIDOS.length - 1)];
    const nombreCompleto = `${apellido}, ${nombre}`;
    if (usados.has(nombreCompleto)) continue;
    usados.add(nombreCompleto);
    alumnos.push({
      dni: String(azar(10000000, 79999999)),
      nombre: nombreCompleto,
      nivel: aula.nivel,
      grado: aula.grado,
    });
  }
  // Ordenados alfabéticamente, como pide el sistema
  alumnos.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  return alumnos;
}

/** Cursos de ejemplo por aula (3 cursos con 3 competencias) */
function crearCursos(aula: Aula): Curso[] {
  void aula; // las competencias son genéricas; se puede personalizar por nivel
  return [
    {
      id: "curso-matematica",
      nombre: "Matemática",
      competencias: [
        { id: "comp-1", nombre: "Resuelve problemas de cantidad" },
        { id: "comp-2", nombre: "Resuelve problemas de regularidad" },
        { id: "comp-3", nombre: "Resuelve problemas de forma y movimiento" },
      ],
    },
    {
      id: "curso-comunicacion",
      nombre: "Comunicación",
      competencias: [
        { id: "comp-1", nombre: "Se comunica oralmente" },
        { id: "comp-2", nombre: "Lee diversos tipos de textos" },
        { id: "comp-3", nombre: "Escribe diversos tipos de textos" },
      ],
    },
    {
      id: "curso-cyta",
      nombre: "Ciencia y Tecnología",
      competencias: [
        { id: "comp-1", nombre: "Indaga mediante métodos científicos" },
        { id: "comp-2", nombre: "Explica el mundo físico" },
        { id: "comp-3", nombre: "Diseña y construye soluciones" },
        { id: "comp-4", nombre: "Gestiona su aprendizaje de forma autónoma" },
      ],
    },
  ];
}

/** Genera notas de ejemplo (bimestres I y II) para un aula */
function crearNotas(
  cursos: Curso[],
  alumnos: Alumno[],
  bimestres: string[]
): NotasDelAula {
  const notas: NotasDelAula = {};
  for (const curso of cursos) {
    notas[curso.id] = {};
    for (const bimestre of bimestres) {
      notas[curso.id][bimestre] = {};
      for (const alumno of alumnos) {
        notas[curso.id][bimestre][alumno.dni] = {};
        for (const comp of curso.competencias) {
          // ~90% de celdas tienen nota (así se ve el "—" en algunas)
          if (Math.random() < 0.9) {
            notas[curso.id][bimestre][alumno.dni][comp.id] = azar(8, 20);
          }
        }
      }
    }
  }
  return notas;
}

/** Construye TODOS los datos demo de un aula */
export function crearDatosDemo(aula: Aula): {
  alumnos: Alumno[];
  cursos: Curso[];
  notas: NotasDelAula;
} {
  const alumnos = crearAlumnos(aula, 15);
  const cursos = crearCursos(aula);
  const notas = crearNotas(cursos, alumnos, ["I", "II"]);
  return { alumnos, cursos, notas };
}

/** Aula demo vacía por defecto */
export const AULA_DEMO: Aula = AULAS[0];

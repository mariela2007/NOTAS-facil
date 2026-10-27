import { useState } from "react";
import {
  Plus, BookOpen, Pencil, Trash2, X, ChevronRight, ListChecks, Percent,
} from "lucide-react";
import type { Curso, Estado } from "../lib/tipos";
import {
  crearCurso, renombrarCurso, eliminarCurso,
} from "../demo/store";
import { calcularPromedio, obtenerLiteral } from "../lib/notas";

interface Props {
  estado: Estado;
  onAbrirCurso: (curso: Curso) => void;
}

/**
 * PANTALLA 2 - CURSOS
 * Tarjetas de cursos con botón amarillo "+ Agregar curso".
 * Permite crear, renombrar y eliminar (con confirmación).
 */
export function PantallaCursos({ estado, onAbrirCurso }: Props) {
  const { aula, cursos, alumnos, notas } = estado;

  // Modal de crear / renombrar
  const [modal, setModal] = useState<{ curso: Curso | null } | null>(null);
  const [nombre, setNombre] = useState("");
  // Confirmación de eliminación
  const [porEliminar, setPorEliminar] = useState<Curso | null>(null);

  /** Promedio del curso en el bimestre I (bimestre actual de referencia) */
  function promedioCurso(curso: Curso): number | null {
    const notasBim = notas[curso.id]?.["I"] ?? {};
    const promedios = alumnos
      .map((a) => {
        const notasAlumno = curso.competencias.map(
          (c) => notasBim[a.dni]?.[c.id]
        );
        return calcularPromedio(notasAlumno);
      })
      .filter((p): p is number => p !== null);
    if (promedios.length === 0) return null;
    return calcularPromedio(promedios);
  }

  function abrirModalCrear() {
    setNombre("");
    setModal({ curso: null });
  }

  function abrirModalRenombrar(curso: Curso) {
    setNombre(curso.nombre);
    setModal({ curso });
  }

  function guardarModal() {
    const limpio = nombre.trim();
    if (!limpio || !modal) return;
    if (modal.curso) renombrarCurso(modal.curso.id, limpio);
    else crearCurso(limpio);
    setModal(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Encabezado del aula */}
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Aula</p>
          <h1 className="text-2xl font-extrabold text-primary-dark">
            {aula.etiqueta}
          </h1>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <BookOpen size={24} />
        </div>
      </header>

      <h2 className="mb-3 text-sm font-bold tracking-wide text-slate-500 uppercase">
        Cursos del aula
      </h2>

      {/* Tarjetas de cursos */}
      {cursos.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-center text-slate-500 shadow-sm">
          Aún no hay cursos. Agrega el primero con el botón amarillo. 📚
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cursos.map((curso) => {
            const promedio = promedioCurso(curso);
            const literal = obtenerLiteral(promedio);
            return (
              <div
                key={curso.id}
                className="flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
              >
                {/* Botón principal: abre la planilla */}
                <button
                  onClick={() => onAbrirCurso(curso)}
                  className="flex flex-1 items-start justify-between gap-2 rounded-xl text-left"
                >
                  <div>
                    <h3 className="text-lg font-bold text-primary-dark">
                      {curso.nombre}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <ListChecks size={16} />
                      {curso.competencias.length}{" "}
                      {curso.competencias.length === 1 ? "competencia" : "competencias"}
                    </p>
                  </div>
                  <ChevronRight className="mt-1 shrink-0 text-slate-400" size={20} />
                </button>

                {/* Promedio del curso */}
                <div className="mt-3 flex items-center gap-2">
                  <Percent size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-500">Promedio:</span>
                  {promedio === null ? (
                    <span className="text-sm font-semibold text-slate-400">—</span>
                  ) : (
                    <span
                      className={`inline-flex h-7 min-w-9 items-center justify-center rounded-full px-2 text-xs font-bold ${
                        literal === "AD"
                          ? "bg-[#1E40AF] text-white"
                          : literal === "A"
                            ? "bg-[#93C5FD] text-[#0F172A]"
                            : literal === "B"
                              ? "bg-[#FDE68A] text-[#0F172A]"
                              : "bg-[#F59E0B] text-[#0F172A]"
                      }`}
                    >
                      {promedio} · {literal}
                    </span>
                  )}
                </div>

                {/* Acciones de la tarjeta */}
                <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => abrirModalRenombrar(curso)}
                    className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary-soft text-sm font-semibold text-primary transition hover:bg-[#BFDBFE]"
                  >
                    <Pencil size={16} /> Renombrar
                  </button>
                  <button
                    onClick={() => setPorEliminar(curso)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-[#854D0E] transition hover:bg-accent/40"
                    aria-label={`Eliminar ${curso.nombre}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Botón grande amarillo: agregar curso */}
      <button
        onClick={abrirModalCrear}
        className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-accent text-base font-extrabold text-[#0F172A] shadow-md transition hover:brightness-95 active:scale-[0.99] sm:w-auto sm:px-8"
      >
        <Plus size={22} strokeWidth={3} />
        Agregar curso
      </button>

      {/* Modal crear / renombrar curso */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary-dark">
                {modal.curso ? "Renombrar curso" : "Nuevo curso"}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-primary-soft"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && guardarModal()}
              placeholder="Nombre del curso (ej: Matemática)"
              autoFocus
              className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={guardarModal}
              disabled={!nombre.trim()}
              className="mt-4 h-12 w-full rounded-xl bg-primary font-bold text-white transition hover:bg-primary-dark disabled:opacity-40"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Confirmación de eliminación */}
      {porEliminar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 p-4"
          onClick={() => setPorEliminar(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-primary-dark">Eliminar curso</h2>
            <p className="mt-2 text-slate-600">
              ¿Seguro que deseas eliminar{" "}
              <span className="font-bold">"{porEliminar.nombre}"</span>? Se borrarán
              también todas sus notas. Esta acción no se puede deshacer.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setPorEliminar(null)}
                className="h-12 flex-1 rounded-xl bg-primary-soft font-semibold text-primary transition hover:bg-[#BFDBFE]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  eliminarCurso(porEliminar.id);
                  setPorEliminar(null);
                }}
                className="h-12 flex-1 rounded-xl bg-accent font-bold text-[#0F172A] transition hover:brightness-95"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

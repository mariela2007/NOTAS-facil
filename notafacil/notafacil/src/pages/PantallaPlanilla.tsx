import { useState } from "react";
import {
  Plus, Pencil, Trash2, X, ChevronLeft, GripVertical, AlertTriangle,
} from "lucide-react";
import type { Curso, Bimestre, Estado } from "../lib/tipos";
import { BIMESTRES } from "../lib/tipos";
import {
  guardarNota, crearCompetencia, renombrarCompetencia,
  eliminarCompetencia, moverCompetencia,
} from "../demo/store";
import {
  calcularPromedio, obtenerLiteral, validarEntradaNota, textoLiteral,
} from "../lib/notas";

interface Props {
  estado: Estado;
  curso: Curso;
  onVolver: () => void;
}

/**
 * PANTALLA 3 - PLANILLA DE NOTAS (editable)
 * Tabla con: pestañas de bimestre, columna de nombre fija (sticky),
 * celdas de nota 0-20, promedio y literal por alumno,
 * y gestión de competencias (agregar, renombrar, eliminar, reordenar).
 */
export function PantallaPlanilla({ estado, curso, onVolver }: Props) {
  const { aula, alumnos, notas } = estado;
  const [bimestre, setBimestre] = useState<Bimestre>("I");
  const [celdaEditando, setCeldaEditando] = useState<string | null>(null);

  // Gestión de competencias
  const [modalComp, setModalComp] = useState<{ compId: string | null } | null>(
    null
  );
  const [nombreComp, setNombreComp] = useState("");
  const [porEliminarComp, setPorEliminarComp] = useState<string | null>(null);

  const notasBimestre = notas[curso.id]?.[bimestre] ?? {};

  /** Notas de un alumno en el bimestre actual */
  function notasDeAlumno(dni: string): (number | undefined)[] {
    return curso.competencias.map((c) => notasBimestre[dni]?.[c.id]);
  }

  /* ---------- Gestión de competencias (modal) ---------- */
  function guardarCompetencia() {
    const limpio = nombreComp.trim();
    if (!limpio || !modalComp) return;
    if (modalComp.compId) renombrarCompetencia(curso.id, modalComp.compId, limpio);
    else crearCompetencia(curso.id, limpio);
    setModalComp(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Encabezado con botón de regreso */}
      <header className="mb-4 flex items-center gap-3">
        <button
          onClick={onVolver}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary transition hover:bg-[#BFDBFE]"
          aria-label="Volver a cursos"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-extrabold text-primary-dark sm:text-2xl">
            {curso.nombre}
          </h1>
          <p className="text-sm text-slate-500">
            {aula.etiqueta} · Planilla de notas
          </p>
        </div>
      </header>

      {/* Pestañas de bimestre */}
      <div className="mb-4 flex gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
        {BIMESTRES.map((b) => (
          <button
            key={b}
            onClick={() => setBimestre(b)}
            className={`h-11 flex-1 rounded-xl text-sm font-bold transition ${
              bimestre === b
                ? "bg-accent text-[#0F172A] shadow-sm" // bimestre seleccionado: amarillo
                : "text-slate-500 hover:bg-primary-soft"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Gestión de competencias */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setNombreComp("");
            setModalComp({ compId: null });
          }}
          className="flex h-10 items-center gap-1.5 rounded-xl bg-accent px-4 text-sm font-bold text-[#0F172A] transition hover:brightness-95"
        >
          <Plus size={16} strokeWidth={3} /> Competencia
        </button>
        <span className="text-xs text-slate-400">
          Toca el lápiz para renombrar una competencia
        </span>
      </div>

      {/* ------- Tabla de notas (scroll horizontal con nombre fijo) ------- */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr className="bg-primary text-white">
              <th className="sticky left-0 z-10 min-w-44 border-r border-white/20 bg-primary px-3 py-2 text-left font-semibold">
                Alumno
              </th>
              {curso.competencias.map((comp) => (
                <th
                  key={comp.id}
                  className="min-w-32 border-l border-white/20 px-2 py-2 text-center align-top font-semibold"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="line-clamp-2 text-xs leading-snug">
                      {comp.nombre}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {/* Reordenar */}
                      <button
                        onClick={() => moverCompetencia(curso.id, comp.id, -1)}
                        className="rounded p-0.5 hover:bg-white/20"
                        aria-label="Subir competencia"
                      >
                        <GripVertical size={12} className="rotate-180" />
                      </button>
                      <button
                        onClick={() => moverCompetencia(curso.id, comp.id, 1)}
                        className="rounded p-0.5 hover:bg-white/20"
                        aria-label="Bajar competencia"
                      >
                        <GripVertical size={12} className="rotate-90" />
                      </button>
                      {/* Renombrar */}
                      <button
                        onClick={() => {
                          setNombreComp(comp.nombre);
                          setModalComp({ compId: comp.id });
                        }}
                        className="rounded p-0.5 hover:bg-white/20"
                        aria-label="Renombrar competencia"
                      >
                        <Pencil size={12} />
                      </button>
                      {/* Eliminar */}
                      <button
                        onClick={() => setPorEliminarComp(comp.id)}
                        className="rounded p-0.5 hover:bg-white/20"
                        aria-label="Eliminar competencia"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </th>
              ))}
              <th className="min-w-24 border-l border-white/20 px-2 py-2 text-center font-semibold">
                Promedio
              </th>
              <th className="min-w-20 border-l border-white/20 px-2 py-2 text-center font-semibold">
                Literal
              </th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno, fila) => (
              <tr
                key={alumno.dni}
                className={fila % 2 === 0 ? "bg-white" : "bg-primary-soft/60"}
              >
                {/* Nombre fijo al hacer scroll horizontal */}
                <th
                  className={`sticky left-0 z-10 border-r border-slate-200 px-3 py-2 text-left font-medium text-texto ${
                    fila % 2 === 0 ? "bg-white" : "bg-[#EAF2FE]"
                  }`}
                >
                  {alumno.nombre}
                </th>

                {/* Celdas de nota por competencia */}
                {curso.competencias.map((comp) => {
                  const clave = `${alumno.dni}|${comp.id}`;
                  const nota = notasBimestre[alumno.dni]?.[comp.id];
                  const editando = celdaEditando === clave;
                  return (
                    <td
                      key={comp.id}
                      className="border-l border-slate-100 p-0 text-center"
                    >
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={20}
                        value={editando ? (nota ?? "") : (nota ?? "")}
                        onFocus={() => setCeldaEditando(clave)}
                        onBlur={(e) => {
                          setCeldaEditando(null);
                          // Valida: vacío borra la nota; fuera de rango se sujeta
                          const valor = validarEntradaNota(e.target.value);
                          guardarNota(
                            curso.id,
                            bimestre,
                            alumno.dni,
                            comp.id,
                            valor === "" ? null : Number(valor)
                          );
                        }}
                        onChange={(e) => {
                          // Solo dígitos; la validación final ocurre al salir
                          const v = e.target.value.replace(/[^0-9]/g, "");
                          e.target.value = v;
                        }}
                        placeholder="—"
                        className={`h-11 w-full bg-transparent text-center text-base font-semibold outline-none placeholder:text-slate-300 focus:bg-accent-soft focus:ring-2 focus:ring-inset focus:ring-accent`}
                        aria-label={`Nota de ${alumno.nombre} en ${comp.nombre}`}
                      />
                    </td>
                  );
                })}

                {/* Promedio del alumno */}
                <td className="border-l border-slate-100 px-2 text-center font-bold text-primary-dark">
                  {textoLiteral(calcularPromedio(notasDeAlumno(alumno.dni))) === "—"
                    ? "—"
                    : calcularPromedio(notasDeAlumno(alumno.dni))}
                </td>

                {/* Literal con su color */}
                <td className="border-l border-slate-100 px-2 py-2 text-center">
                  {(() => {
                    const prom = calcularPromedio(notasDeAlumno(alumno.dni));
                    const literal = obtenerLiteral(prom);
                    if (!literal) return <span className="text-slate-300">—</span>;
                    const clases: Record<string, string> = {
                      AD: "bg-[#1E40AF] text-white",
                      A: "bg-[#93C5FD] text-[#0F172A]",
                      B: "bg-[#FDE68A] text-[#0F172A]",
                      C: "bg-[#F59E0B] text-[#0F172A]",
                    };
                    return (
                      <span
                        className={`inline-flex h-7 w-9 items-center justify-center rounded-full text-xs font-extrabold ${clases[literal]}`}
                      >
                        {literal}
                      </span>
                    );
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mensaje si el curso no tiene competencias aún */}
      {curso.competencias.length === 0 && (
        <p className="mt-4 flex items-center gap-2 rounded-2xl bg-accent-soft p-4 text-sm text-[#854D0E]">
          <AlertTriangle size={18} />
          Agrega al menos una competencia para empezar a poner notas.
        </p>
      )}

      {/* Ayuda discreta */}
      <p className="mt-3 text-xs text-slate-400">
        Escribe notas de 0 a 20. Deja la celda vacía para quitar la nota. El
        promedio se calcula con las competencias que tienen nota.
      </p>

      {/* ------- Modal crear / renombrar competencia ------- */}
      {modalComp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 p-4"
          onClick={() => setModalComp(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary-dark">
                {modalComp.compId ? "Renombrar competencia" : "Nueva competencia"}
              </h2>
              <button
                onClick={() => setModalComp(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-primary-soft"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
            <textarea
              value={nombreComp}
              onChange={(e) => setNombreComp(e.target.value)}
              placeholder="Ej: Indaga mediante métodos científicos para construir sus conocimientos"
              rows={3}
              autoFocus
              className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={guardarCompetencia}
              disabled={!nombreComp.trim()}
              className="mt-4 h-12 w-full rounded-xl bg-primary font-bold text-white transition hover:bg-primary-dark disabled:opacity-40"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* ------- Confirmación de eliminación de competencia ------- */}
      {porEliminarComp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 p-4"
          onClick={() => setPorEliminarComp(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-primary-dark">
              Eliminar competencia
            </h2>
            <p className="mt-2 text-slate-600">
              ¿Seguro que deseas eliminar esta competencia y las notas asociadas de
              todos los alumnos? Esta acción no se puede deshacer.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setPorEliminarComp(null)}
                className="h-12 flex-1 rounded-xl bg-primary-soft font-semibold text-primary transition hover:bg-[#BFDBFE]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  eliminarCompetencia(curso.id, porEliminarComp);
                  setPorEliminarComp(null);
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

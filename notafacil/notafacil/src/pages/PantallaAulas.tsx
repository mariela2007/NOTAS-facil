import { useState } from "react";
import { School } from "lucide-react";
import { agruparPorNivel } from "../lib/aulas";
import type { Aula } from "../lib/tipos";
import { ModalIngreso } from "../components/ModalIngreso";

interface Props {
  /** El docente confirmó el ingreso al aula con una contraseña */
  onIngresar: (aula: Aula, clave: string) => void;
}

/**
 * PANTALLA 1 - AULAS
 * Muestra las 11 aulas como tarjetas agrupadas por nivel.
 * Al tocar una tarjeta se abre el modal de contraseña.
 */
export function PantallaAulas({ onIngresar }: Props) {
  const [aulaSeleccionada, setAulaSeleccionada] = useState<Aula | null>(null);
  const grupos = agruparPorNivel();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Encabezado de bienvenida */}
      <header className="mb-6">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
          <School size={28} />
        </div>
        <h1 className="text-2xl font-extrabold text-primary-dark sm:text-3xl">
          NotaFácil
        </h1>
        <p className="mt-1 text-slate-500">
          Elige tu aula para comenzar a registrar las notas.
        </p>
      </header>

      {/* Aulas agrupadas por nivel */}
      {(["Inicial", "Primaria", "Secundaria"] as const).map((nivel) => (
        <section key={nivel} className="mb-7">
          <h2 className="mb-3 text-sm font-bold tracking-wide text-slate-500 uppercase">
            {nivel}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {grupos[nivel].map((aula) => (
              <button
                key={aula.id}
                onClick={() => setAulaSeleccionada(aula)}
                className="flex h-24 flex-col items-start justify-center rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-accent active:scale-[0.98]"
              >
                <span className="text-2xl font-extrabold text-primary">
                  {aula.nivel === "Inicial" ? `${aula.grado} años` : `${aula.grado}°`}
                </span>
                <span className="mt-1 text-xs font-medium text-slate-500">
                  {aula.nivel}
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}

      {/* Modal de contraseña */}
      {aulaSeleccionada && (
        <ModalIngreso
          aula={aulaSeleccionada}
          onConfirmar={(clave) => {
            onIngresar(aulaSeleccionada, clave);
            setAulaSeleccionada(null);
          }}
          onCerrar={() => setAulaSeleccionada(null)}
        />
      )}
    </div>
  );
}

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useEstadoAula, restaurarSesion } from "./hooks/useEstadoAula";
import { iniciarSesion, cerrarSesion } from "./demo/store";
import { FranjaDemo } from "./components/FranjaDemo";
import { PantallaAulas } from "./pages/PantallaAulas";
import { PantallaCursos } from "./pages/PantallaCursos";
import { PantallaPlanilla } from "./pages/PantallaPlanilla";
import type { Aula, Curso } from "./lib/tipos";

// Restaura la sesión persistida (simula sesión activa en modo demo)
restaurarSesion();

/**
 * Componente raíz de NotaFácil.
 * Navegación por estado (sin router, no se necesita en esta fase):
 *   null            -> PANTALLA 1: Aulas (elegir aula + contraseña)
 *   vista = cursos  -> PANTALLA 2: Cursos del aula
 *   vista = planilla-> PANTALLA 3: Planilla de notas de un curso
 */
export default function App() {
  const estado = useEstadoAula();
  const [cursoAbierto, setCursoAbierto] = useState<Curso | null>(null);

  // ---------- PANTALLA 1: selección de aula ----------
  if (!estado) {
    return (
      <div className="min-h-dvh bg-fondo">
        <FranjaDemo />
        <PantallaAulas
          onIngresar={(aula: Aula, clave: string) => iniciarSesion(aula, clave)}
        />
      </div>
    );
  }

  // ---------- AULA ABIERTA: encabezado + pantallas 2 y 3 ----------
  function cerrar(): void {
    cerrarSesion();
    setCursoAbierto(null);
  }

  return (
    <div className="min-h-dvh bg-fondo">
      <FranjaDemo />

      {/* Barra superior con el aula activa y el botón de salir */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-2.5 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-white">
            NF
          </div>
          <div>
            <p className="text-sm font-bold text-primary-dark">
              {estado.aula.etiqueta}
            </p>
            <p className="text-[11px] text-slate-400">NotaFácil · Modo demo</p>
          </div>
        </div>
        <button
          onClick={cerrar}
          className="flex h-11 items-center gap-2 rounded-xl bg-primary-soft px-4 text-sm font-semibold text-primary transition hover:bg-[#BFDBFE]"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </header>

      {cursoAbierto ? (
        // ---------- PANTALLA 3: planilla de notas ----------
        <PantallaPlanilla
          estado={estado}
          curso={cursoAbierto}
          onVolver={() => setCursoAbierto(null)}
        />
      ) : (
        // ---------- PANTALLA 2: cursos del aula ----------
        <PantallaCursos
          estado={estado}
          onAbrirCurso={(curso) => setCursoAbierto(curso)}
        />
      )}
    </div>
  );
}

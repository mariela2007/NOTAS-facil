import { useState } from "react";
import { Eye, EyeOff, X, LogIn } from "lucide-react";
import type { Aula } from "../lib/tipos";

interface Props {
  aula: Aula;
  onConfirmar: (clave: string) => void;
  onCerrar: () => void;
}

/**
 * Modal "Ingresar a {Aula}": pide SOLO la contraseña,
 * con botón para mostrar/ocultar. En demo cualquier clave entra.
 */
export function ModalIngreso({ aula, onConfirmar, onCerrar }: Props) {
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);

  const puedeEnviar = clave.length > 0;

  return (
    // Fondo oscurecido: se cierra al hacer clic fuera
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 p-4"
      onClick={onCerrar}
    >
      {/* Tarjeta del modal (evita cerrar si el clic es dentro) */}
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Ingresar a</p>
            <h2 className="text-xl font-bold text-primary-dark">{aula.etiqueta}</h2>
          </div>
          <button
            onClick={onCerrar}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-primary-soft"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
        </div>

        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (puedeEnviar) onConfirmar(clave);
          }}
        >
          <label
            htmlFor="clave-aula"
            className="mb-1 block text-sm font-semibold text-texto"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="clave-aula"
              type={verClave ? "text" : "password"}
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Contraseña del aula"
              autoFocus
              autoComplete="off"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white pr-12 pl-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            {/* Botón mostrar/ocultar contraseña */}
            <button
              type="button"
              onClick={() => setVerClave((v) => !v)}
              className="absolute top-1 right-1 flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-primary-soft"
              aria-label={verClave ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {verClave ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!puedeEnviar}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-white transition hover:bg-primary-dark disabled:opacity-40"
          >
            <LogIn size={20} />
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

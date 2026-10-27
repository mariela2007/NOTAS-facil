import { useSyncExternalStore } from "react";
import { suscribirse, obtenerEstado, restaurarSesion } from "../demo/store";
import type { Estado } from "../lib/tipos";

// Hook que conecta las pantallas con la capa de datos (store demo).
// Con Firebase se reemplazará por listeners de onValue + auth.

/** Estado completo del aula activa (null si aún no se ingresó a ninguna) */
export function useEstadoAula(): Estado | null {
  // Restaura la sesión persistida ANTES del primer render (una sola vez)
  useSyncExternalStore(suscribirse, obtenerEstado);
  return obtenerEstado();
}

/** Restaura la sesión guardada en localStorage; llamar 1 vez al montar la app */
export { restaurarSesion };

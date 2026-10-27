/** Franja amarilla discreta que indica que la app está en MODO DEMO */
export function FranjaDemo() {
  return (
    <div className="bg-accent-soft border-b border-accent/60 px-4 py-1.5 text-center">
      <span className="text-xs font-semibold text-[#854D0E]">
        ⚠️ Modo demo — los datos son de ejemplo y no se guardan
      </span>
    </div>
  );
}

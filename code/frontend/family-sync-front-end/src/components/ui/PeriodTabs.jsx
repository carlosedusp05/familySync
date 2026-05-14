import { motion } from "framer-motion";

export function PeriodTabs({ current, onChange, labelAtivo }) {
  const periodos = ["Dia", "Semana", "Mês", "Ano"];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full flex items-center justify-center gap-12 mt-4 px-10">
        {periodos.map((item) => (
          <div
            key={item}
            className="flex flex-col items-center cursor-pointer relative"
            onClick={() => onChange(item)}
          >
            <span
              className={`text-2xl pb-2 transition-colors ${
                current === item
                  ? "text-orange font-bold"
                  : "text-orange font-medium"
              }`}
            >
              {item}
            </span>

            {current === item && (
              <motion.div
                layoutId="periodo-underline"
                className="absolute bottom-0 h-1 w-full bg-orange"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Label de Data (ex: Janeiro - Dezembro 2026) */}
      <div className="text-orange font-semibold mt-6 mb-8 text-xl">
        {labelAtivo}
      </div>
    </div>
  );
}

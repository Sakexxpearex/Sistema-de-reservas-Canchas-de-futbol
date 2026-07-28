import { Check } from "lucide-react";

const STEP_LABELS = ["Datos", "Resumen", "Pago", "Listo"];

interface StepProgressProps {
  current: number;
}

export function StepProgress({ current }: StepProgressProps) {
  return (
    <div className="mb-16">
      <div className="flex items-center">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className={`flex items-center ${i < STEP_LABELS.length - 1 ? "flex-1" : ""}`}>
            <div className="relative flex flex-col items-center">
              <div
                className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${i < current
                    ? "bg-[#16A34A] text-white"
                    : i === current
                    ? "bg-[#16A34A] text-white ring-4 ring-[#DCFCE7]"
                    : "bg-white border-2 border-[#E2E8F0] text-[#64748B]"
                  }`}
              >
                {i < current ? <Check size={12} /> : i + 1}
              </div>
              <span className={`absolute top-10 left-1/2 -translate-x-1/2 text-[11px] font-semibold whitespace-nowrap ${i <= current ? "text-[#16A34A]" : "text-[#64748B]"}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${i < current ? "bg-[#16A34A]" : "bg-[#E2E8F0]"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

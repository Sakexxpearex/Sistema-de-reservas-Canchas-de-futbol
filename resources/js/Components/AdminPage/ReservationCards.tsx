import { motion } from "motion/react";
import { Users } from "lucide-react";
import { Reservation } from "@/types";
import { StatusBadge } from "./StatesBadge";
import { fmtPrice } from "@/data/courts";


interface ReservationCardsProps {
  rows: Reservation[];
  onToggle: (id: string) => void;
}

export function ReservationCards({ rows, onToggle }: ReservationCardsProps) {
  if (rows.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center gap-2">
        <Users size={32} className="text-[#E2E8F0]" />
        <p className="text-[#94A3B8] font-medium text-sm">No se encontraron reservas</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#F1F5F9]">
      {rows.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.04 }}
          className="p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-bold text-[#0F172A] text-sm">{r.customer}</p>
              <p className="text-xs text-[#64748B]">{r.email}</p>
            </div>
            <StatusBadge status={r.status} />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: "Cancha",  value: r.court },
              { label: "Fecha",   value: r.date  },
              { label: "Horario", value: r.time  },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-xs font-semibold text-[#0F172A]">{value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-black text-[#0F172A]">{fmtPrice(r.price)}</span>
            <button
              onClick={() => onToggle(r.id)}
              className="text-xs font-bold text-[#16A34A] hover:underline"
            >
              Cambiar estado
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

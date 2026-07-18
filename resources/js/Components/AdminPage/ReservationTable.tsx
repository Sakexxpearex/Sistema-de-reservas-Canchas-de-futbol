import { motion } from "motion/react";
import { Users } from "lucide-react";
import { Reservation } from "@/types";
import { StatusBadge } from "./StatesBadge";
import { fmtPrice } from "@/data/courts";

interface ReservationTableProps {
  rows: Reservation[];
}

const COLS = ["ID", "Cliente", "Cancha", "Fecha", "Horario", "Total", "Estado"];

export function ReservationTable({ rows }: ReservationTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            {COLS.map(h => (
              <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black text-[#64748B] uppercase tracking-widest">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr
              key={r.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors"
            >
              <td className="px-5 py-4 text-xs font-mono text-[#64748B]">{r.id}</td>
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-[#0F172A]">{r.customer}</p>
                <p className="text-xs text-[#64748B]">{r.email}</p>
              </td>
              <td className="px-5 py-4 text-sm font-medium text-[#0F172A]">{r.court}</td>
              <td className="px-5 py-4 text-sm text-[#64748B]">{r.date}</td>
              <td className="px-5 py-4 text-sm text-[#64748B]">{r.time}</td>
              <td className="px-5 py-4 text-sm font-black text-[#0F172A]">{fmtPrice(r.price)}</td>
              <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
            </motion.tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-5 py-16 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Users size={32} className="text-[#E2E8F0]" />
                  <p className="text-[#94A3B8] font-medium text-sm">No se encontraron reservas</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

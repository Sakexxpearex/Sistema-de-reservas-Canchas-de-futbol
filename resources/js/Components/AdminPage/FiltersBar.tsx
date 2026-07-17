import { ReservationStatus } from "@/types";
import { Search } from "lucide-react";

const COURTS = ["Todas", "Cancha 1", "Cancha 2", "Cancha 3"];

interface FiltersBarProps {
  search: string;
  courtFilter: string;
  statusFilter: ReservationStatus | "all";
  onSearch: (v: string) => void;
  onCourt: (v: string) => void;
  onStatus: (v: ReservationStatus | "all") => void;
}

export function FiltersBar({ search, courtFilter, statusFilter, onSearch, onCourt, onStatus }: FiltersBarProps) {
  return (
    <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
        <input
          type="text"
          placeholder="Buscar por cliente, email, ID..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#0F172A] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all"
        />
      </div>
      <div className="flex gap-2">
        <select
          value={courtFilter}
          onChange={e => onCourt(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition-all font-medium"
        >
          {COURTS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => onStatus(e.target.value as ReservationStatus | "all")}
          className="px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#0F172A] focus:outline-none focus:border-[#16A34A] transition-all font-medium"
        >
          <option value="all">Todos</option>
          <option value="confirmed">Confirmadas</option>
          <option value="pending">Pendientes</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>
    </div>
  );
}

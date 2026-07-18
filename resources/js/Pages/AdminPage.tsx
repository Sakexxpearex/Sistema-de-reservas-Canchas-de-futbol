import { useState, useMemo, useEffect } from "react";
import { AdminHeader } from "@/Components/AdminPage/AdminHeader";
import { StatsGrid } from "@/Components/AdminPage/StatsGrid";
import { FiltersBar } from "@/Components/AdminPage/FiltersBar";
import { Reservation, ReservationStatus } from "@/types";
import { fmtPrice, fmtDate } from "@/data/courts";
import { ReservationTable } from "@/Components/AdminPage/ReservationTable";
import { ReservationCards } from "@/Components/AdminPage/ReservationCards";

interface AdminPageProps {
  reservas: Reservation[];
}

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatReservas(reservas: Reservation[]): Reservation[] {
  return (reservas ?? []).map(r => ({ ...r, date: fmtDate(parseISODate(r.date)) }));
}

export default function AdminPage({ reservas }: AdminPageProps) {
  const [reservations, setReservations] = useState<Reservation[]>(() => formatReservas(reservas));

  useEffect(() => {
    setReservations(formatReservas(reservas));
  }, [reservas]);
  const [search, setSearch] = useState("");
  const [courtFilter, setCourtFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, courtFilter, statusFilter]);

  const filtered = useMemo(() => reservations.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || [r.customer, r.email, r.court, r.id].some(f => f.toLowerCase().includes(q));
    const matchCourt  = courtFilter === "Todas" || r.court === courtFilter;
    const matchStatus = statusFilter === "all"  || r.status === statusFilter;
    return matchSearch && matchCourt && matchStatus;
  }), [reservations, search, courtFilter, statusFilter]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * 10;
    return filtered.slice(start, start + 10);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / 10);

  const stats = useMemo(() => {
    const confirmed = reservations.filter(r => r.status === "confirmed");
    const today = fmtDate(new Date());
    return {
      todayCount:       reservations.filter(r => r.date === today).length,
      confirmedRevenue: fmtPrice(confirmed.reduce((s, r) => s + r.price, 0)),
      pendingCount:     reservations.filter(r => r.status === "pending").length,
      confirmedCount:   confirmed.length,
    };
  }, [reservations]);


  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminHeader />

      <div className="pt-[72px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0F172A]">Panel de reservas</h1>
          <p className="text-[#64748B] text-sm mt-1">Gestiona y supervisa todas las reservas del sistema</p>
        </div>

        <StatsGrid {...stats} />

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <FiltersBar
            search={search}
            courtFilter={courtFilter}
            statusFilter={statusFilter}
            onSearch={setSearch}
            onCourt={setCourtFilter}
            onStatus={setStatusFilter}
          />

          <div className="hidden lg:block">
            <ReservationTable rows={paginated} />
          </div>
          <div className="lg:hidden">
            <ReservationCards rows={paginated} />
          </div>

          <div className="px-5 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#94A3B8]">
              Mostrando {filtered.length === 0 ? 0 : (currentPage - 1) * 10 + 1} a {Math.min(currentPage * 10, filtered.length)} de {filtered.length} reservas
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F1F5F9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Anterior
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg transition-colors ${
                        currentPage === i + 1 
                          ? "bg-[#16A34A] text-white shadow-sm shadow-green-400/30" 
                          : "text-[#64748B] hover:bg-[#F1F5F9]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F1F5F9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
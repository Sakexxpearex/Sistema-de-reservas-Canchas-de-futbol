import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { AdminHeader } from "@/Components/AdminPage/AdminHeader";
import { StatsGrid } from "@/Components/AdminPage/StatsGrid";
import { FiltersBar } from "@/Components/AdminPage/FiltersBar";
import { Reservation, ReservationStatus } from "@/types";
import { fmtPrice, fmtDate } from "@/data/courts";
import { ReservationTable } from "@/Components/AdminPage/ReservationTable";
import { ReservationCards } from "@/Components/AdminPage/ReservationCards";

interface PaginatedReservations {
  data: Reservation[];
  current_page: number;
  last_page: number;
  total: number;
  from: number;
  to: number;
}

interface ServerStats {
  todayCount: number;
  pendingCount: number;
  confirmedCount: number;
  confirmedRevenue: number;
}

interface AdminPageProps {
  reservas: PaginatedReservations;
  serverStats: ServerStats;
  filters: {
    search?: string;
    dateFilter?: string;
    courtFilter?: string;
    statusFilter?: ReservationStatus | "all";
  };
}

function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export default function AdminPage({ reservas, serverStats, filters }: AdminPageProps) {
  const [search, setSearch] = useState(filters.search ?? "");
  const [dateFilter, setDateFilter] = useState(filters.dateFilter ?? "");
  const [courtFilter, setCourtFilter] = useState(filters.courtFilter ?? "Todas");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">(filters.statusFilter ?? "all");
  const [currentPage, setCurrentPage] = useState(reservas.current_page);

  useEffect(() => {
    const t = setTimeout(() => {
      router.get(window.location.pathname, {
        search, dateFilter, courtFilter, statusFilter, page: currentPage
      }, { preserveState: true, preserveScroll: true });
    }, 300);
    return () => clearTimeout(t);
  }, [search, dateFilter, courtFilter, statusFilter, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, dateFilter, courtFilter, statusFilter]);

  const rows = reservas.data.map(r => ({
    ...r,
    rawDate: r.date,
    date: fmtDate(parseISODate(r.date))
  }));

  const stats = {
    todayCount: serverStats.todayCount,
    confirmedRevenue: fmtPrice(serverStats.confirmedRevenue),
    pendingCount: serverStats.pendingCount,
    confirmedCount: serverStats.confirmedCount,
  };

  const totalPages = reservas.last_page;

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
            dateFilter={dateFilter}
            courtFilter={courtFilter}
            statusFilter={statusFilter}
            onSearch={setSearch}
            onDate={setDateFilter}
            onCourt={setCourtFilter}
            onStatus={setStatusFilter}
          />

          <div className="hidden lg:block">
            <ReservationTable rows={rows} />
          </div>
          <div className="lg:hidden">
            <ReservationCards rows={rows} />
          </div>

          <div className="px-5 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#94A3B8]">
              Mostrando {reservas.total === 0 ? 0 : reservas.from} a {reservas.to} de {reservas.total} reservas
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
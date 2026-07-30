import { useState } from "react";
import { ReservationStatus } from "@/types";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { cn } from "@/lib/utils";
import { fmtDate } from "@/data/courts";
import { es } from "date-fns/locale";

const COURTS = ["Todas", "Cancha 1", "Cancha 2"];

interface FiltersBarProps {
  search: string;
  dateFilter: string;
  courtFilter: string;
  statusFilter: ReservationStatus | "all";
  onSearch: (v: string) => void;
  onDate: (v: string) => void;
  onCourt: (v: string) => void;
  onStatus: (v: ReservationStatus | "all") => void;
}

export function FiltersBar({ search, dateFilter, courtFilter, statusFilter, onSearch, onDate, onCourt, onStatus }: FiltersBarProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const parseLocalDate = (ds: string) => {
    const [y, m, d] = ds.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  
  const dateObj = dateFilter ? parseLocalDate(dateFilter) : undefined;

  return (
    <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col xl:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
        <input
          type="text"
          placeholder="Buscar por cliente, email, ID..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#0F172A] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all h-[42px]"
        />
      </div>
      
      <div className="flex flex-wrap md:flex-nowrap gap-3 w-full xl:w-auto items-center">
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger render={
            <Button
              variant={"outline"}
              className={cn(
                "w-[220px] justify-start text-left font-medium h-[42px] rounded-xl bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] hover:bg-slate-100",
                !dateFilter && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
              {dateFilter && dateObj ? fmtDate(dateObj) : <span>Seleccionar fecha</span>}
            </Button>
          } />
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateObj}
              locale={es}
              onSelect={(d) => {
                if (d) {
                  onDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
                  setCalendarOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>

        <Select value={courtFilter} onValueChange={(v) => v && onCourt(v as string)}>
          <SelectTrigger className="w-[220px] h-[42px] rounded-xl bg-[#F8FAFC] border-[#E2E8F0] font-medium text-[#0F172A] focus:ring-[#16A34A]">
            <SelectValue placeholder="Cancha" />
          </SelectTrigger>
          <SelectContent className="w-[220px]">
            {COURTS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => v && onStatus(v as ReservationStatus | "all")}>
          <SelectTrigger className="w-[220px] h-[42px] rounded-xl bg-[#F8FAFC] border-[#E2E8F0] font-medium text-[#0F172A] focus:ring-[#16A34A]">
            {statusFilter === "all" ? "Todos los estados" : 
             statusFilter === "confirmed" ? "Confirmadas" : 
             statusFilter === "pending" ? "Pendientes" : 
             statusFilter === "cancelled" ? "Canceladas" : 
             <SelectValue placeholder="Estado" />}
          </SelectTrigger>
          <SelectContent className="w-[220px]">
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="confirmed">Confirmadas</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

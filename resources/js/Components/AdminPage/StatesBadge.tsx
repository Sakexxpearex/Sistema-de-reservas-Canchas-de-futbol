import { ReservationStatus } from "@/types";
import { CheckCircle, Clock, XCircle } from "lucide-react";


const MAP: Record<ReservationStatus, { label: string; cls: string; icon: typeof CheckCircle }> = {
  confirmed: { label: "Confirmada", cls: "bg-green-50 text-green-700 border-green-200",  icon: CheckCircle },
  pending:   { label: "Pendiente",  cls: "bg-amber-50 text-amber-700 border-amber-200",  icon: Clock       },
  cancelled: { label: "Cancelada",  cls: "bg-red-50   text-red-600   border-red-200",    icon: XCircle     },
};

export function StatusBadge({ status }: { status: ReservationStatus }) {
  const { label, cls, icon: Icon } = MAP[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cls}`}>
      <Icon size={10} />
      {label}
    </span>
  );
}

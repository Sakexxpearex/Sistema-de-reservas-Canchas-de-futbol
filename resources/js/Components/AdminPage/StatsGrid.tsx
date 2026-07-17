import { motion } from "motion/react";
import { Calendar, Clock, TrendingUp, DollarSign } from "lucide-react";

interface StatsGridProps {
  todayCount: number;
  confirmedRevenue: string;
  pendingCount: number;
  confirmedCount: number;
}

export function StatsGrid({ todayCount, confirmedRevenue, pendingCount, confirmedCount }: StatsGridProps) {
  const items = [
    { icon: Calendar,   label: "Reservas hoy",        value: todayCount,        color: "text-blue-600",   bg: "bg-blue-50"   },
    { icon: DollarSign, label: "Ingresos confirmados", value: confirmedRevenue,  color: "text-green-600",  bg: "bg-green-50"  },
    { icon: Clock,      label: "Pendientes",           value: pendingCount,      color: "text-amber-600",  bg: "bg-amber-50"  },
    { icon: TrendingUp, label: "Confirmadas",          value: confirmedCount,    color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {items.map(({ icon: Icon, label, value, color, bg }) => (
        <motion.div key={label} whileHover={{ y: -2 }} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
          <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
            <Icon size={17} className={color} />
          </div>
          <p className="text-2xl font-black text-[#0F172A]">{value}</p>
          <p className="text-xs text-[#64748B] font-medium mt-0.5">{label}</p>
        </motion.div>
      ))}
    </div>
  );
}

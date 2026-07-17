import { router } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export function AdminHeader() {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ x: -2 }}
            onClick={() => router.get("/")}
            className="mr-1 flex items-center gap-1.5 text-[#64748B] hover:text-[#0F172A] transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Volver</span>
          </motion.button>
          
          <div className="w-px h-5 bg-[#E2E8F0]" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#16A34A] rounded-lg flex items-center justify-center shadow-sm shadow-green-400/30">
              <span className="text-sm">⚽</span>
            </div>
            <span className="font-extrabold text-[#0F172A] text-lg tracking-tight">
              Cancha<span className="text-[#16A34A]">Ya</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#16A34A] rounded-full flex items-center justify-center shadow-sm shadow-green-400/30">
            <span className="text-white text-xs font-black">A</span>
          </div>
          <span className="text-sm font-semibold text-[#0F172A] hidden sm:block">Administrador</span>
        </div>
      </div>
    </header>
  );
}

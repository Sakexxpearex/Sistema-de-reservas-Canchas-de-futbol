import { motion } from "motion/react";
import { router } from "@inertiajs/react";
import { LoginBrand } from "@/Components/LoginPage/LoginBrand";
import { LoginForm } from "@/Components/LoginPage/LoginForm";

export default function LoginPage() {


  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#16A34A]/6 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#16A34A]/4 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <LoginBrand />

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-[#0F172A]">Bienvenido de vuelta</h2>
            <p className="text-[#64748B] text-sm mt-1">Ingresa tus credenciales para continuar</p>
          </div>
          <LoginForm onSuccess={() => router.get("/admin")} />
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          ¿No eres administrador?{" "}
          <button onClick={() => router.get("/")} className="text-[#16A34A] font-semibold hover:underline">
            Ir a reservas
          </button>
        </p>
      </motion.div>
    </div>
  );
}

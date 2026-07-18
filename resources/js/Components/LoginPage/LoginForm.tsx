import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

interface LoginFormProps {
  onSuccess: () => void;
}

const CREDENTIALS = { email: "admin@futcanchas.com", password: "admin123" };

const INPUT_CLS =
  "w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] text-sm placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all";

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
      sessionStorage.setItem("auth", "1");
      onSuccess();
    } else {
      setError("Correo o contraseña incorrectos.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Correo electrónico</label>
        <div className="relative">
          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
          <input
            type="email"
            placeholder="admin@futcanchas.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            className={INPUT_CLS}
            required
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-[#0F172A]">Contraseña</label>
          <button type="button" className="text-xs text-[#16A34A] hover:text-[#15803D] font-medium transition-colors">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <div className="relative">
          <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            className={INPUT_CLS + " pr-11"}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl"
        >
          <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </motion.div>
      )}

      <motion.button
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        type="submit"
        disabled={loading || !email || !password}
        className="w-full py-3.5 bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 text-sm mt-2"
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
            Verificando...
          </>
        ) : (
          <>Ingresar <ArrowRight size={15} /></>
        )}
      </motion.button>

      <p className="text-center text-xs text-[#94A3B8] pt-1">
        Credenciales de prueba:{" "}
        <button
          type="button"
          onClick={() => { setEmail(CREDENTIALS.email); setPassword(CREDENTIALS.password); setError(""); }}
          className="text-[#16A34A] font-semibold hover:underline"
        >
          autocompletar
        </button>
      </p>
    </form>
  );
}
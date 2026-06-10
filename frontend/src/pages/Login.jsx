import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">

        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg text-4xl">
              💳
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
            ¡Bienvenido de nuevo! 👋
          </h1>
          <p className="text-center text-gray-500 text-sm mb-6">
            Ingresá a tu cuenta para continuar
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                />
                <button
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                <input type="checkbox" className="rounded border-gray-300" />
                Recordarme
              </label>
              <button className="text-blue-500 hover:text-blue-700 text-sm">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={16} /> Iniciar sesión
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 font-bold hover:underline"
            >
              Registrate
            </button>
          </p>
        </div>

        {/* Features */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-4 flex justify-around">
          {[
            { icon: "🛡️", label: "Seguro",      sub: "Tu información está protegida" },
            { icon: "📊", label: "Simple",      sub: "Gestioná tus gastos fácilmente" },
            { icon: "🧠", label: "Inteligente", sub: "Tomá mejores decisiones" },
          ].map(f => (
            <div key={f.label} className="text-center px-1">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-xs font-bold text-gray-700">{f.label}</div>
              <div className="text-xs text-gray-500 leading-tight mt-0.5 max-w-[80px]">{f.sub}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
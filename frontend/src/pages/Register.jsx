import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, CheckCircle, Plus } from "lucide-react";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checks = [
    { label: "Mínimo 8 caracteres",  ok: formData.password.length >= 8 },
    { label: "Una mayúscula",        ok: /[A-Z]/.test(formData.password) },
    { label: "Un número",            ok: /\d/.test(formData.password) },
    { label: "Un carácter especial", ok: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  const handleRegister = async () => {
    if (!formData.nombre || !formData.email || !formData.password) {
      setError("Completá todos los campos."); return;
    }
    setLoading(true); setError("");
    try {
      const response = await fetch("https://gestiongastos.duckdns.org/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Error al registrarse.");
        return;
      }
      navigate("/login");
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-2xl p-8">

          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <User size={30} className="text-blue-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">Crear cuenta</h1>
          <p className="text-center text-gray-500 text-sm mb-6">
            Registrate para empezar a gestionar tus gastos
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Nombre completo</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Tu nombre completo"
                  value={formData.nombre}
                  onChange={e => setFormData({...formData, nombre: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Correo electrónico</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Contraseña</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? "text" : "password"} placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50" />
                <button onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <div className="mt-2.5 space-y-1.5">
                {checks.map(c => (
                  <div key={c.label} className={`flex items-center gap-2 text-xs transition-colors ${c.ok ? "text-green-600" : "text-gray-400"}`}>
                    <CheckCircle size={13} className={c.ok ? "text-green-500" : "text-gray-300"} />
                    {c.label}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleRegister} disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              Crear cuenta <Plus size={16} />
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            ¿Ya tienes cuenta?{" "}
            <button onClick={() => navigate("/login")}
              className="text-blue-600 font-bold hover:underline">
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
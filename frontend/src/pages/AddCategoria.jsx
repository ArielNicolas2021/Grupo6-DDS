import { useState } from "react";
import { Tag, FileText, CheckCircle } from "lucide-react";

const AddCategoria = () => {
  const [formData, setFormData] = useState({ nombre: "", descripcion: "", tipo: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!formData.tipo) e.tipo = "El tipo es obligatorio.";
    return e;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://3.131.13.187:8080/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json();
        setServerError(data.error || "Error al guardar la categoría.");
        return;
      }
      setSuccess(true);
      setFormData({ nombre: "", descripcion: "", tipo: "" });
    } catch { setServerError("No se pudo conectar con el servidor."); }
    finally { setLoading(false); }
  };

  const tipoColor = {
    GASTO: { bg: "#fee2e2", text: "#ef4444", emoji: "💸" },
    INGRESO: { bg: "#dcfce7", text: "#22c55e", emoji: "💵" },
    AMBOS: { bg: "#dbeafe", text: "#3b82f6", emoji: "🔄" },
  };

  return (
    <div className="p-6 flex items-start justify-center" style={{ background: "#f0f4ff", minHeight: "100%" }}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg p-8 mt-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">🏷️</div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Nueva Categoría</h1>
            <p className="text-gray-500 text-sm">Creá una categoría personalizada</p>
          </div>
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3 mb-4">
            <CheckCircle size={16}/> ¡Categoría creada exitosamente!
          </div>
        )}

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Nombre</label>
            <div className="relative">
              <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="nombre" value={formData.nombre}
                onChange={handleChange} placeholder="Ej: Mascotas"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.nombre ? "border-red-400" : "border-gray-200"}`} />
            </div>
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Descripción <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <div className="relative">
              <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="descripcion" value={formData.descripcion}
                onChange={handleChange} placeholder="Ej: Gastos relacionados a mascotas"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Tipo</label>
            <div className="grid grid-cols-3 gap-3">
              {["GASTO", "INGRESO", "AMBOS"].map(t => (
                <button type="button" key={t}
                  onClick={() => { setFormData({...formData, tipo: t}); setErrors({...errors, tipo: ""}); }}
                  className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all flex items-center justify-center gap-1.5 ${
                    formData.tipo === t
                      ? "border-transparent shadow-md"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                  }`}
                  style={formData.tipo === t ? { backgroundColor: tipoColor[t].bg, color: tipoColor[t].text } : {}}>
                  {tipoColor[t].emoji} {t.charAt(0) + t.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:opacity-95 transition-all disabled:opacity-50">
            {loading ? "Guardando..." : "🏷️ Crear Categoría"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoria;
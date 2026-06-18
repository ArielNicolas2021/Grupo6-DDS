import { useState } from "react";
import { DollarSign, Tag, Calendar, FileText, CheckCircle } from "lucide-react";

const AddGasto = () => {
  const [formData, setFormData] = useState({ monto: "", categoriaId: "", fecha: "", descripcion: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.monto) e.monto = "El monto es obligatorio.";
    else if (isNaN(formData.monto) || Number(formData.monto) <= 0) e.monto = "Debe ser mayor a 0.";
    if (!formData.categoriaId) e.categoriaId = "La categoría es obligatoria.";
    if (!formData.fecha) e.fecha = "La fecha es obligatoria.";
    if (!formData.descripcion.trim()) e.descripcion = "La descripción es obligatoria.";
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
      const response = await fetch("https://gestiongastos.duckdns.org/api/gastos", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          monto: Number(formData.monto),
          descripcion: formData.descripcion,
          fecha: formData.fecha,
          categoriaId: Number(formData.categoriaId),
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        setServerError(data.error || "Error al guardar el gasto.");
        return;
      }
      setSuccess(true);
      setFormData({ monto: "", categoriaId: "", fecha: "", descripcion: "" });
    } catch { setServerError("No se pudo conectar con el servidor."); }
    finally { setLoading(false); }
  };

  const inputClass = (field) =>
    `w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
      errors[field] ? "border-red-400" : "border-gray-200"
    }`;

  return (
    <div className="p-6 flex items-start justify-center" style={{ background: "#f0f4ff", minHeight: "100%" }}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg p-8 mt-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">💸</div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Registrar Gasto</h1>
            <p className="text-gray-500 text-sm">Completá los datos del gasto</p>
          </div>
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3 mb-4">
            <CheckCircle size={16}/> ¡Gasto registrado exitosamente!
          </div>
        )}

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Monto</label>
            <div className="relative">
              <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" name="monto" value={formData.monto}
                onChange={handleChange} placeholder="Ej: 1500"
                className={inputClass("monto")} />
            </div>
            {errors.monto && <p className="text-red-500 text-xs mt-1">{errors.monto}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Categoría</label>
            <div className="relative">
              <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select name="categoriaId" value={formData.categoriaId}
                onChange={handleChange} className={inputClass("categoriaId")}>
                <option value="">Seleccioná una categoría</option>
                <option value="1">Alimentación</option>
                <option value="2">Transporte</option>
                <option value="3">Vivienda</option>
                <option value="4">Salud</option>
                <option value="5">Entretenimiento</option>
                <option value="6">Educación</option>
                <option value="10">Otro</option>
              </select>
            </div>
            {errors.categoriaId && <p className="text-red-500 text-xs mt-1">{errors.categoriaId}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Fecha</label>
            <div className="relative">
              <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="date" name="fecha" value={formData.fecha}
                onChange={handleChange} className={inputClass("fecha")} />
            </div>
            {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Descripción</label>
            <div className="relative">
              <FileText size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
              <textarea name="descripcion" value={formData.descripcion}
                onChange={handleChange} placeholder="Describí el gasto..." rows={3}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none ${errors.descripcion ? "border-red-400" : "border-gray-200"}`}
              />
            </div>
            {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:opacity-95 transition-all disabled:opacity-50">
            {loading ? "Guardando..." : "💸 Registrar Gasto"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGasto;
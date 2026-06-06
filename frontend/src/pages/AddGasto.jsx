import { useState } from "react";

const AddGasto = () => {
  const [formData, setFormData] = useState({
    monto: "",
    categoriaId: "",
    fecha: "",
    descripcion: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.monto) 
      newErrors.monto = "El monto es obligatorio.";
    else if (isNaN(formData.monto) || Number(formData.monto) <= 0)
      newErrors.monto = "El monto debe ser un número mayor a 0.";
    if (!formData.categoriaId)
      newErrors.categoriaId = "La categoría es obligatoria.";
    if (!formData.fecha)
      newErrors.fecha = "La fecha es obligatoria.";
    if (!formData.descripcion.trim())
      newErrors.descripcion = "La descripción es obligatoria.";
    return newErrors;
  };

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
    const token = localStorage.getItem("token");
    const fechaFormateada = formData.fecha;
        console.log("Datos enviados:", {
  ...formData,
  fecha: fechaFormateada,
  monto: Number(formData.monto),
    });
      const response = await fetch("http://localhost:8080/api/gastos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          monto: Number(formData.monto),
          descripcion: formData.descripcion,
          fecha: fechaFormateada,
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
    } catch (err) {
      setServerError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Registrar Gasto
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Completá los datos del gasto
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3 mb-4">
            ¡Gasto registrado exitosamente!
          </div>
        )}

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto
            </label>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              placeholder="Ej: 1500"
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.monto ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.monto && (
              <p className="text-red-500 text-xs mt-1">{errors.monto}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.categoriaId ? "border-red-400" : "border-gray-300"}`}
            >
              <option value="">Seleccioná una categoría</option>
              <option value="1">Alimentación</option>
              <option value="2">Transporte</option>
              <option value="3">vivienda</option>
              <option value="4">Salud</option>
              <option value="5">Entretenimiento</option>
              <option value="6">Educación</option>
              <option value="10">Otro</option>
            </select>
            {errors.categoriaId && (
              <p className="text-red-500 text-xs mt-1">{errors.categoriaId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fecha ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.fecha && (
              <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describí el gasto..."
              rows={3}
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.descripcion ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Registrar Gasto"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGasto;
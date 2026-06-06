import { useState } from "react";

const AddIngreso = () => {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

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
      const response = await fetch("http://localhost:8080/api/ingresos", {
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
          fuente: formData.descripcion,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.log("Error del backend:", data);
        setServerError(data.error || "Error al guardar el ingreso.");
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
          Registrar Ingreso
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Completá los datos del ingreso
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3 mb-4">
            ¡Ingreso registrado exitosamente!
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
              placeholder="Ej: 50000"
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.monto ? "border-red-400" : "border-gray-300"}`}
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
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.categoriaId ? "border-red-400" : "border-gray-300"}`}
            >
              <option value="">Seleccioná una categoría</option>
              <option value="7">Salario</option>
              <option value="8">Freelance</option>
              <option value="9">Inversiones</option>
              <option value="10">Otros ingresos</option>
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
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.fecha ? "border-red-400" : "border-gray-300"}`}
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
              placeholder="Describí el ingreso..."
              rows={3}
              className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.descripcion ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Registrar Ingreso"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddIngreso;
import { useState } from "react";

const FiltroCategorias = () => {
  const [categoriaId, setCategoriaId] = useState("");
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buscado, setBuscado] = useState(false);
  const [totalCategoria, setTotalCategoria] = useState(null);

  const handleFiltrar = async () => {
    if (!categoriaId) {
      setError("Seleccioná una categoría.");
      return;
    }
    setLoading(true);
    setError("");
    setBuscado(false);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/gastos/categoria/${categoriaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        setError("Error al filtrar los gastos.");
        return;
      }
      const data = await response.json();
      setGastos(data.gastos || []);
      setTotalCategoria(data.total || 0);
      setBuscado(true);
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Filtrar Gastos por Categoría
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccioná una categoría</option>
            <option value="1">Alimentación</option>
            <option value="2">Transporte</option>
            <option value="3">Vivienda</option>
            <option value="4">Salud</option>
            <option value="5">Entretenimiento</option>
            <option value="6">Educación</option>
            <option value="10">Otros</option>
          </select>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleFiltrar}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Filtrando..." : "Filtrar"}
        </button>
      </div>

      {buscado && totalCategoria !== null && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
          <p className="text-blue-700 font-semibold">
            Total gastado: ${Number(totalCategoria).toLocaleString()}
          </p>
        </div>
      )}

      {buscado && gastos.length === 0 && (
        <p className="text-gray-500">No hay gastos en esa categoría.</p>
      )}

      {gastos.length > 0 && (
        <div className="space-y-4">
          {gastos.map((gasto) => (
            <div
              key={gasto.id}
              className="bg-white rounded-2xl shadow-md p-5 flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-500">{gasto.descripcion}</p>
                <p className="text-xs text-gray-400 mt-1">{gasto.fecha}</p>
              </div>
              <p className="text-lg font-bold text-red-600">
                -${Number(gasto.monto).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FiltroCategorias;
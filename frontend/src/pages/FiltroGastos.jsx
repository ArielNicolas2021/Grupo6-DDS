import { useState } from "react";

const FiltroGastos = () => {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buscado, setBuscado] = useState(false);

  const handleFiltrar = async () => {
    if (!fechaDesde || !fechaHasta) {
      setError("Seleccioná ambas fechas.");
      return;
    }
    setLoading(true);
    setError("");
    setBuscado(false);

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      console.log("Fechas:", fechaDesde, fechaHasta);
      const response = await fetch(
        `http://localhost:8080/api/gastos/por-fecha?desde=${fechaDesde}&hasta=${fechaHasta}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Status:", response.status);
      if (!response.ok) {
        setError("Error al filtrar los gastos.");
        return;
      }

      const data = await response.json();
      const lista = Array.isArray(data) ? data : data.gastos || [];
      const ordenados = lista.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
      setGastos(ordenados);
      setBuscado(true);
    } catch (err) {
      console.error("Error al filtrar gastos:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Filtrar Gastos por Fecha
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desde
            </label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hasta
            </label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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

      {buscado && gastos.length === 0 && (
        <p className="text-gray-500">No hay gastos en ese período.</p>
      )}

      {gastos.length > 0 && (
        <div className="space-y-4">
          {gastos.map((gasto) => (
            <div
              key={gasto.id}
              className="bg-white rounded-2xl shadow-md p-5 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800 capitalize">
                  {gasto.categoriaNombre}
                </p>
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

export default FiltroGastos; 
import { useEffect, useState } from "react";
import { Calendar, Search } from "lucide-react";

const fmt = (n) => Number(n).toLocaleString("es-AR");

const FiltroGastos = () => {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buscado, setBuscado] = useState(false);

  const handleFiltrar = async () => {
    if (!fechaDesde || !fechaHasta) { setError("Seleccioná ambas fechas."); return; }
    setLoading(true); setError(""); setBuscado(false);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://gestiongastos.duckdns.org/api/gastos/por-fecha?desde=${fechaDesde}&hasta=${fechaHasta}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) { setError("Error al filtrar los gastos."); return; }
      const data = await response.json();
      const lista = Array.isArray(data) ? data : data.gastos || [];
      setGastos(lista.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
      setBuscado(true);
    } catch { setError("No se pudo conectar con el servidor."); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    document.title = "Filtrar por fecha | Gestor de gastos";
  }, [])

  return (
    <div className="p-6" style={{ background: "#f0f4ff", minHeight: "100%" }}>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Filtrar Gastos</h1>
        <p className="text-sm text-gray-500 mt-1">Buscá tus gastos por rango de fechas</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Desde</label>
            <div className="relative">
              <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="date" value={fechaDesde}
                onChange={e => setFechaDesde(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Hasta</label>
            <div className="relative">
              <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="date" value={fechaHasta}
                onChange={e => setFechaHasta(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button onClick={handleFiltrar} disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:opacity-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          <Search size={16} />
          {loading ? "Filtrando..." : "Filtrar gastos"}
        </button>
      </div>

      {/* Resultados */}
      {buscado && gastos.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 font-medium">No hay gastos en ese período.</p>
        </div>
      )}

      {gastos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-600">{gastos.length} resultados encontrados</p>
            <p className="text-sm font-bold text-red-500">
              Total: -${fmt(gastos.reduce((s, g) => s + Number(g.monto), 0))}
            </p>
          </div>
          {gastos.map(gasto => (
            <div key={gasto.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-lg">💸</div>
                <div>
                  <p className="font-semibold text-gray-800 capitalize">{gasto.categoriaNombre}</p>
                  <p className="text-sm text-gray-500">{gasto.descripcion}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{gasto.fecha}</p>
                </div>
              </div>
              <p className="text-lg font-bold text-red-500">-${fmt(gasto.monto)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FiltroGastos;
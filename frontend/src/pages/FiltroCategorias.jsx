import { useState } from "react";
import { Tag, Search } from "lucide-react";

const fmt = (n) => Number(n).toLocaleString("es-AR");

const categorias = [
  { id: "1",  nombre: "Alimentación" },
  { id: "2",  nombre: "Transporte" },
  { id: "3",  nombre: "Vivienda" },
  { id: "4",  nombre: "Salud" },
  { id: "5",  nombre: "Entretenimiento" },
  { id: "6",  nombre: "Educación" },
  { id: "10", nombre: "Otros" },
];

const FiltroCategorias = () => {
  const [categoriaId, setCategoriaId] = useState("");
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buscado, setBuscado] = useState(false);
  const [totalCategoria, setTotalCategoria] = useState(null);

  const handleFiltrar = async () => {
    if (!categoriaId) { setError("Seleccioná una categoría."); return; }
    setLoading(true); setError(""); setBuscado(false);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://gestiongastos.duckdns.org/api/gastos/categoria/${categoriaId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) { setError("Error al filtrar los gastos."); return; }
      const data = await response.json();
      setGastos(data.gastos || []);
      setTotalCategoria(data.total || 0);
      setBuscado(true);
    } catch { setError("No se pudo conectar con el servidor."); }
    finally { setLoading(false); }
  };

  const categoriaNombre = categorias.find(c => c.id === categoriaId)?.nombre;

  return (
    <div className="p-6" style={{ background: "#f0f4ff", minHeight: "100%" }}>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Filtrar por Categoría</h1>
        <p className="text-sm text-gray-500 mt-1">Buscá tus gastos por categoría</p>
      </div>

      {/* Filtro */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Categoría</label>
          <div className="relative">
            <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={categoriaId}
              onChange={e => setCategoriaId(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Seleccioná una categoría</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button onClick={handleFiltrar} disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:opacity-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          <Search size={16} />
          {loading ? "Filtrando..." : "Filtrar gastos"}
        </button>
      </div>

      {/* Total */}
      {buscado && totalCategoria !== null && (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg">🏷️</div>
            <div>
              <p className="text-sm font-semibold text-gray-700">{categoriaNombre}</p>
              <p className="text-xs text-gray-400">Total gastado en esta categoría</p>
            </div>
          </div>
          <p className="text-xl font-bold text-red-500">-${fmt(totalCategoria)}</p>
        </div>
      )}

      {/* Sin resultados */}
      {buscado && gastos.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 font-medium">No hay gastos en esa categoría.</p>
        </div>
      )}

      {/* Resultados */}
      {gastos.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-600 mb-2">
            {gastos.length} resultados encontrados
          </p>
          {gastos.map(gasto => (
            <div key={gasto.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-lg">💸</div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{gasto.descripcion}</p>
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

export default FiltroCategorias;
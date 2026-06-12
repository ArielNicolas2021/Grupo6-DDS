import { useState, useEffect } from "react";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/categorias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) { setError("No se pudieron cargar las categorías."); return; }
        const data = await response.json();
        setCategorias(data);
      } catch { setError("No se pudo conectar con el servidor."); }
      finally { setLoading(false); }
    };
    fetchCategorias();
  }, []);

  const gastos   = categorias.filter(c => c.tipo === "GASTO"   || c.tipo === "AMBOS");
  const ingresos = categorias.filter(c => c.tipo === "INGRESO" || c.tipo === "AMBOS");

  const emojiPorNombre = (nombre) => {
    const n = nombre?.toLowerCase();
    if (n?.includes("aliment")) return "🍔";
    if (n?.includes("transport")) return "🚗";
    if (n?.includes("vivien")) return "🏠";
    if (n?.includes("salud")) return "💊";
    if (n?.includes("entret")) return "🎬";
    if (n?.includes("educac")) return "📚";
    if (n?.includes("salario")) return "💼";
    if (n?.includes("freelance")) return "💻";
    if (n?.includes("invers")) return "📈";
    return "🏷️";
  };

  return (
    <div className="p-6" style={{ background: "#f0f4ff", minHeight: "100%" }}>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>
        <p className="text-sm text-gray-500 mt-1">Todas las categorías disponibles</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Cargando categorías...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-2 gap-6">

          {/* Gastos */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-base">💸</div>
              <h2 className="text-base font-bold text-gray-800">Categorías de Gastos</h2>
              <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-xl">
                {gastos.length}
              </span>
            </div>
            <div className="space-y-2">
              {gastos.map(cat => (
                <div key={cat.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-base flex-shrink-0">
                    {emojiPorNombre(cat.nombre)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{cat.nombre}</p>
                    <p className="text-xs text-gray-500">{cat.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ingresos */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-base">💵</div>
              <h2 className="text-base font-bold text-gray-800">Categorías de Ingresos</h2>
              <span className="ml-auto bg-green-100 text-green-600 text-xs font-bold px-2.5 py-1 rounded-xl">
                {ingresos.length}
              </span>
            </div>
            <div className="space-y-2">
              {ingresos.map(cat => (
                <div key={cat.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-base flex-shrink-0">
                    {emojiPorNombre(cat.nombre)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{cat.nombre}</p>
                    <p className="text-xs text-gray-500">{cat.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Categorias;
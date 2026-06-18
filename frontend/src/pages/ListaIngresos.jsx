import { useState, useEffect } from "react";

const fmt = (n) => Number(n).toLocaleString("es-AR");

const ListaIngresos = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://gestiongastos.duckdns.org/api/ingresos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) { setError("No se pudieron cargar los ingresos."); return; }
        const data = await response.json();
        setIngresos(data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
      } catch { setError("No se pudo conectar con el servidor."); }
      finally { setLoading(false); }
    };
    fetchIngresos();
  }, []);

  return (
    <div className="p-6" style={{ background: "#f0f4ff", minHeight: "100%" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Historial de Ingresos</h1>
          <p className="text-sm text-gray-500 mt-1">Todos tus ingresos registrados</p>
        </div>
        <div className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1.5 rounded-xl">
          {ingresos.length} ingresos
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">Cargando ingresos...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && ingresos.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <div className="text-4xl mb-3">💵</div>
          <p className="text-gray-500 font-medium">No tenés ingresos registrados todavía.</p>
        </div>
      )}

      {!loading && ingresos.length > 0 && (
        <div className="space-y-3">
          {ingresos.map((ingreso) => (
            <div key={ingreso.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-lg">
                    💵
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 capitalize">
                      {ingreso.categoriaNombre}
                    </p>
                    <p className="text-sm text-gray-500">{ingreso.descripcion}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{ingreso.fecha}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-500">
                  +${fmt(ingreso.monto)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaIngresos;
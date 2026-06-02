import { useState, useEffect } from "react";

const ListaGastos = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/gastos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          setError("No se pudieron cargar los gastos.");
          return;
        }
        const data = await response.json();
        const ordenados = data.sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setGastos(ordenados);
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Historial de Gastos
      </h1>

      {loading && (
        <p className="text-gray-500">Cargando gastos...</p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && gastos.length === 0 && (
        <p className="text-gray-500">No tenés gastos registrados todavía.</p>
      )}

      {!loading && gastos.length > 0 && (
        <div className="space-y-4">
          {gastos.map((gasto) => (
            <div
              key={gasto.id}
              className="bg-white rounded-2xl shadow-md p-5 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800 capitalize">
                  {gasto.categoria}
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

export default ListaGastos;
import { useState, useEffect } from "react";

const ListaIngresos = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/ingresos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          setError("No se pudieron cargar los ingresos.");
          return;
        }
        const data = await response.json();
        const ordenados = data.sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setIngresos(ordenados);
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Historial de Ingresos
      </h1>

      {loading && (
        <p className="text-gray-500">Cargando ingresos...</p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && ingresos.length === 0 && (
        <p className="text-gray-500">No tenés ingresos registrados todavía.</p>
      )}

      {!loading && ingresos.length > 0 && (
        <div className="space-y-4">
          {ingresos.map((ingreso) => (
            <div
              key={ingreso.id}
              className="bg-white rounded-2xl shadow-md p-5 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800 capitalize">
                  {ingreso.categoriaNombre}
                </p>
                <p className="text-sm text-gray-500">{ingreso.descripcion}</p>
                <p className="text-xs text-gray-400 mt-1">{ingreso.fecha}</p>
              </div>
              <p className="text-lg font-bold text-green-600">
                +${Number(ingreso.monto).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaIngresos;
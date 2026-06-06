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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          setError("No se pudieron cargar las categorías.");
          return;
        }
        const data = await response.json();
        setCategorias(data);
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const gastos = categorias.filter((c) => c.tipo === "GASTO" || c.tipo === "AMBOS");
  const ingresos = categorias.filter((c) => c.tipo === "INGRESO" || c.tipo === "AMBOS");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Categorías disponibles
      </h1>

      {loading && <p className="text-gray-500">Cargando categorías...</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <h2 className="text-lg font-semibold text-red-600 mb-3">
              💸 Categorías de Gastos
            </h2>
            <div className="space-y-2">
              {gastos.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-xl shadow p-4 border-l-4 border-red-400"
                >
                  <p className="font-medium text-gray-800">{cat.nombre}</p>
                  <p className="text-sm text-gray-500">{cat.descripcion}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-green-600 mb-3">
              💰 Categorías de Ingresos
            </h2>
            <div className="space-y-2">
              {ingresos.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-xl shadow p-4 border-l-4 border-green-400"
                >
                  <p className="font-medium text-gray-800">{cat.nombre}</p>
                  <p className="text-sm text-gray-500">{cat.descripcion}</p>
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
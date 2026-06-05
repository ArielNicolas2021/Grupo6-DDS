import { useState, useEffect } from "react";

const ListaGastos = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({});

  useEffect(() => {
    fetchGastos();
  }, []);

  const fetchGastos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/gastos", {
        headers: { Authorization: `Bearer ${token}` },
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

  const handleEditar = (gasto) => {
    setEditando(gasto.id);
    setFormEdit({ ...gasto });
  };
  const handleEliminar = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/gastos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      alert("Error al eliminar el gasto.");
      return;
    }
    fetchGastos();
  } catch (err) {
    alert("No se pudo conectar con el servidor.");
  }
};
  function handleCancelar() {
    setEditando(null);
    setFormEdit({});
  }

  const handleGuardar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/gastos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formEdit,
          monto: Number(formEdit.monto),
        }),
      });
      if (!response.ok) {
        alert("Error al guardar los cambios.");
        return;
      }
      setEditando(null);
      fetchGastos();
    } catch (err) {
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Historial de Gastos
      </h1>

      {loading && <p className="text-gray-500">Cargando gastos...</p>}

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
            <div key={gasto.id} className="bg-white rounded-2xl shadow-md p-5">
              {editando === gasto.id ? (
                <div className="space-y-3">
                  <input
                    type="number"
                    value={formEdit.monto}
                    onChange={(e) => setFormEdit({ ...formEdit, monto: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                    placeholder="Monto"
                  />
                  <select
                    value={formEdit.categoria}
                    onChange={(e) => setFormEdit({ ...formEdit, categoria: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  >
                    <option value="comida">Comida</option>
                    <option value="transporte">Transporte</option>
                    <option value="salud">Salud</option>
                    <option value="ocio">Ocio</option>
                    <option value="educacion">Educación</option>
                    <option value="otro">Otro</option>
                  </select>
                  <input
                    type="date"
                    value={formEdit.fecha}
                    onChange={(e) => setFormEdit({ ...formEdit, fecha: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={formEdit.descripcion}
                    onChange={(e) => setFormEdit({ ...formEdit, descripcion: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                    placeholder="Descripción"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGuardar(gasto.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancelar}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800 capitalize">
                      {gasto.categoria}
                    </p>
                    <p className="text-sm text-gray-500">{gasto.descripcion}</p>
                    <p className="text-xs text-gray-400 mt-1">{gasto.fecha}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-lg font-bold text-red-600">
                      -${Number(gasto.monto).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleEditar(gasto)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-lg"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("¿Estás seguro que querés eliminar este gasto?")) {
                          handleEliminar(gasto.id);
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-lg"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaGastos;
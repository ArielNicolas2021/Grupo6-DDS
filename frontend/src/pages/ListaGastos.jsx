import { useState, useEffect } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";

const fmt = (n) => Number(n).toLocaleString("es-AR");

const ListaGastos = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({});

  useEffect(() => { fetchGastos(); }, []);

  const fetchGastos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/gastos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) { setError("No se pudieron cargar los gastos."); return; }
      const data = await response.json();
      setGastos(data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
    } catch { setError("No se pudo conectar con el servidor."); }
    finally { setLoading(false); }
  };

  const handleEditar = (gasto) => { setEditando(gasto.id); setFormEdit({ ...gasto }); };
  const handleCancelar = () => { setEditando(null); setFormEdit({}); };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este gasto?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8080/api/gastos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGastos();
    } catch { alert("No se pudo conectar con el servidor."); }
  };

  const handleGuardar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/gastos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formEdit, monto: Number(formEdit.monto) }),
      });
      if (!response.ok) { alert("Error al guardar los cambios."); return; }
      setEditando(null);
      fetchGastos();
    } catch { alert("No se pudo conectar con el servidor."); }
  };

  return (
    <div className="p-6" style={{ background: "#f0f4ff", minHeight: "100%" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Historial de Gastos</h1>
          <p className="text-sm text-gray-500 mt-1">Todos tus gastos registrados</p>
        </div>
        <div className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-xl">
          {gastos.length} gastos
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400 text-sm">Cargando gastos...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && gastos.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <div className="text-4xl mb-3">💸</div>
          <p className="text-gray-500 font-medium">No tenés gastos registrados todavía.</p>
        </div>
      )}

      {!loading && gastos.length > 0 && (
        <div className="space-y-3">
          {gastos.map((gasto) => (
            <div key={gasto.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              {editando === gasto.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" value={formEdit.monto}
                      onChange={e => setFormEdit({ ...formEdit, monto: e.target.value })}
                      placeholder="Monto"
                      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <input type="date" value={formEdit.fecha}
                      onChange={e => setFormEdit({ ...formEdit, fecha: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <input type="text" value={formEdit.descripcion}
                    onChange={e => setFormEdit({ ...formEdit, descripcion: e.target.value })}
                    placeholder="Descripción"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <div className="flex gap-2">
                    <button onClick={() => handleGuardar(gasto.id)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all">
                      <Check size={15}/> Guardar
                    </button>
                    <button onClick={handleCancelar}
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-xl transition-all">
                      <X size={15}/> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-lg">
                      💸
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 capitalize">{gasto.categoria}</p>
                      <p className="text-sm text-gray-500">{gasto.descripcion}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{gasto.fecha}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-red-500">-${fmt(gasto.monto)}</p>
                    <button onClick={() => handleEditar(gasto)}
                      className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                      <Pencil size={13}/> Editar
                    </button>
                    <button onClick={() => handleEliminar(gasto.id)}
                      className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                      <Trash2 size={13}/> Eliminar
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
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, CreditCard, TrendingUp, Tag, SlidersHorizontal, List, Bell, ChevronRight, Star, Plus } from "lucide-react";

const sideOps = [
  { path: "/agregar-gasto", icon: CreditCard, label: "Gastos", color: "#ef4444" },
  { path: "/agregar-ingreso", icon: TrendingUp, label: "Ingresos", color: "#22c55e" },
  { path: "/categorias", icon: Tag, label: "Categorías", color: "#f59e0b" },
  { path: "/filtro-gastos", icon: SlidersHorizontal, label: "Filtro por Fecha", color: "#8b5cf6" },
  { path: "/filtro-categorias", icon: SlidersHorizontal, label: "Filtro por Categoría", color: "#8b5cf6" },
  { path: "/agregar-categoria", icon: Plus, label: "Nueva Categoría", color: "#f59e0b" },
];

const sideHist = [
  { path: "/gastos", icon: List, label: "Lista de Gastos", color: "#ef4444" },
  { path: "/ingresos", icon: List, label: "Lista de Ingresos", color: "#22c55e" },
];

function SidebarButton({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active
        ? "bg-blue-600 text-white shadow-lg"
        : "text-gray-400 hover:bg-white/10 hover:text-white"
        }`}
    >
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: item.color + "22" }}
      >
        <item.icon size={14} style={{ color: active ? "#fff" : item.color }} />
      </div>
      {item.label}
      <ChevronRight size={13} className="ml-auto opacity-40" />
    </button>
  );
}

function getNombreUsuario() {
  return localStorage.getItem("nombreUsuario") || "usuario";
}

function getIniciales(nombre) {
  return nombre
    .split(/[.\s]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join("");
}

function generarNotificaciones(gastos, ingresos) {
  const notifs = [];
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const anioActual = hoy.getFullYear();

  const gastosMes = gastos.filter(g => {
    const f = new Date(g.fecha);
    return f.getMonth() === mesActual && f.getFullYear() === anioActual;
  });
  const ingresosMes = ingresos.filter(i => {
    const f = new Date(i.fecha);
    return f.getMonth() === mesActual && f.getFullYear() === anioActual;
  });

  const totalGastosMes = gastosMes.reduce((s, g) => s + Number(g.monto), 0);
  const totalIngresosMes = ingresosMes.reduce((s, i) => s + Number(i.monto), 0);

  // 💸 Gasto alto individual
  gastosMes
    .filter(g => Number(g.monto) > 50000)
    .slice(0, 2)
    .forEach(g => {
      notifs.push({
        icon: "💸",
        bg: "#fee2e2",
        titulo: "Gasto elevado",
        mensaje: `Registraste $${Number(g.monto).toLocaleString("es-AR")} en ${g.categoriaNombre || "una categoría"}`,
        fecha: g.fecha,
      });
    });

  // 🏷️ Categoría sobrecargada (>=40% del total del mes)
  if (totalGastosMes > 0) {
    const porCategoria = {};
    gastosMes.forEach(g => {
      const cat = g.categoriaNombre || "Otros";
      porCategoria[cat] = (porCategoria[cat] || 0) + Number(g.monto);
    });
    Object.entries(porCategoria).forEach(([cat, monto]) => {
      const pct = (monto / totalGastosMes) * 100;
      if (pct >= 40) {
        notifs.push({
          icon: "🏷️",
          bg: "#ffedd5",
          titulo: "Categoría con gasto alto",
          mensaje: `${cat} representa el ${Math.round(pct)}% de tus gastos este mes`,
          fecha: hoy.toISOString().split("T")[0],
        });
      }
    });
  }

  // ⚠️ Presupuesto excedido
  if (totalGastosMes > totalIngresosMes && totalIngresosMes > 0) {
    notifs.push({
      icon: "⚠️",
      bg: "#fef9c3",
      titulo: "Presupuesto excedido",
      mensaje: "Tus gastos superaron tus ingresos este mes",
      fecha: hoy.toISOString().split("T")[0],
    });
  }

  // 📊 Resumen semanal (si hoy es lunes)
  if (hoy.getDay() === 1) {
    const haceUnaSemana = new Date(hoy);
    haceUnaSemana.setDate(hoy.getDate() - 7);
    const gastosSemana = gastos.filter(g => {
      const f = new Date(g.fecha);
      return f >= haceUnaSemana && f < hoy;
    });
    const totalSemana = gastosSemana.reduce((s, g) => s + Number(g.monto), 0);
    if (totalSemana > 0) {
      notifs.push({
        icon: "📊",
        bg: "#dcfce7",
        titulo: "Resumen semanal",
        mensaje: `La semana pasada gastaste $${totalSemana.toLocaleString("es-AR")} en total`,
        fecha: hoy.toISOString().split("T")[0],
      });
    }
  }

  // ⏰ Inactividad (sin movimientos en 3+ días)
  const todos = [...gastos, ...ingresos].map(m => new Date(m.fecha));
  if (todos.length > 0) {
    const ultimaFecha = new Date(Math.max(...todos));
    const diffDias = Math.floor((hoy - ultimaFecha) / (1000 * 60 * 60 * 24));
    if (diffDias >= 3) {
      notifs.push({
        icon: "⏰",
        bg: "#dbeafe",
        titulo: "Sin movimientos recientes",
        mensaje: `No registraste nada hace ${diffDias} días, ¿todo en orden?`,
        fecha: hoy.toISOString().split("T")[0],
      });
    }
  }

  return notifs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);

  const nombreUsuario = getNombreUsuario();
  const iniciales = getIniciales(nombreUsuario);

  const irA = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch("https://gestiongastos.duckdns.org/api/gastos", { headers })
        .then((r) => (r.ok ? r.json() : [])),
      fetch("https://gestiongastos.duckdns.org/api/ingresos", { headers })
        .then((r) => (r.ok ? r.json() : []))
    ])
      .then(([gastos, ingresos]) => {
        console.log("GASTOS:", gastos);
        console.log("INGRESOS:", ingresos);
        setNotificaciones(generarNotificaciones(gastos, ingresos));
      })
      .catch((err) => {
        console.log("ERROR NOTIFS:", err);
        setNotificaciones([]);
      });

  }, []);

  return (
    <div className="flex h-screen font-sans relative">
      {/* ── SIDEBAR ── */}
      <div
        className={`fixed md:relative z-50 md:z-auto top-0 left-0 h-full w-64 flex flex-col text-white overflow-y-auto transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ background: "#1a2035" }}>

        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-sm">
            💳
          </div>
          <span className="font-bold text-sm leading-tight">
            Gestor de<br />Gastos
          </span>
        </div>

        <div className="md:hidden absolute top-4 right-4">
          <button onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 p-3 space-y-1">
          {/* Dashboard */}
          <button
            onClick={() => irA("/dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${pathname === "/dashboard"
              ? "bg-blue-600 text-white shadow-lg"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
          >
            <LayoutDashboard size={17} />
            Dashboard
          </button>

          {/* Operaciones */}
          <p className="text-xs font-semibold text-gray-500 px-3 pt-4 pb-1 uppercase tracking-wider">
            Operaciones
          </p>
          {sideOps.map((item) => (
            <SidebarButton
              key={item.path}
              item={item}
              active={pathname === item.path}
              onClick={() => irA(item.path)}
            />
          ))}

          {/* Historiales */}
          <p className="text-xs font-semibold text-gray-500 px-3 pt-4 pb-1 uppercase tracking-wider">
            Historiales
          </p>
          {sideHist.map((item) => (
            <SidebarButton
              key={item.path}
              item={item}
              active={pathname === item.path}
              onClick={() => irA(item.path)}
            />
          ))}
        </div>

        {/* Consejo del día */}
        <div className="p-3">
          <div className="rounded-2xl p-4"
            style={{ background: "linear-gradient(135deg, #1e3a5f, #1e1b4b)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Star size={13} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-yellow-400">Consejo del día</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-3">
              Llevá un control de tus gastos diarios para alcanzar tus metas financieras.
            </p>
            <div className="flex justify-center text-3xl">📊</div>
          </div>
        </div>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        {/* Topbar */}
        <div className="flex justify-between items-center sm:block">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={22} />
          </button>
          <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-white border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3 ml-auto">

              {/* Notificaciones */}
              <div className="">
                <button onClick={() => setShowNotifs(p => !p)}
                  className=" p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Bell size={18} className="text-gray-600" />
                  {notificaciones.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                {showNotifs && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifs(false)} />
                    <div className="absolute right-4 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 text-sm">Notificaciones</h3>
                        <p className="text-xs text-gray-400">{notificaciones.length} alertas activas</p>
                      </div>
                      {notificaciones.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">
                          <div className="text-2xl mb-2">🔔</div>
                          Todo en orden, sin alertas
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {notificaciones.map((n, i) => (
                            <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex gap-3">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                                style={{ backgroundColor: n.bg }}>{n.icon}</div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800">{n.titulo}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{n.mensaje}</p>
                                <p className="text-xs text-gray-300 mt-1">{n.fecha}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Usuario */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {iniciales}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Hola, {nombreUsuario.charAt(0).toUpperCase() + nombreUsuario.slice(1)}
                </span>
                <ChevronRight size={13} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Outlet: acá se renderizan las páginas */}
        <div className="flex-1 overflow-y-auto" style={{ background: "#f0f4ff" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

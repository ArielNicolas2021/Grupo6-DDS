import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard, CreditCard, TrendingUp, Tag,
  SlidersHorizontal, List, Bell, ChevronRight, Star, Plus
} from "lucide-react";

const sideOps = [
  { path: "/agregar-gasto",    icon: CreditCard,        label: "Gastos",     color: "#ef4444" },
  { path: "/agregar-ingreso",  icon: TrendingUp,        label: "Ingresos",   color: "#22c55e" },
  { path: "/categorias",       icon: Tag,               label: "Categorías", color: "#f59e0b" },
 { path: "/filtro-gastos",      icon: SlidersHorizontal, label: "Filtro por Fecha",      color: "#8b5cf6" },
 { path: "/filtro-categorias",  icon: SlidersHorizontal, label: "Filtro por Categoría",  color: "#8b5cf6" },
 { path: "/agregar-categoria", icon: Plus, label: "Nueva Categoría", color: "#f59e0b" },

];

const sideHist = [
  { path: "/gastos",   icon: List, label: "Lista de Gastos",   color: "#ef4444" },
  { path: "/ingresos", icon: List, label: "Lista de Ingresos", color: "#22c55e" },
];

function SidebarButton({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
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

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* ── SIDEBAR ── */}
      <div className="w-56 flex-shrink-0 flex flex-col text-white overflow-y-auto"
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

        <div className="flex-1 p-3 space-y-1">
          {/* Dashboard */}
          <button
            onClick={() => navigate("/dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              pathname === "/dashboard"
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
              onClick={() => navigate(item.path)}
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
              onClick={() => navigate(item.path)}
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

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-end px-6 py-3 bg-white border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                G
              </div>
              <span className="text-sm font-medium text-gray-700">Hola, Gabriel</span>
              <ChevronRight size={13} className="text-gray-400" />
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

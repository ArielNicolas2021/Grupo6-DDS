import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fmt = (n) => new Intl.NumberFormat("es-AR").format(Math.abs(n));

const categoryData = [
  { name: "Alimentación",    value: 45000, color: "#ef4444" },
  { name: "Transporte",      value: 30000, color: "#3b82f6" },
  { name: "Entretenimiento", value: 20000, color: "#f59e0b" },
  { name: "Servicios",       value: 15000, color: "#10b981" },
  { name: "Otros",           value: 15000, color: "#8b5cf6" },
];

const movements = [
  { name: "Supermercado", cat: "Alimentación",    amount: -15000, date: "06/08/2026", color: "#ef4444", emoji: "🛒" },
  { name: "Combustible",  cat: "Transporte",      amount: -10000, date: "06/08/2026", color: "#3b82f6", emoji: "⛽" },
  { name: "Sueldo",       cat: "Ingreso",         amount: 350000, date: "05/08/2026", color: "#10b981", emoji: "💼" },
  { name: "Cine",         cat: "Entretenimiento", amount:  -8000, date: "04/08/2026", color: "#f59e0b", emoji: "🎬" },
];

const quickActions = [
  { path: "/agregar-gasto",   icon: "📝", label: "Registrar Gasto",   sub: "Agregá un nuevo gasto",   bg: "#fee2e2" },
  { path: "/gastos",          icon: "👁️",  label: "Ver Gastos",        sub: "Revisá tu historial",     bg: "#fee2e2" },
  { path: "/filtro-gastos",   icon: "🔍", label: "Filtrar Gastos",    sub: "Por fecha o categoría",   bg: "#ede9fe" },
  { path: "/agregar-ingreso", icon: "💰", label: "Registrar Ingreso", sub: "Agregá un nuevo ingreso", bg: "#dcfce7" },
  { path: "/ingresos",        icon: "📈", label: "Ver Ingresos",      sub: "Revisá tu historial",     bg: "#dcfce7" },
  { path: "/categorias",      icon: "🏷️", label: "Categorías",        sub: "Ver y crear categorías",  bg: "#fef3c7" },
];

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const r = 48, cx = 65, cy = 65, stroke = 20;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={130} height={130} style={{ flexShrink: 0 }}>
      {data.map((d, i) => {
        const pct = d.value / total;
        const dash = pct * circ;
        const gap = circ - dash;
        const rotate = offset * 360 - 90;
        offset += pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={d.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rotate} ${cx} ${cy})`}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">

      {/* Banner */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb, #4f46e5)" }}>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-6xl opacity-70 select-none">💳</div>
        <div className="absolute right-24 top-3 text-3xl opacity-50 select-none">💰</div>
        <div className="absolute right-14 bottom-2 text-2xl opacity-40 select-none">🌿</div>
        <h2 className="text-2xl font-bold mb-1">¡Buen día, Gabriel! 👋</h2>
        <p className="text-blue-100 text-sm max-w-xs leading-relaxed">
          Controlá tus finanzas de manera simple y mantené un seguimiento de tus gastos e ingresos.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Gastos del mes",   value: 125000, color: "#ef4444", bg: "#fee2e2", icon: "💸", change: "12% vs mes anterior", up: false },
          { label: "Ingresos del mes", value: 200000, color: "#22c55e", bg: "#dcfce7", icon: "💵", change: "8% vs mes anterior",  up: true  },
          { label: "Balance actual",   value:  75000, color: "#3b82f6", bg: "#dbeafe", icon: "🏦", change: "20% vs mes anterior", up: true  },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500">{s.label}</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ backgroundColor: s.bg }}>{s.icon}</div>
            </div>
            <div className="text-2xl font-bold mb-1.5" style={{ color: s.color }}>
              ${fmt(s.value)}
            </div>
            <div className={`flex items-center gap-1 text-xs ${s.up ? "text-green-600" : "text-red-500"}`}>
              {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div>
        <h3 className="text-base font-bold text-gray-800 mb-3">Accesos rápidos</h3>
        <div className="grid grid-cols-6 gap-3">
          {quickActions.map(a => (
            <div key={a.path} onClick={() => navigate(a.path)}
              className="bg-white rounded-2xl p-4 text-center cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all border border-gray-100">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mx-auto mb-2"
                style={{ backgroundColor: a.bg }}>{a.icon}</div>
              <div className="text-xs font-bold text-gray-700 leading-tight mb-1">{a.label}</div>
              <div className="text-xs text-gray-400 leading-tight">{a.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico + Movimientos */}
      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">Gastos por categoría</h3>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 bg-gray-50 focus:outline-none">
              <option>Este mes</option>
            </select>
          </div>
          <div className="flex gap-3 items-center">
            <DonutChart data={categoryData} />
            <div className="flex-1 space-y-2">
              {categoryData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-gray-600">{d.name}</span>
                  </div>
                  <span className="font-semibold text-gray-700">${fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">Últimos movimientos</h3>
            <button onClick={() => navigate("/gastos")}
              className="text-xs text-blue-600 hover:underline font-semibold">
              Ver todos
            </button>
          </div>
          <div className="space-y-3">
            {movements.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ backgroundColor: m.color + "20" }}>{m.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-700 truncate">{m.name}</div>
                  <div className="text-xs text-gray-400">{m.cat}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-xs font-bold ${m.amount > 0 ? "text-green-600" : "text-red-500"}`}>
                    {m.amount > 0 ? "+" : "-"}${fmt(m.amount)}
                  </div>
                  <div className="text-xs text-gray-400">{m.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
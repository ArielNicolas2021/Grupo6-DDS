import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fmt = (n) => new Intl.NumberFormat("es-AR").format(Math.abs(n));

const COLORS = ["#ef4444","#3b82f6","#f59e0b","#10b981","#8b5cf6"];

function getSaludo() {
  const hora = new Date().getHours();
  const nombre = localStorage.getItem("nombreUsuario") || "Usuario";
  if (hora >= 6 && hora < 12)  return { texto: `¡Buenos días, ${nombre}!`,  emoji: "🌅" };
  if (hora >= 12 && hora < 19) return { texto: `¡Buenas tardes, ${nombre}!`, emoji: "☀️" };
  return { texto: `¡Buenas noches, ${nombre}!`, emoji: "🌙" };
}

function DonutChart({ data }) {
  if (!data.length) return <div style={{width:130,height:130,flexShrink:0}} className="flex items-center justify-center text-gray-300 text-xs">Sin datos</div>;
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
            transform={`rotate(${rotate} ${cx} ${cy})`} />
        );
      })}
      <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
    </svg>
  );
}

const quickActions = [
  { path: "/agregar-gasto",    icon: "📝", label: "Registrar Gasto",    sub: "Agregá un nuevo gasto",   bg: "#fee2e2" },
  { path: "/gastos",           icon: "👁️",  label: "Ver Gastos",         sub: "Revisá tu historial",     bg: "#fee2e2" },
  { path: "/filtro-gastos",    icon: "🔍", label: "Filtrar Gastos",     sub: "Por fecha o categoría",   bg: "#ede9fe" },
  { path: "/agregar-ingreso",  icon: "💰", label: "Registrar Ingreso",  sub: "Agregá un nuevo ingreso", bg: "#dcfce7" },
  { path: "/ingresos",         icon: "📈", label: "Ver Ingresos",       sub: "Revisá tu historial",     bg: "#dcfce7" },
  { path: "/categorias",       icon: "🏷️", label: "Categorías",         sub: "Ver y crear categorías",  bg: "#fef3c7" },
  { path: "/filtro-categorias",icon: "🏷️", label: "Filtrar Categoría",  sub: "Por categoría",           bg: "#ede9fe" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [gastosMes, setGastosMes]     = useState(0);
  const [ingresosMes, setIngresosMes] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [movements, setMovements]     = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {
        // Gastos del mes
        const gRes = await fetch("https://gestiongastos.duckdns.org/api/gastos/por-fecha?tipo=MES", { headers });
        if (gRes.ok) {
          const gData = await gRes.json();
          setGastosMes(gData.total || 0);

          // Agrupar por categoría para el donut
          const porCat = {};
          (gData.gastos || []).forEach(g => {
            const cat = g.categoriaNombre || "Otros";
            porCat[cat] = (porCat[cat] || 0) + Number(g.monto);
          });
          setCategoryData(
            Object.entries(porCat).map(([name, value], i) => ({
              name, value, color: COLORS[i % COLORS.length]
            }))
          );

          // Últimos 4 movimientos
          const ultimos = [...(gData.gastos || [])]
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .slice(0, 4)
            .map(g => ({
              name: g.descripcion || g.categoriaNombre,
              cat: g.categoriaNombre,
              amount: -Number(g.monto),
              date: g.fecha,
              color: "#ef4444",
              emoji: "💸"
            }));
          setMovements(ultimos);
        }

        // Ingresos del mes
        const iRes = await fetch("https://gestiongastos.duckdns.org/api/ingresos", { headers });
        if (iRes.ok) {
          const iData = await iRes.json();
          const hoy = new Date();
          const totalMes = iData
            .filter(i => {
              const f = new Date(i.fecha);
              return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
            })
            .reduce((s, i) => s + Number(i.monto), 0);
          setIngresosMes(totalMes);
        }
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    document.title = "Inicio | Gestor de gastos";
  }, []);

  const balance = ingresosMes - gastosMes;
  const saludo = getSaludo();

  return (
    <div className="p-3 sm:p-6 space-y-6">

      {/* Banner */}
      <div className="rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb, #4f46e5)" }}>
        <div className="hidden sm:block absolute right-6 top-1/2 -translate-y-1/2 text-6xl opacity-70 select-none">💳</div>
        <div className="hidden sm:block absolute right-24 top-1/2 -translate-y-1/2 text-6xl opacity-70 select-none">💰</div>
        <div className="hidden sm:block absolute right-14 top-1/2 -translate-y-1/2 text-6xl opacity-70 select-none">🌿</div>
        <h2 className="text-xl sm:text-2xl font-bold mb-1">{saludo.emoji} {saludo.texto}</h2>
        <p className="text-blue-100 text-sm max-w-xs leading-relaxed">
          Controlá tus finanzas de manera simple y mantené un seguimiento de tus gastos e ingresos.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Gastos del mes",   value: gastosMes,  color: "#ef4444", bg: "#fee2e2", icon: "💸", change: "Este mes", up: false },
          { label: "Ingresos del mes", value: ingresosMes,color: "#22c55e", bg: "#dcfce7", icon: "💵", change: "Este mes", up: true  },
          { label: "Balance actual",   value: balance,    color: balance >= 0 ? "#3b82f6" : "#ef4444", bg: "#dbeafe", icon: "🏦", change: balance >= 0 ? "Positivo" : "Negativo", up: balance >= 0 },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"/>
                <div className="h-7 bg-gray-200 rounded w-1/2"/>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500">{s.label}</span>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: s.bg }}>{s.icon}</div>
                </div>
                <div className="text-xl sm:text-2xl font-bold mb-1.5" style={{ color: s.color }}>
                  {s.value < 0 ? "-" : ""}${fmt(s.value)}
                </div>
                <div className={`flex items-center gap-1 text-xs ${s.up ? "text-green-600" : "text-red-500"}`}>
                  {s.up ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                  {s.change}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div>
        <h3 className="text-base font-bold text-gray-800 mb-3">Accesos rápidos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map(a => (
            <div key={a.path} onClick={() => navigate(a.path)}
              className="bg-white rounded-2xl p-4 text-center cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all border border-gray-100">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mx-auto mb-2"
                style={{ backgroundColor: a.bg }}>{a.icon}</div>
              <div className="text-xs font-bold text-gray-700 leading-tight mb-1 break-words">{a.label}</div>
              <div className="text-xs text-gray-400 leading-tight">{a.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico + Movimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">Gastos por categoría</h3>
            <span className="text-xs text-gray-400">Este mes</span>
          </div>
          {loading ? (
            <div className="animate-pulse flex gap-3 items-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full"/>
              <div className="flex-1 space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-3 bg-gray-200 rounded"/>)}
              </div>
            </div>
          ) : categoryData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-xs">Sin gastos este mes</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <DonutChart data={categoryData} />
              <div className="flex-1 space-y-2 w-full sm:w-auto">
                {categoryData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}/>
                      <span className="text-gray-600">{d.name}</span>
                    </div>
                    <span className="font-semibold text-gray-700">${fmt(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">Últimos movimientos</h3>
            <button onClick={() => navigate("/gastos")}
              className="text-xs text-blue-600 hover:underline font-semibold">
              Ver todos
            </button>
          </div>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-200 rounded-xl"/>)}
            </div>
          ) : movements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-xs">Sin movimientos este mes</p>
            </div>
          ) : (
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
                    <div className="text-xs font-bold text-red-500">-${fmt(m.amount)}</div>
                    <div className="text-xs text-gray-400">{m.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
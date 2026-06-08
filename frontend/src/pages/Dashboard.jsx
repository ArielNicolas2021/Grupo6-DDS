import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Bienvenido 👋
      </h1>
      <p className="text-gray-500 mb-8">
        ¿Qué querés hacer hoy?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Link to="/agregar-gasto" className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow hover:shadow-md transition">
          <p className="text-2xl mb-2">💸</p>
          <p className="font-semibold text-red-700">Registrar Gasto</p>
          <p className="text-sm text-gray-500 mt-1">Agregá un nuevo gasto</p>
        </Link>

        <Link to="/gastos" className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow hover:shadow-md transition">
          <p className="text-2xl mb-2">📋</p>
          <p className="font-semibold text-red-700">Ver Gastos</p>
          <p className="text-sm text-gray-500 mt-1">Revisá tu historial de gastos</p>
        </Link>

        <Link to="/filtro-gastos" className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow hover:shadow-md transition">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-semibold text-red-700">Filtrar Gastos</p>
          <p className="text-sm text-gray-500 mt-1">Filtrá por fecha o categoría</p>
        </Link>

        <Link to="/agregar-ingreso" className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow hover:shadow-md transition">
          <p className="text-2xl mb-2">💰</p>
          <p className="font-semibold text-green-700">Registrar Ingreso</p>
          <p className="text-sm text-gray-500 mt-1">Agregá un nuevo ingreso</p>
        </Link>

        <Link to="/ingresos" className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow hover:shadow-md transition">
          <p className="text-2xl mb-2">📈</p>
          <p className="font-semibold text-green-700">Ver Ingresos</p>
          <p className="text-sm text-gray-500 mt-1">Revisá tu historial de ingresos</p>
        </Link>

        <Link to="/categorias" className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow hover:shadow-md transition">
          <p className="text-2xl mb-2">🏷️</p>
          <p className="font-semibold text-blue-700">Categorías</p>
          <p className="text-sm text-gray-500 mt-1">Ver y crear categorías</p>
        </Link>

      </div>
    </div>
  );
};

export default Dashboard;
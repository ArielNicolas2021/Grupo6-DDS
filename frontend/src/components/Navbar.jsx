import { Link } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">💰 Gestor de Gastos</h1>
        
        {token ? (
          <div className="flex gap-4 text-sm">
            <Link to="/dashboard" className="hover:underline font-medium">Dashboard</Link>
            <Link to="/gastos" className="hover:underline font-medium">Gastos</Link>
            <Link to="/ingresos" className="hover:underline font-medium">Ingresos</Link>
            <Link to="/categorias" className="hover:underline font-medium">Categorías</Link>
            <Link to="/filtro-gastos" className="hover:underline font-medium">Filtrar</Link>
            <Link
              to="/login"
              onClick={() => localStorage.removeItem("token")}
              className="hover:underline font-medium"
            >
              Salir
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 text-sm">
            <Link to="/login" className="hover:underline font-medium">Iniciar sesión</Link>
            <Link to="/register" className="hover:underline font-medium">Registrarse</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
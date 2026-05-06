import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">💰 Gestor de Gastos</h1>
        <div className="flex gap-6">
          <Link to="/dashboard" className="hover:underline font-medium">
            Dashboard
          </Link>
          <Link to="/login" className="hover:underline font-medium">
            Login
          </Link>
          <Link to="/register" className="hover:underline font-medium">
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
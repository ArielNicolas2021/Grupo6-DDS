import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-bold">
            💰 Gestor de Gastos
          </h1>

          {/* Desktop */}
          <div className="hidden md:flex gap-4 text-sm">
            {token ? (
              <>
                <Link to="/dashboard" className="hover:underline font-medium">
                  Dashboard
                </Link>
                <Link to="/gastos" className="hover:underline font-medium">
                  Gastos
                </Link>
                <Link to="/ingresos" className="hover:underline font-medium">
                  Ingresos
                </Link>
                <Link to="/categorias" className="hover:underline font-medium">
                  Categorías
                </Link>
                <Link to="/filtro-gastos" className="hover:underline font-medium">
                  Filtrar
                </Link>
                <Link
                  to="/login"
                  onClick={() => localStorage.removeItem("token")}
                  className="hover:underline font-medium"
                >
                  Salir
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline font-medium">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="hover:underline font-medium">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Botón hamburguesa */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-3 mt-4 pb-2 text-sm">
            {token ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="hover:underline"
                >
                  Dashboard
                </Link>

                <Link
                  to="/gastos"
                  onClick={() => setIsOpen(false)}
                  className="hover:underline"
                >
                  Gastos
                </Link>

                <Link
                  to="/ingresos"
                  onClick={() => setIsOpen(false)}
                  className="hover:underline"
                >
                  Ingresos
                </Link>

                <Link
                  to="/categorias"
                  onClick={() => setIsOpen(false)}
                  className="hover:underline"
                >
                  Categorías
                </Link>

                <Link
                  to="/filtro-gastos"
                  onClick={() => setIsOpen(false)}
                  className="hover:underline"
                >
                  Filtrar
                </Link>

                <Link
                  to="/login"
                  onClick={() => {
                    localStorage.removeItem("token");
                    setIsOpen(false);
                  }}
                  className="hover:underline"
                >
                  Salir
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="hover:underline"
                >
                  Iniciar sesión
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="hover:underline"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
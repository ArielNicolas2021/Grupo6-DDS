import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Página no encontrada
      </h2>
      <p className="text-gray-500 mb-6">
        La página que buscás no existe.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-col items-center justify-center mt-20 gap-4">
        <h2 className="text-3xl font-semibold text-gray-700">
          ¡Bienvenido al Gestor de Gastos!
        </h2>
        <p className="text-gray-500 text-lg">
          Tu plataforma para controlar tus finanzas personales.
        </p>
      </main>
    </div>
  );
};

export default Home;
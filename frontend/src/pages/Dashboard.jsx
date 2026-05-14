const Dashboard = () => {
  const ingresos = 150000;
  const gastos = 80000;
  const balance = ingresos - gastos;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Resumen Financiero
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-green-100 border border-green-300 rounded-2xl p-6 shadow">
          <p className="text-sm text-green-600 font-medium mb-1">
            Total Ingresos
          </p>
          <p className="text-3xl font-bold text-green-700">
            ${ingresos.toLocaleString()}
          </p>
        </div>

        <div className="bg-red-100 border border-red-300 rounded-2xl p-6 shadow">
          <p className="text-sm text-red-600 font-medium mb-1">
            Total Gastos
          </p>
          <p className="text-3xl font-bold text-red-700">
            ${gastos.toLocaleString()}
          </p>
        </div>

        <div className="bg-blue-100 border border-blue-300 rounded-2xl p-6 shadow">
          <p className="text-sm text-blue-600 font-medium mb-1">
            Balance
          </p>
          <p className="text-3xl font-bold text-blue-700">
            ${balance.toLocaleString()}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
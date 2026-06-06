import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddGasto from "./pages/AddGasto";
import ListaGastos from "./pages/ListaGastos";
import AddIngreso from "./pages/AddIngreso";
import ListaIngresos from "./pages/ListaIngresos";
import FiltroGastos from "./pages/FiltroGastos";
import NotFound from "./pages/NotFound";
import Categorias from "./pages/Categorias";
import AddCategoria from "./pages/AddCategoria";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agregar-gasto" element={<AddGasto />} />
          <Route path="/gastos" element={<ListaGastos />} />
          <Route path="/ingresos" element={<ListaIngresos />} />
          <Route path="/agregar-ingreso" element={<AddIngreso />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/agregar-categoria" element={<AddCategoria />} />
          <Route path="/filtro-gastos" element={<FiltroGastos />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddGasto from "./pages/AddGasto";
import ListaGastos from "./pages/ListaGastos";
import AddIngreso from "./pages/AddIngreso";
import ListaIngresos from "./pages/ListaIngresos";
import FiltroGastos from "./pages/FiltroGastos";
import Categorias from "./pages/Categorias";
import AddCategoria from "./pages/AddCategoria";
import FiltroCategorias from "./pages/FiltroCategorias";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Sin sidebar: pantalla completa ── */}
        <Route path="/"         element={<Navigate to="/login" replace />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Con sidebar: todas las páginas del app ── */}
        <Route element={<Layout />}>
          <Route path="/dashboard"         element={<Dashboard />} />
          <Route path="/agregar-gasto"     element={<AddGasto />} />
          <Route path="/gastos"            element={<ListaGastos />} />
          <Route path="/agregar-ingreso"   element={<AddIngreso />} />
          <Route path="/ingresos"          element={<ListaIngresos />} />
          <Route path="/categorias"        element={<Categorias />} />
          <Route path="/agregar-categoria" element={<AddCategoria />} />
          <Route path="/filtro-gastos"     element={<FiltroGastos />} />
          <Route path="/filtro-categorias" element={<FiltroCategorias />} />
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
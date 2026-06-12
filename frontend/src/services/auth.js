// Guardar el token cuando el usuario se loguea
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// Obtener el token guardado
export const getToken = () => {
  return localStorage.getItem("token");
};

// Eliminar el token cuando el usuario hace logout
export const removeToken = () => {
  localStorage.removeItem("token");
};

// Verificar si el usuario está logueado
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
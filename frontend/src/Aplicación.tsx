import { RouterProvider } from "react-router-dom";
import { ProveedorAutenticacion } from "./context/contextAutenticacion";
import { router } from "./rutas";
import "./styles/main.css";

function App() {
  return (
    // Envolver la aplicación con el proveedor de autenticación
    <ProveedorAutenticacion>
      // rutas de la aplicación
      <RouterProvider router={router} />
    </ProveedorAutenticacion>
  );
}

export default App;

import { RouterProvider } from "react-router-dom";
import { ProveedorAutenticacion } from "./context/contextAutenticacion";
import { router } from "./rutas";
import "./styles/main.css";

function App() {
  return (
    // Envolver la aplicación con el proveedor de autenticación
    <ProveedorAutenticacion>
      <RouterProvider router={router} />
    </ProveedorAutenticacion>
  );
}

export default App;

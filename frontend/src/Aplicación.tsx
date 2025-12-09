import { RouterProvider } from "react-router-dom";
import { ProveedorAutenticacion } from "./context/contextAutenticacion";
import { router } from "./rutas";
import "./styles/main.css";

function App() {
  return (
    <ProveedorAutenticacion>
      <RouterProvider router={router} />
    </ProveedorAutenticacion>
  );
}

export default App;

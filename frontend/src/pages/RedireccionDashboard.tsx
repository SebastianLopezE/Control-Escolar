import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAutenticacion } from "../hooks/useAutenticacion";

export function RedireccionDashboard() {
  const navigate = useNavigate();
  const { usuario } = useAutenticacion();

  //5. Redirigir según el rol del usuario
  useEffect(() => {
    if (usuario?.rol === "maestro") {
      navigate("/maestro/dashboard");
    } else if (usuario?.rol === "control_escolar") {
      navigate("/admin/dashboard");
    }
  }, [usuario, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg font-semibold">Cargando...</p>
      </div>
    </div>
  );
}

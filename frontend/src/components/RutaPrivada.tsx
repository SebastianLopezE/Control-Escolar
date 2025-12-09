import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAutenticacion } from "../hooks/useAutenticacion";

interface PropsRutaPrivada {
  children: ReactNode;
  rolesPermitidos?: string[];
}

export function RutaPrivada({ children, rolesPermitidos }: PropsRutaPrivada) {
  const { estaAutenticado, usuario, estaCargando, iniciando } = useAutenticacion();

  if (iniciando || estaCargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!estaAutenticado) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  if (rolesPermitidos && usuario && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}

import { useContext } from "react";
import { ContextoAutenticacion } from "../context/contextAutenticacion";
import { ContextoAutenticacionTipo } from "../types/indice";

/**
 * Hook para acceder al contexto de autenticación
 * @returns ContextoAutenticacionTipo
 */
export const useAutenticacion = (): ContextoAutenticacionTipo => {
  const context = useContext(ContextoAutenticacion);

  if (!context) {
    throw new Error(
      "useAutenticacion debe ser usado dentro de ProveedorAutenticacion"
    );
  }

  return context;
};

import { useContext } from "react";
import { ContextoAutenticacion } from "../context/contextAutenticacion";
import { ContextoAutenticacionTipo } from "../types/indice";

export const useAutenticacion = (): ContextoAutenticacionTipo => { // 
  const context = useContext(ContextoAutenticacion);

  if (!context) {
    throw new Error(
      "useAutenticacion debe ser usado dentro de ProveedorAutenticacion"
    );
  }

  return context;
};

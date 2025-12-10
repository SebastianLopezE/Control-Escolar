import React, { createContext, useState, useCallback, useEffect } from "react";
import api from "../services/api";
import { Usuario, ContextoAutenticacionTipo } from "../types/indice";

export const ContextoAutenticacion = createContext<
  ContextoAutenticacionTipo | undefined
>(undefined);

interface PropasProveedorAutenticacion {
  children: React.ReactNode;
}

export const ProveedorAutenticacion: React.FC<PropasProveedorAutenticacion> = ({
  children,
}) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [estaCargando, setEstaCargando] = useState(false);
  const [iniciando, setIniciando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Restaurar sesión al cargar
  useEffect(() => {
    const restore = () => {
      setIniciando(true);
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("usuario");

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUsuario(JSON.parse(storedUser));
        } catch (err) {
          console.error("Error al restaurar sesión:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
        }
      }
      setIniciando(false);
    };

    restore();
  }, []);

  // 3. Función para iniciar sesión
  const iniciarSesion = useCallback(async (email: string, password: string) => {
    setEstaCargando(true);
    setError(null);
    try {
      // Llamada a la API para iniciar sesión
      const { data } = await api.post("/auth/login", { email, password });

      const tokenObtenido = data.token as string;
      const usuarioObtenido: Usuario = {
        id: data.usuario.id,
        nombre: data.usuario.nombre,
        email: data.usuario.email ?? email,
        rol: data.usuario.rol,
      };
      // Guardar token y usuario en el estado y en el almacenamiento local
      setToken(tokenObtenido);
      setUsuario(usuarioObtenido);
      localStorage.setItem("token", tokenObtenido); // Guardar token 
      localStorage.setItem("usuario", JSON.stringify(usuarioObtenido));
    } catch (err: any) {
      const mensaje = err?.response?.data?.error || "Error al iniciar sesión";
      setError(mensaje);
      throw err;
    } finally {
      setEstaCargando(false);
    }
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
    setError(null);
  }, []);

  const value: ContextoAutenticacionTipo & { iniciando?: boolean } = {
    usuario,
    token,
    estaAutenticado: !!token,
    iniciarSesion,
    cerrarSesion,
    estaCargando,
    error,
    iniciando,
  };

  return (
    <ContextoAutenticacion.Provider value={value}>
      {children}
    </ContextoAutenticacion.Provider>
  );
};

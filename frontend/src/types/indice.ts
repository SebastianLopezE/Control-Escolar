// Tipos globales de la aplicación

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: "maestro" | "admin" | "control_escolar";
}

export interface ContextoAutenticacionTipo {
  usuario: Usuario | null;
  token: string | null;
  estaAutenticado: boolean;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => void;
  estaCargando: boolean;
  error: string | null;
  iniciando?: boolean;
}

export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  matricula: string;
  grado: string;
  grupo: string;
}

export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
}

export interface Calificacion {
  id: number;
  alumnoId: number;
  maestroId: number;
  materiaId: number;
  calificacion: number;
  fecha: string;
  observaciones?: string;
}

export interface Reporte {
  id: number;
  alumnoId: number;
  maestroId: number;
  titulo: string;
  contenido: string;
  fecha: string;
  tipo: "general" | "por_materia" | "por_alumno";
}

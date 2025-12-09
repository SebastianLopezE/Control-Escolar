import React from "react";

interface PropsBotón extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primary" | "secondary" | "success" | "danger" | "warning";
  tamaño?: "pequeño" | "medio" | "grande";
  estaCargando?: boolean;
  children: React.ReactNode;
}

export const Botón: React.FC<PropsBotón> = ({
  variante = "primary",
  tamaño = "medio",
  estaCargando = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const claseVariante = {
    primary: "boton-primario",
    secondary: "boton-secundario",
    success: "boton-exito",
    danger: "boton-peligro",
    warning: "boton-advertencia",
  };

  const claseTamaño = {
    pequeño: "boton-pequeño",
    medio: "boton",
    grande: "boton-grande",
  };

  const claseBase = "boton";
  const varianteClass = claseVariante[variante];
  const tamañoClass = tamaño === "medio" ? claseBase : claseTamaño[tamaño];
  const claseDeshabilitado =
    disabled || estaCargando ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={`${claseBase} ${varianteClass} ${tamañoClass} ${claseDeshabilitado} ${
        className || ""
      }`}
      disabled={disabled || estaCargando}
      {...props}
    >
      {estaCargando ? "Cargando..." : children}
    </button>
  );
};

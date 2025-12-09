import React from "react";

// Definición de los props que el componente Entrada aceptará
interface PropsEntrada extends React.InputHTMLAttributes<HTMLInputElement> {
  etiqueta?: string;
  error?: string;
  textoAyuda?: string;
}

// Componente funcional que recibe los props y los desestructura
export const Entrada: React.FC<PropsEntrada> = ({
  etiqueta,
  error,
  textoAyuda,
  className,
  ...props // Otros atributos HTML (type, name, id, etc)
}) => {
  return (
    <div className="grupo-formulario">
      {/* Renderiza el label solo si se proporciona etiqueta */}
      {etiqueta && (
        <label
          htmlFor={props.id || props.name}
          className="block text-gray-700 font-semibold mb-2"
        >
          {etiqueta}
          {/* Muestra asterisco si es un campo requerido */}
          {props.required && <span className="requerido">*</span>}
        </label>
      )}
      {/* Input con clases dinámicas: si hay error, borde rojo; sino gris */}
      <input
        className={`w-full px-3 py-2 border-2 border-gray-200 rounded text-base font-sans bg-white focus:outline-none focus:border-blue-600 ${
          error ? "border-red-500" : ""
        } ${className || ""}`}
        {...props}
      />
      {/* Muestra el mensaje de error en rojo si existe */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {/* Muestra texto de ayuda gris debajo del input */}
      {textoAyuda && <p className="pista-formulario">{textoAyuda}</p>}
    </div>
  );
};

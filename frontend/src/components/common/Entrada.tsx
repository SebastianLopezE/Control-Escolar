import React from "react";

interface PropsEntrada extends React.InputHTMLAttributes<HTMLInputElement> {
  etiqueta?: string;
  error?: string;
  textoAyuda?: string;
}

export const Entrada: React.FC<PropsEntrada> = ({
  etiqueta,
  error,
  textoAyuda,
  className,
  ...props
}) => {
  return (
    <div className="grupo-formulario">
      {etiqueta && (
        <label
          htmlFor={props.id || props.name}
          className="block text-gray-700 font-semibold mb-2"
        >
          {etiqueta}
          {props.required && <span className="requerido">*</span>}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border-2 border-gray-200 rounded text-base font-sans bg-white focus:outline-none focus:border-blue-600 ${
          error ? "border-red-500" : ""
        } ${className || ""}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {textoAyuda && <p className="pista-formulario">{textoAyuda}</p>}
    </div>
  );
};

import { useState, useEffect } from "react";

/**
 * Hook para sincronizar estado con localStorage
 * @param clave Clave en localStorage
 * @param valorInicial Valor inicial
 * @returns [valor, setValor]
 */
export const useAlmacenamientoLocal = <T>(
  clave: string,
  valorInicial: T
): [T, (valor: T) => void] => {
  const [valorAlmacenado, setValorAlmacenado] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(clave);
      return item ? JSON.parse(item) : valorInicial;
    } catch (error) {
      console.error(error);
      return valorInicial;
    }
  });

  const setValor = (valor: T) => {
    try {
      setValorAlmacenado(valor);
      window.localStorage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
      console.error(error);
    }
  };

  return [valorAlmacenado, setValor];
};

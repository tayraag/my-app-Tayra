import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import {
  suscribirHistorial,
  agregarAlHistorialFS,
  limpiarHistorialFS,
  getHistorialLocal,
  agregarAlHistorialLocal,
  limpiarHistorialLocal,
  ProductoHistorial,
} from "@/src/services/historial";
import { Producto } from "@/src/data/productos";

export function useHistorial() {
  const { usuario, cargando } = useAuth();
  const [historial, setHistorial] = useState<ProductoHistorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cargando) return;

    if (usuario) {
      setHistorial([]);
      setIsLoading(true);
      const unsubscribe = suscribirHistorial(usuario.uid, (items) => {
        setHistorial(items);
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      getHistorialLocal().then((items) => {
        setHistorial(items);
        setIsLoading(false);
      });
    }
  }, [usuario?.uid, cargando]);

  const agregarAlHistorial = useCallback(
    async (producto: Producto) => {
      if (usuario) {
        await agregarAlHistorialFS(usuario.uid, producto);
      } else {
        await agregarAlHistorialLocal(producto);
        const actualizado = await getHistorialLocal();
        setHistorial(actualizado);
      }
    },
    [usuario]
  );

  const limpiarHistorial = useCallback(async () => {
    if (usuario) {
      await limpiarHistorialFS(usuario.uid);
    } else {
      await limpiarHistorialLocal();
      setHistorial([]);
    }
  }, [usuario]);

  return { historial, isLoading, agregarAlHistorial, limpiarHistorial };
}

import { Producto } from "@/src/data/productos";
import {
  guardarFavorito as guardarFavoritoFS,
  eliminarFavorito as eliminarFavoritoFS,
  suscribirFavoritos,
  ProductoFavorito,
} from "@/src/services/favoritos";
import { useAuth } from "./useAuth";
import { useEffect, useState, useCallback } from "react";

export function useFavoritos() {
  const { usuario } = useAuth();
  const [favoritos, setFavoritos] = useState<ProductoFavorito[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!usuario) {
      setFavoritos([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = suscribirFavoritos(usuario.uid, (nuevos) => {
      setFavoritos(nuevos);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [usuario?.uid]);

  const guardarFavorito = useCallback(
    async (producto: Producto) => {
      if (!usuario) return;
      try {
        await guardarFavoritoFS(usuario.uid, producto);
      } catch (e) {
        setError(e as Error);
      }
    },
    [usuario]
  );

  const eliminarFavorito = useCallback(
    async (productoId: string) => {
      if (!usuario) return;
      try {
        await eliminarFavoritoFS(usuario.uid, productoId);
      } catch (e) {
        setError(e as Error);
      }
    },
    [usuario]
  );

  const esFavorito = useCallback(
    (id: string) => favoritos.some((p) => p.id === id),
    [favoritos]
  );

  return {
    favoritos,
    isLoading,
    error,
    guardarFavorito,
    eliminarFavorito,
    esFavorito,
    isSaving: false,
    isDeleting: false,
  };
}

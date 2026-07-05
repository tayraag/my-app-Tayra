import { Producto } from "@/src/data/productos";
import {
    eliminarFavorito,
    guardarFavorito,
    obtenerFavoritos,
} from "@/src/services/favoritos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRefreshOnFocus } from "./useRefreshOnFocus";

const FAVORITOS_HOOK_KEY = ["favoritos"];

export function useFavoritos() {
  const queryClient = useQueryClient();

  const {
    data: favoritos = [],
    isLoading,
    error,
  } = useQuery<Producto[]>({
    queryKey: FAVORITOS_HOOK_KEY,
    queryFn: obtenerFavoritos,
  });

  useRefreshOnFocus(FAVORITOS_HOOK_KEY);

  const addFavoriteMutation = useMutation({
    mutationFn: guardarFavorito,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITOS_HOOK_KEY });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: eliminarFavorito,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITOS_HOOK_KEY });
    },
  });

  const esFavorito = (id: string) => {
    return favoritos.some((p) => p.id === id);
  };

  return {
    favoritos,
    isLoading,
    error,
    guardarFavorito: addFavoriteMutation.mutateAsync,
    eliminarFavorito: removeFavoriteMutation.mutateAsync,
    esFavorito,
    isSaving: addFavoriteMutation.isPending,
    isDeleting: removeFavoriteMutation.isPending,
  };
}

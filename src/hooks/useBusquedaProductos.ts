import { useEffect, useState } from "react";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { searchProducts } from "../services/productos";
import { transformSearchProductsResponse, MyProductSearchResponse } from "../transformers/search-products.transformer";

export function useBusquedaProductos(termino: string) {
  const [debouncedTermino, setDebouncedTermino] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTermino(termino), 500);
    return () => clearTimeout(timer);
  }, [termino]);

  return useInfiniteQuery<MyProductSearchResponse, Error, InfiniteData<MyProductSearchResponse>>({
    queryKey: ["products", "busqueda", debouncedTermino],
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await searchProducts({
        tipo: "busqueda",
        valor: debouncedTermino,
        pageParam: pageParam as number,
      });
      return transformSearchProductsResponse(response);
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.page_count ? lastPage.page + 1 : undefined,
    enabled: debouncedTermino.length > 2,
  });
}
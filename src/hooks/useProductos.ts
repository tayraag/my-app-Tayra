import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { searchProducts, FiltroTipo } from "../services/productos"; 
import { transformSearchProductsResponse, MyProductSearchResponse } from "../transformers/search-products.transformer";

export function useProductos(tipo: FiltroTipo, valor: string) {
  return useInfiniteQuery<MyProductSearchResponse, Error,  InfiniteData<MyProductSearchResponse>>({
    queryKey: ["products", tipo, valor],
    initialPageParam: 1,  
    staleTime: 10 * 60 * 1000, 
    gcTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), 
    queryFn: async ({ pageParam = 1 }) => {
      const response = await searchProducts({ 
        tipo, 
        valor, 
        pageParam: pageParam as number 
      });
      return transformSearchProductsResponse(response);
    },
    getNextPageParam: (lastPage) => 
      lastPage.page < lastPage.page_count ? lastPage.page + 1 : undefined,
    enabled: !!valor,
  });
}
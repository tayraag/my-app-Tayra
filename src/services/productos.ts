export type FiltroTipo = "categoria" | "marca" | "etiquetas" | "busqueda";

interface SearchParamsOptions {
  tipo: FiltroTipo;
  valor: string;
  pageParam?: number;
}

export async function searchProducts({ tipo, valor, pageParam = 1 }: SearchParamsOptions): Promise<ProductSearchResponse> {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const url = `${BASE_URL}/v2/search`;

  const QueryParamsMap: Record<FiltroTipo, string> = {
    categoria: "categories_tags",
    marca: "brands_tags",
    etiquetas: "labels_tags", 
    busqueda: "search_terms",
  };

  const apiKeyParam = QueryParamsMap[tipo];

  const params = new URLSearchParams({
    [apiKeyParam]: valor,
    page: pageParam.toString(),
    page_size: "20",
    fields: "code,_id,product_name,product_name_es,product_name_en,brands,categories_tags,labels_tags,nutriscore_grade,nutrition_grades,ecoscore_grade,nova_group,nutriments,ingredients_text_es,ingredients_text_en,ingredients_text,allergens,image_url,image_front_url",
  });

  const response = await fetch(`${url}?${params.toString()}`, {
    headers: { "User-Agent": "UNTDF TNT 2026" },
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = await response.json();
  return data as ProductSearchResponse;
}

// ===================================================
// TYPES
// ===================================================

export interface ProductSearchResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: Product[];
  skip: number;
}

export interface Product {
  _id: string;
  code: string;
  product_name?: string;
  product_name_es?: string;
  product_name_en?: string;
  brands?: string;
  categories_tags?: string[];
  labels_tags?: string[];
  nutriscore_grade?: string;
  nutrition_grades?: string;
  ecoscore_grade?: string;
  nova_group?: number;
  nutriments?: {
    "energy-kj"?: number;
    fat?: number;
    "saturated-fat"?: number;
    carbohydrates?: number;
    sugars?: number;
    fiber?: number;
    proteins?: number;
    salt?: number;
    [key: string]: any;
  };
  ingredients_text_es?: string;
  ingredients_text_en?: string;
  ingredients_text?: string;
  allergens?: string;
  image_url?: string;
  image_front_url?: string;
}

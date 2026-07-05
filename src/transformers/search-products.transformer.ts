import { ProductSearchResponse } from "../services/productos";
import { Producto, NutriScore, EcoScore, NovaGroup } from "../data/productos"; 

export function transformProduct(product: any): Producto {
  const nombreDefinitivo = product.product_name_es || product.product_name_en || product.product_name || "Producto sin nombre";
  const urlImagen = product.image_url || product.image_front_url || "";
  const nutri = (product.nutriscore_grade || product.nutrition_grades || "E").toUpperCase() as NutriScore;
  const eco = (product.ecoscore_grade || "E").toUpperCase() as EcoScore;
  const nova = (product.nova_group ?? 4) as NovaGroup;
  const nutriments = product.nutriments || {};

  return {
    id: product._id || product.code,
    nombre: nombreDefinitivo,
    marca: product.brands || "Sin marca",
    categoria: product.categories_tags?.[0] || "General",
    etiquetas: product.labels_tags || [],
    nutriScore: nutri,
    novaGroup: nova,
    ecoScore: eco,
    energia: nutriments["energy-kj"] || 0,
    grasa: nutriments.fat || 0,
    grasaSaturada: nutriments["saturated-fat"] || 0,
    carbohidratos: nutriments.carbohydrates || 0,
    azucares: nutriments.sugars || 0,
    fibra: nutriments.fiber || 0,
    proteina: nutriments.proteins || 0,
    sal: nutriments.salt || 0,
    ingredientes: product.ingredients_text_es || product.ingredients_text_en || product.ingredients_text || "No especificados",
    alergenos: product.allergens || "Ninguno especificado",
    imagen: urlImagen,
  };
}

export function transformSearchProductsResponse(
  response: ProductSearchResponse,
): MyProductSearchResponse {
  let myResponse: MyProductSearchResponse = {
    count: response.count,
    page: response.page,
    page_count: response.page_count,
    page_size: response.page_size,
    products: response.products.map(transformProduct),
  };

  return myResponse;
}

export type MyProductSearchResponse = {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: Producto[]; 
};
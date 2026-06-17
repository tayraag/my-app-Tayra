import { Producto } from "@/src/data/productos";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ProductoFavorito = Producto;

const FAVORITOS_KEY = "productosFavoritos";

export const obtenerFavoritos = async (): Promise<ProductoFavorito[]> => {
  try {
    const favoritos = await AsyncStorage.getItem(FAVORITOS_KEY);
    return favoritos ? JSON.parse(favoritos) : [];
  } catch (error) {
    console.error("Error al obtener favoritos de AsyncStorage:", error);
    return [];
  }
};

export const guardarFavorito = async (
  producto: ProductoFavorito,
): Promise<boolean> => {
  try {
    const favoritos = await obtenerFavoritos();
    const yaExiste = favoritos.some((fav) => fav.id === producto.id);
    if (!yaExiste) {
      favoritos.push(producto);
      await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
    }
    return true;
  } catch (error) {
    console.error("Error al guardar favorito:", error);
    return false;
  }
};

export const eliminarFavorito = async (
  productoId: string,
): Promise<boolean> => {
  try {
    let favoritos = await obtenerFavoritos();
    favoritos = favoritos.filter((favorito) => favorito.id !== productoId);
    await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
    return true;
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    return false;
  }
};

export const obtenerFavorito = async (
  productoId: string,
): Promise<ProductoFavorito | null> => {
  try {
    const favoritos = await obtenerFavoritos();
    return favoritos.find((favorito) => favorito.id === productoId) ?? null;
  } catch (error) {
    console.error("Error al obtener favorito:", error);
    return null;
  }
};

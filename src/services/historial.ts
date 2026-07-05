import AsyncStorage from "@react-native-async-storage/async-storage";
import { Producto } from "@/src/data/productos";

const HISTORIAL_KEY = "@historial_escaneos";

export async function getHistorial(): Promise<Producto[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORIAL_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al obtener el historial", error);
    return [];
  }
}

export async function addProductoAlHistorial(producto: Producto): Promise<void> {
  try {
    const historialActual = await getHistorial();
    const historialFiltrado = historialActual.filter((p) => p.id !== producto.id);
    const nuevoHistorial = [producto, ...historialFiltrado];
    
    if (nuevoHistorial.length > 50) {
      nuevoHistorial.pop();
    }
    
    await AsyncStorage.setItem(HISTORIAL_KEY, JSON.stringify(nuevoHistorial));
  } catch (error) {
    console.error("Error al guardar en el historial", error);
  }
}

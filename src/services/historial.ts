import { Producto } from "@/src/data/productos";
import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  getDocs,
  Unsubscribe,
  serverTimestamp,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ProductoHistorial = Producto;

const HISTORIAL_KEY = "@historial_escaneos";
const MAX_ITEMS = 50;

const historialRef = (uid: string) =>
  collection(db, "users", uid, "historial");

export const suscribirHistorial = (
  uid: string,
  callback: (historial: ProductoHistorial[]) => void
): Unsubscribe => {
  const q = query(historialRef(uid), orderBy("creadoEn", "desc"), limit(MAX_ITEMS));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => d.data() as ProductoHistorial));
  });
};

export const agregarAlHistorialFS = async (
  uid: string,
  producto: ProductoHistorial
): Promise<void> => {
  await setDoc(doc(db, "users", uid, "historial", producto.id), {
    ...producto,
    creadoEn: serverTimestamp(),
  });
  const snapshot = await getDocs(
    query(historialRef(uid), orderBy("creadoEn", "desc"))
  );
  if (snapshot.docs.length > MAX_ITEMS) {
    await deleteDoc(snapshot.docs[snapshot.docs.length - 1].ref);
  }
};

export const limpiarHistorialFS = async (uid: string): Promise<void> => {
  const snapshot = await getDocs(historialRef(uid));
  await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
};

export const getHistorialLocal = async (): Promise<ProductoHistorial[]> => {
  try {
    const data = await AsyncStorage.getItem(HISTORIAL_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const agregarAlHistorialLocal = async (
  producto: ProductoHistorial
): Promise<void> => {
  try {
    const actual = await getHistorialLocal();
    const filtrado = actual.filter((p) => p.id !== producto.id);
    const nuevo = [producto, ...filtrado].slice(0, MAX_ITEMS);
    await AsyncStorage.setItem(HISTORIAL_KEY, JSON.stringify(nuevo));
  } catch (error) {
    console.error("Error al guardar en historial local:", error);
  }
};

export const limpiarHistorialLocal = async (): Promise<void> => {
  await AsyncStorage.removeItem(HISTORIAL_KEY);
};

import { Producto } from "@/src/data/productos";
import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
  serverTimestamp,
} from "firebase/firestore";

export type ProductoFavorito = Producto;

const favoritosRef = (uid: string) =>
  collection(db, "users", uid, "favoritos");

export const suscribirFavoritos = (
  uid: string,
  callback: (favoritos: ProductoFavorito[]) => void
): Unsubscribe => {
  return onSnapshot(favoritosRef(uid), (snapshot) => {
    const favoritos: ProductoFavorito[] = snapshot.docs.map(
      (docSnap) => docSnap.data() as ProductoFavorito
    );
    callback(favoritos);
  });
};

export const guardarFavorito = async (
  uid: string,
  producto: ProductoFavorito
): Promise<void> => {
  const ref = doc(db, "users", uid, "favoritos", producto.id);
  await setDoc(ref, { ...producto, creadoEn: serverTimestamp() });
};

export const eliminarFavorito = async (
  uid: string,
  productoId: string
): Promise<void> => {
  const ref = doc(db, "users", uid, "favoritos", productoId);
  await deleteDoc(ref);
};

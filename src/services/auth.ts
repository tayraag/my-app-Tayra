import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";

export const registrar = async (
  email: string,
  password: string,
  nombre?: string
): Promise<User> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (nombre) {
    await updateProfile(credential.user, { displayName: nombre });
  }
  return credential.user;
};

export const iniciarSesion = async (
  email: string,
  password: string
): Promise<User> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const cerrarSesion = async (): Promise<void> => {
  await signOut(auth);
};

export const observarAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const obtenerUsuarioActual = (): User | null => {
  return auth.currentUser;
};

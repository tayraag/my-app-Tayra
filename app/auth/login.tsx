import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { iniciarSesion, registrar } from "@/src/services/auth";

type Modo = "login" | "registro";

export default function LoginScreen() {
  const [modo, setModo] = useState<Modo>("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const mensajeError = (code: string): string => {
    switch (code) {
      case "auth/email-already-in-use":
        return "Ya existe una cuenta con ese email.";
      case "auth/invalid-email":
        return "El email no es válido.";
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Email o contraseña incorrectos.";
      case "auth/too-many-requests":
        return "Demasiados intentos. Intentá más tarde.";
      default:
        return "Ocurrió un error. Intentá de nuevo.";
    }
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos incompletos", "Completá todos los campos.");
      return;
    }
    if (modo === "registro" && !nombre.trim()) {
      Alert.alert("Campos incompletos", "Ingresá tu nombre.");
      return;
    }

    setCargando(true);
    try {
      if (modo === "login") {
        await iniciarSesion(email.trim(), password);
      } else {
        await registrar(email.trim(), password, nombre.trim());
      }
      // Volver a donde estaba el usuario (ej: la ficha del producto)
      // Si no hay pantalla anterior en el stack, ir a favoritos
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)/favoritos");
      }
    } catch (error: any) {
      const code = error?.code ?? "";
      Alert.alert("Error", mensajeError(code));
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <FontAwesome name="heart" size={32} color="#fff" />
          </View>
          <Text style={styles.titulo}>
            {modo === "login" ? "Bienvenido/a" : "Crear cuenta"}
          </Text>
          <Text style={styles.subtitulo}>
            {modo === "login"
              ? "Iniciá sesión para ver tus favoritos"
              : "Registrate para guardar tus favoritos"}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, modo === "login" && styles.tabActivo]}
              onPress={() => setModo("login")}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabTexto, modo === "login" && styles.tabTextoActivo]}>
                Iniciar sesión
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, modo === "registro" && styles.tabActivo]}
              onPress={() => setModo("registro")}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabTexto, modo === "registro" && styles.tabTextoActivo]}>
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>

          {modo === "registro" && (
            <View style={styles.campo}>
              <Text style={styles.label}>Nombre</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome name="user" size={16} color="#94a3b8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Tu nombre"
                  placeholderTextColor="#94a3b8"
                  value={nombre}
                  onChangeText={setNombre}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.campo}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome name="envelope" size={14} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome name="lock" size={18} color="#94a3b8" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!mostrarPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setMostrarPassword(!mostrarPassword)}
                style={styles.eyeBtn}
              >
                <FontAwesome
                  name={mostrarPassword ? "eye-slash" : "eye"}
                  size={16}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.botonPrincipal, cargando && styles.botonDeshabilitado]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botonPrincipalTexto}>
                {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonVolver}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <FontAwesome name="arrow-left" size={14} color="#64748b" />
            <Text style={styles.botonVolverTexto}>Volver sin iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 15,
    color: "#94a3b8",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabActivo: {
    backgroundColor: "#22c55e",
  },
  tabTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  tabTextoActivo: {
    color: "#fff",
  },
  campo: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#cbd5e1",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#f8fafc",
  },
  eyeBtn: {
    padding: 4,
  },
  botonPrincipal: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  botonPrincipalTexto: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  botonVolver: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    paddingVertical: 8,
  },
  botonVolverTexto: {
    fontSize: 14,
    color: "#64748b",
  },
});

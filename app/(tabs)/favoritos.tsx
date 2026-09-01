import { useFavoritos } from "@/src/hooks/useFavoritos";
import { useAuth } from "@/src/hooks/useAuth";
import { ROUTES, buildRoute } from "@/src/constants/routes";
import ProductosFiltrables from "@/src/components/ProductosListado";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { cerrarSesion } from "@/src/services/auth";

export default function FavoritesScreen() {
  const { usuario, cargando: cargandoAuth } = useAuth();
  const { favoritos, isLoading } = useFavoritos();

  if (cargandoAuth) {
    return (
      <View style={styles.containerCenter}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.sinSesion}>
        <View style={styles.iconWrapper}>
          <FontAwesome name="heart" size={36} color="#22c55e" />
        </View>
        <Text style={styles.sinSesionTitulo}>Tus favoritos te esperan</Text>
        <Text style={styles.sinSesionSubtitulo}>
          Iniciá sesión para guardar y ver tus productos favoritos desde cualquier dispositivo.
        </Text>
        <TouchableOpacity
          style={styles.botonLogin}
          onPress={() => router.push(buildRoute(ROUTES.LOGIN))}
          activeOpacity={0.85}
        >
          <FontAwesome name="sign-in" size={16} color="#fff" />
          <Text style={styles.botonLoginTexto}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.containerCenter}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <FontAwesome name="user" size={14} color="#fff" />
          </View>
          <Text style={styles.userEmail} numberOfLines={1}>
            {usuario.displayName ?? usuario.email}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => cerrarSesion()}
          style={styles.botonSalir}
          activeOpacity={0.7}
        >
          <FontAwesome name="sign-out" size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ProductosFiltrables
        tipo="favorito"
        valor="favoritos"
        productos={favoritos}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sinSesion: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
    gap: 12,
  },
  iconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  sinSesionTitulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
  },
  sinSesionSubtitulo: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
  },
  botonLogin: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#22c55e",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 12,
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  botonLoginTexto: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  userEmail: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
    flex: 1,
  },
  botonSalir: {
    padding: 8,
  },
});


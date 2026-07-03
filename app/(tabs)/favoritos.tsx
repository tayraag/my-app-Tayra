import { useFavoritos } from "@/src/hooks/useFavoritos";
import ProductosFiltrables from "@/src/components/ProductosListado";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function FavoritesScreen() {
  const { favoritos, isLoading } = useFavoritos();

  if (isLoading) {
    return (
      <View style={styles.containerCenter}>
        <ActivityIndicator size="large" color="#0055ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

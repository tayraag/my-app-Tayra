import ProductosFiltrables from "@/src/components/ProductosListado";
import { useProductos } from "@/src/hooks/useProductos";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, View, Text, Pressable } from "react-native";

type CategoriaParams = {
  nombre: string;
};

export default function CategoriaScreen() {
  const { nombre } = useLocalSearchParams<CategoriaParams>();
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isFetching } = useProductos("categoria", nombre);
  
  const productos = data?.pages.flatMap(page => page.products) ?? [];
  const totalItems = data?.pages[0]?.count ?? 0;

  if (isLoading || (isFetching && !isFetchingNextPage && productos.length === 0)) {
    return (
      <View style={styles.containerCenter}>
        <ActivityIndicator size="large" color="#0055ff" />
      </View>
    );
  }

  if (error && !isFetching) {
    return (
      <View style={styles.containerCenter}>
        <Text style={styles.errorText}>⚠️ Error al cargar productos</Text>
        <Text style={styles.errorDetails}>{error.message || "Intenta nuevamente"}</Text>
        <Pressable 
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.retryButtonPressed
          ]} 
          onPress={() => refetch()}
        >
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProductosFiltrables  
        tipo="categoria" 
        valor={nombre} 
        productos={productos} 
        totalItems={totalItems}
        onEndReached={() => hasNextPage && fetchNextPage()}
        isFetchingNextPage={isFetchingNextPage}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  containerCenter: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d32f2f",
    marginBottom: 8,
  },
  errorDetails: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "green",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  retryButtonPressed: {
    backgroundColor: "#1b5e20",
    transform: [{ scale: 0.98 }],
  },
});

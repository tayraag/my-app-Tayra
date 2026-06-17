import ProductosFiltrables from "@/src/components/ProductosListado";
import { useProductos } from "@/src/hooks/useProductos";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";

type MarcaParams = {
  nombre: string;
};

export default function MarcaScreen() {
  const { nombre } = useLocalSearchParams<MarcaParams>();
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useProductos("marca", nombre);

  const productos = data?.pages.flatMap(page => page.products) ?? [];
  const totalItems = data?.pages[0]?.count ?? 0;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Stack.Screen
          options={{ title: nombre.charAt(0).toUpperCase() + nombre.slice(1) }}
        />
        <ActivityIndicator size="large" color="#0055ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Stack.Screen
          options={{ title: nombre.charAt(0).toUpperCase() + nombre.slice(1) }}
        />
        <Text style={styles.errorText}>⚠️ Error al cargar productos</Text>
        <Text style={styles.errorDetails}>{error.message || "Intenta nuevamente"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: nombre.charAt(0).toUpperCase() + nombre.slice(1) }}
      />
      <ProductosFiltrables 
        tipo="marca" 
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
  center: {
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
});

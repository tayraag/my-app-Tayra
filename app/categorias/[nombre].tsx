import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, TextInput, FlatList, StyleSheet, Text, View } from "react-native";
import { productos, Producto } from "@/data/productos";
import { useState } from "react";
import { fichaShowRoute } from "@/constants/routes";

type CategoriaParams = {
  nombre: string;
};

export default function CategoriaScreen() {
  const { nombre } = useLocalSearchParams<CategoriaParams>();
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: nombre }} />
      <ProductosFiltrables categoria={nombre}/>
    </View>
  );
}

function ProductosFiltrables({ categoria }: { categoria: string }) {
  const [busqueda, setBusqueda] = useState("");
  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Buscar productos..."
        onChangeText={setBusqueda}
      />
      <ProductosList categoria={categoria} busqueda={busqueda} />
    </>
  );
}

function ProductosList({ categoria, busqueda }: { categoria: string, busqueda: string }) {  
  const productosFiltrados = productos.filter(
    (p) => p.categoria === categoria && p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  return (
    <FlatList
      data={productosFiltrados}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductoItem producto={item} />}
      ListEmptyComponent={<Text>No hay productos en esta categoría</Text>}
    />
  );
}

function ProductoItem({ producto }: { producto: Producto }) {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(fichaShowRoute(producto.id))}>
      <View style={styles.item}>
        <View style={styles.info}>
          <Text style={styles.nombre}>{producto.nombre}</Text>
          <Text style={styles.marca}>{producto.marca.toUpperCase()}</Text>
          <View style={styles.scores}>
            <Text style={styles.nutri}>NUTRI-SCORE {producto.nutriScore}</Text>
            <Text style={styles.eco}>ECO-SCORE {producto.ecoScore}</Text>
          </View>
        </View>
      </View>  
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  input:{
    height: 60,
    width: "100%",
    backgroundColor: "lightgray",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  item: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  info: {
    gap: 4,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "700",
  },
  marca: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.8,
  },
  scores: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  nutri: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  eco: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

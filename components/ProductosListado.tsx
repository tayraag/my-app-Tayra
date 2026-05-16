import { useRouter} from "expo-router";
import { Pressable, TextInput, FlatList, StyleSheet, Text, View } from "react-native";
import { productos, Producto } from "@/data/productos";
import { useState } from "react";
import { fichaShowRoute } from "@/constants/routes";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from "expo-image";

type FiltroTipo = "categoria" | "marca" | "etiquetas";

type Props = {
  tipo: FiltroTipo;
  valor: string;
};

export default function ProductosFiltrables({ tipo, valor}: Props) {
  const [busqueda, setBusqueda] = useState("");
    const productosFiltrados = productos.filter((p) => {
        const matchFiltro = tipo === "etiquetas" ? p.etiquetas.includes(valor) : p[tipo] === valor;
    return matchFiltro && p.nombre.toLowerCase().includes(busqueda.toLowerCase());
  });
  return (
    <>
      <View style={styles.inputContainer}>
        <FontAwesome name="search" size={18} color="grey" />
        <TextInput
          style={styles.input}
          placeholder="Buscar productos..."
          onChangeText={setBusqueda}
        />
      </View>
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductoItem producto={item} />}
        ListEmptyComponent={<Text>No hay productos</Text>}
      />
    </>
  );
}

function ProductoItem({ producto }: { producto: Producto }) {
  const router = useRouter();
  
  return (
    <Pressable onPress={() => router.push(fichaShowRoute(producto.id))}>
      <View style={styles.item}>
        <Image
          source={{ uri: producto.imagen }}
          style={styles.imagenPlaceholder}
          contentFit="contain"/>
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
     inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c7c7c7",
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
    margin: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  info: {
    gap: 4,
    flex: 1,
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
  imagenPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
});
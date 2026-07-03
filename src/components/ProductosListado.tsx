import { Producto } from "@/src/data/productos";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState, memo } from "react";
import { buildRoute, ROUTES } from "@/src/constants/routes";
import { NUTRI_COLORES, ECO_COLORES, normalizarEcoScore } from "@/src/constants/scores";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";

type FiltroTipo = "categoria" | "marca" | "etiquetas" | "favorito";

type Props = {
  tipo: FiltroTipo;
  valor: string;
  productos: Producto[];
  totalItems?: number;
  onEndReached?: () => void; 
  isFetchingNextPage?: boolean;
};

export default function ProductosFiltrables({ tipo, valor = "", productos = [], totalItems, onEndReached, isFetchingNextPage }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const productosFiltrados = productos.filter((p) => {
    const nombreProducto = p.nombre?.toLowerCase() ?? "";
    return nombreProducto.includes(busqueda.toLowerCase());
  });
  const conteoFinal = busqueda ? productosFiltrados.length : (totalItems ?? productosFiltrados.length);
  const tituloMostrado = valor ? valor.toUpperCase() : "CARGANDO...";

  return (
    <>
      <Text style={styles.title}> {tituloMostrado}</Text>
      <Text style={styles.conteo}>{conteoFinal} ITEMS FOUND</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="search" size={18} color="grey" />
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          onChangeText={setBusqueda}
        />
      </View>
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductoItem producto={item} tipo={tipo} valor={valor} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}  
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={11}
        removeClippedSubviews={true}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: 20, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#0055ff" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay productos
          </Text>
        }
      />
    </>
  );
}


const ProductoItem = memo(function ProductoItem({ producto, tipo, valor }: { producto: Producto,  tipo: string; valor: string;  }) {
  const router = useRouter();
  const marcaFormateada = producto.marca 
    ? producto.marca.toUpperCase() 
    : "SIN MARCA";
  const nutriScore: string = producto.nutriScore || "N/A";
  const ecoScoreRaw: string = producto.ecoScore || "N/A";
  const ecoScore = normalizarEcoScore(ecoScoreRaw);
  const esNutriNoAplicable = !producto.nutriScore || nutriScore === "NOT-APPLICABLE" || nutriScore === "N/A" || nutriScore === "UNKNOWN";
  const textoNutri = esNutriNoAplicable ? "-" : `NUTRI-SCORE ${nutriScore}`;
  const esEcoNoAplicable = !producto.ecoScore || ecoScore === "NOT-APPLICABLE" || ecoScore === "N/A" || ecoScore === "UNKNOWN";
  const textoEco = esEcoNoAplicable ? "-" : `ECO-SCORE ${ecoScore}`;

  return (
    <Pressable onPress={() => router.push(buildRoute(ROUTES.FICHA, { id: producto.id, tipoFiltro: tipo, valorFiltro: valor }))}>
      <View style={styles.item}>
        <Image
          style={styles.imagenPlaceholder}
          source={producto.imagen}
          contentFit="cover"
        />
        <View style={styles.info}>
          <Text style={styles.nombre}>{producto.nombre || "Producto sin nombre"}</Text>
          <Text style={styles.marca}>{marcaFormateada}</Text>     
          <View style={styles.scores}>
            <Text
              style={[
                styles.nutri,
                { backgroundColor: esNutriNoAplicable ? "#727272" : (NUTRI_COLORES[nutriScore] ?? "#727272")},
              ]}
            >
              {textoNutri}
            </Text>
            <Text
              style={[
                styles.eco,
                { 
                  backgroundColor: esEcoNoAplicable ? "#727272" : (ECO_COLORES[ecoScore] ?? "#727272") 
                },
              ]}
            >
              {textoEco}
            </Text>
          </View>
        </View>
        <FontAwesome name="chevron-right" size={20} color="#727272" />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
    paddingHorizontal: 6,
  },
  conteo: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    paddingHorizontal: 16,
    color: "#888",
  },
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
    alignItems: "center",
    gap: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
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
    borderRadius: 1,
    color: "white",
  },
  eco: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 1,
    color: "white",
  },
  imagenPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
});

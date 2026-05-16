import { categorias } from "@/data/categorias";
import { etiquetas } from "@/data/etiquetas";
import { marcas } from "@/data/marcas";
import { buildRoute, ROUTES } from "@/constants/routes";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import "react-native-reanimated";

export default function IndexScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ width: "100%", gap: 8 }}>
          <Text style={{ fontSize: 12, color: "green", letterSpacing: 1.5 }}> CURATED FLAVORS </Text>
          <Text style={{ fontSize: 36, fontWeight: "bold" }}>
            The art of{" "}
            <Text style={{ color: "green", fontStyle: "italic" }}>conscious</Text>
            {" "}discovery.
          </Text>
        </View>
        <CategoriasGrid/>
        <EtiquetasLista/>
        <MarcasScroll/>
      </ScrollView>
      <ButtonSearch/>
    </View>
  );
}

type ListItem = {
  id: string;
  nombre: string;
}

const CATEGORIA_COLORES: Record<string, [string, string]> = {
  beverages: ["#4a90e2", "#2a61da"],
  dairies: ["#fddd73", "#e7a740"],
  snacks: ["#f062c5", "#b91d73"],
  breakfasts: ["#eec614", "#f0911e"],
  desserts: ["#a18cd1", "#fbc2eb"],
  chocolates: ["#3a3a3a", "#1a1a1a"],
  "biscuits-and-cakes": ["#c97b4b", "#8B5E3C"],
  "cereals-and-potatoes": ["#56ab2f", "#a8e063"],
  meals: ["#e04d4b", "#b71c1c"],
  "plant-based-foods": ["#11998e", "#38ef7d"],
};

function CategoriasGrid() {
  const router = useRouter();
  return (
    <View style={styles.listBlock}>
      <Text style={styles.listTitle}>Categories</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {categorias.map((item) => (
          <CategoriaCard
            key={item.id}
            item={item}
            onPress={() => router.push(buildRoute(ROUTES.CATEGORIA, { nombre: item.id }))}
          />
        ))}
      </View>
    </View>
  );
}

function CategoriaCard({ item, onPress }: { item: ListItem; onPress: () => void }) {
  const colores = CATEGORIA_COLORES[item.id] ?? ["#ccc", "#aaa"];
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <LinearGradient
        colors={colores}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={styles.gradiente}
      >
        <Text style={styles.cardText}>{item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1)}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function MarcasScroll() {
  const router = useRouter();
  return (
    <View style={styles.listBlock}>
      <Text style={styles.listTitle}>Global Brands</Text>
      <Text style={{fontSize: 14, marginTop: -10 }}>Explored through the lens of quality.</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 4 }}
        style={{ backgroundColor: "transparent" }}
      >
        {marcas.map((item) => (
          <Pressable
            key={item.id}
            style={styles.marcaCard}
            onPress={() => router.push(buildRoute(ROUTES.MARCA, { nombre: item.id }))}
          >
            <Image style={styles.imagenPlaceholder} source={item.imagen} contentFit="cover" />
            <Text style={styles.marcaText}> {item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1)}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function EtiquetasLista() {
  const router = useRouter();
  return (
    <View style={styles.listBlock}>
      <Text style={styles.listTitle}>Refine by Taste</Text>
      <View style={styles.itemsContainer}>
        {etiquetas.map((item) => (
          <Pressable
            key={item.id}
            onPress={() =>  router.push(buildRoute(ROUTES.ETIQUETA, {nombre: item.id}))}
            style={styles.itemButton}
          >
            <Text style={styles.itemText}>{item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ButtonSearch() {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push(ROUTES.TABS_BUSCAR)} style={styles.floatButton}>
      <LinearGradient
        colors={["#1b5500", "#00b646"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradienteBoton}
      >
        <FontAwesome name="search" size={20} color="white" />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  listBlock: {
    width: "100%",
    maxWidth: 420,
    gap: 12,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  itemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  itemButton: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#b3e0b6",
  },
  itemText: {
    fontSize: 15,
    color: "#156e1a",
  },
  card: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  marcaCard: {
    width: 115,
    height: 130,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  imagenPlaceholder: {
    width: 56,
    height: 56,
    backgroundColor: "#f0f0f0",
    borderRadius: 28,
  },
  marcaText: {
    fontSize: 16,
    fontWeight: "600",
  },
  floatButton: {
    position: "absolute",
    bottom: 20,
    right: 16,
    width: 55,
    height: 55,
    borderRadius: 28,
    overflow: "hidden",
  },
  gradiente: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    justifyContent: "flex-end",
  },
  gradienteBoton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

import { buildRoute, ROUTES } from "@/src/constants/routes";
import { categorias } from "@/src/data/categorias";
import { etiquetas } from "@/src/data/etiquetas";
import { marcas } from "@/src/data/marcas";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import "react-native-reanimated";

export default function IndexScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.subtitle}>CURATED FLAVORS</Text>
          <Text style={styles.title}>
            The art of <Text style={styles.consciousText}>conscious</Text>{" "}
            discovery.
          </Text>
        </View>
        <CategoriasGrid />
        <EtiquetasLista />
        <MarcasScroll />
      </ScrollView>
      <ButtonSearch />
    </View>
  );
}

type ListItem = {
  id: string;
  nombre: string;
};

const CATEGORIA_CONFIG: Record<
  string,
  { colores: [string, string]; icono: string }
> = {
  beverages: { colores: ["#4a90e2", "#2a61da"], icono: "coffee" },
  dairies: { colores: ["#fddd73", "#e7a740"], icono: "tint" },
  snacks: { colores: ["#f062c5", "#b91d73"], icono: "star" },
  breakfasts: { colores: ["#eec614", "#f0911e"], icono: "sun-o" },
  desserts: { colores: ["#a18cd1", "#fbc2eb"], icono: "birthday-cake" },
  chocolates: { colores: ["#3a3a3a", "#1a1a1a"], icono: "heart" },
  "biscuits-and-cakes": { colores: ["#c97b4b", "#8B5E3C"], icono: "cubes" },
  "cereals-and-potatoes": { colores: ["#56ab2f", "#a8e063"], icono: "leaf" },
  meals: { colores: ["#e04d4b", "#b71c1c"], icono: "cutlery" },
  "plant-based-foods": { colores: ["#11998e", "#38ef7d"], icono: "pagelines" },
};

function CategoriasGrid() {
  const router = useRouter();
  return (
    <View style={styles.listBlock}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Categories</Text>
      </View>
      <View style={styles.categoriesGrid}>
        {categorias.map((item) => (
          <CategoriaCard
            key={item.id}
            item={item}
            onPress={() =>
              router.push(buildRoute(ROUTES.CATEGORIA, { nombre: item.id }))
            }
          />
        ))}
      </View>
    </View>
  );
}

function CategoriaCard({
  item,
  onPress,
}: {
  item: ListItem;
  onPress: () => void;
}) {
  const config = CATEGORIA_CONFIG[item.id] ?? {
    colores: ["#ccc", "#aaa"],
    icono: "question",
  };
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <LinearGradient
        colors={config.colores}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={styles.gradiente}
      >
        <FontAwesome
          name={config.icono as any}
          size={32}
          color="rgba(255,255,255,0.3)"
          style={styles.cardIcon}
        />
        <Text style={styles.cardText}>
          {item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1)}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

function MarcasScroll() {
  const router = useRouter();
  return (
    <View style={styles.listBlock}>
      <Text style={styles.listTitle}>Global Brands</Text>
      <Text style={styles.brandSubtitle}>
        Explored through the lens of quality.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.brandsScrollContent}
        style={styles.brandsScroll}
      >
        {marcas.map((item) => (
          <Pressable
            key={item.id}
            style={styles.marcaCard}
            onPress={() =>
              router.push(buildRoute(ROUTES.MARCA, { nombre: item.id }))
            }
          >
            <Image
              style={styles.imagenPlaceholder}
              source={item.imagen}
              contentFit="cover"
            />
            <Text style={styles.marcaText}>
              {" "}
              {item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1)}
            </Text>
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
            onPress={() =>
              router.push(buildRoute(ROUTES.ETIQUETA, { nombre: item.id }))
            }
            style={styles.itemButton}
          >
            <Text style={styles.itemText}>
              {item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ButtonSearch() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(ROUTES.TABS_BUSCAR)}
      style={styles.floatButton}
    >
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
  screen: {
    flex: 1,
  },
  headerContainer: {
    width: "100%",
    gap: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "green",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
  consciousText: {
    color: "green",
    fontStyle: "italic",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  cardIcon: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  brandSubtitle: {
    fontSize: 14,
    marginTop: -10,
    paddingHorizontal: 2,
  },
  brandsScrollContent: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  brandsScroll: {
    backgroundColor: "transparent",
  },
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
    width: 100,
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
    width: 52,
    height: 52,
    backgroundColor: "#f0f0f0",
    borderRadius: 28,
  },
  marcaText: {
    fontSize: 14,
    fontWeight: "700",
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

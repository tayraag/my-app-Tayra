import { categorias } from "@/data/categorias";
import { etiquetas } from "@/data/etiquetas";
import { marcas } from "@/data/marcas";
import { buildRoute, ROUTES } from "@/constants/routes";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import "react-native-reanimated";

export default function IndexScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <CategoriasGrid/>
        <MarcasScroll/>
        <EtiquetasLista/>
      </ScrollView>
      <ButtonSearch/>
    </View>
  );
}

type ListItem = {
  id: string;
  nombre: string;
}

function CategoriasGrid() {
  const router = useRouter();
  return (
    <View style={styles.listBlock}>
      <Text style={styles.listTitle}>Categorias</Text>
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
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.cardText}>{item.nombre}</Text>
    </Pressable>
  );
}

function MarcasScroll() {
  const router = useRouter();
  return (
    <View style={styles.listBlock}>
      <Text style={styles.listTitle}>Marcas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {marcas.map((item) => (
          <Pressable
            key={item.id}
            style={styles.marcaCard}
            onPress={() => router.push(buildRoute(ROUTES.MARCA, { nombre: item.id }))}
          >
            <View style={styles.imagenPlaceholder} />
            <Text style={styles.marcaText}>{item.nombre}</Text>
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
      <Text style={styles.listTitle}>Etiquetas</Text>
      <View style={styles.itemsContainer}>
        {etiquetas.map((item) => (
          <Pressable
            key={item.id}
            onPress={() =>  router.push(buildRoute(ROUTES.ETIQUETA, {nombre: item.id}))}
            style={styles.itemButton}
          >
            <Text style={styles.itemText}>{item.nombre}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ButtonSearch(){
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(ROUTES.TABS_BUSCAR)}
      style={styles.floatButton}>
      <FontAwesome name="search" size={20} color="white" />
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
    backgroundColor: "#f0f4f8",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  itemText: {
    fontSize: 16,
  },
  card: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 16,
    padding: 12,
    justifyContent: "flex-end",
    backgroundColor: "#e0e0e0",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "700",
  },
  marcaCard: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    gap: 4,
  },
  marcaText: {
    fontSize: 16,
    fontWeight: "600",
  },
  imagenPlaceholder: {
    width: 45,
    height: 45,
    backgroundColor: "#e0e0e0",
    borderRadius: 30,
  },
  floatButton: {
    position: "absolute",
    bottom: 20,
    right: 16,
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#363636",
    justifyContent: "center",
    alignItems: "center",
  },
});

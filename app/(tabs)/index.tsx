import {ROUTES} from "@/constants/routes";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import "react-native-reanimated";

const categorias: string[] = [
  "beverages",
  "dairies",
  "snacks",
  "breakfasts",
  "desserts",
  "chocolates",
  "biscuits-and-cakes",
  "cereals-and-potatoes",
  "meals",
  "plant-based-foods",
];

const marcas: string[] = [
  "nestle",
  "coca-cola",
  "pepsi",
  "danone",
  "kelloggs",
  "unilever",
  "mondelez",
  "mars",
  "ferrero",
  "lactalis",
];

const etiquetas: string[] = [
  "organic",
  "vegan",
  "vegetarian",
  "gluten-free",
  "no-added-sugar",
  "fair-trade",
  "lactose-free",
  "palm-oil-free",
  "high-fiber",
  "low-fat",
];

export default function IndexScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SeccionList title="Categorias" items={categorias} type="categorias" />
      <SeccionList title="Marcas" items={marcas} type="marcas" />
      <SeccionList title="Etiquetas" items={etiquetas} type="etiquetas" />
    </ScrollView>
  );
}

type SectionListProps = {
  title: string;
  items: string[];
  type: "categorias" | "marcas" | "etiquetas";
};
const SeccionList = ({ title, items, type }: SectionListProps) => {
  const router = useRouter();

  const navToListItem = (item: string) => {
    const pathname =
      type === "categorias"
        ? ROUTES.CATEGORIA
        : type === "marcas"
          ? ROUTES.MARCA
          : ROUTES.ETIQUETA;
    router.push({ pathname: pathname, params: { nombre: item } });
  };

  return (
    <View style={styles.listBlock}>
      <Text style={styles.listTitle}>{title}</Text>
      <View style={styles.itemsContainer}>
        {items.map((item) => (
          <Pressable
            key={item}
            onPress={() => navToListItem(item)}
            style={styles.itemButton}
          >
            <Text style={styles.itemText}>{item}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

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
});

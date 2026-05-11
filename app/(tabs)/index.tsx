import { categorias } from "@/data/categorias";
import { etiquetas } from "@/data/etiquetas";
import { marcas } from "@/data/marcas";
import { AppRoute, buildRoute, ROUTES } from "@/constants/routes";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import "react-native-reanimated";

export default function IndexScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SeccionList title="Categorias" items={categorias} route={ROUTES.CATEGORIA}/>
      <SeccionList title="Marcas" items={marcas} route={ROUTES.MARCA}/>
      <SeccionList title="Etiquetas" items={etiquetas} route={ROUTES.ETIQUETA}/>
    </ScrollView>
  );
}

type ListItem = {
  id: string;
  nombre: string;
}

type SectionListProps = {
  title: string;
  items: ListItem[];
  route: AppRoute;
};

const SeccionList = ({ title, items, route }: SectionListProps) => {
  const router = useRouter();

  const navToListItem = (item: ListItem) => {
    router.push(buildRoute(route, {nombre: item.id}));
  };

  return (
    <View style={styles.listBlock}>
      <Text style={styles.listTitle}>{title}</Text>
      <View style={styles.itemsContainer}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => navToListItem(item)}
            style={styles.itemButton}
          >
            <Text style={styles.itemText}>{item.nombre}</Text>
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

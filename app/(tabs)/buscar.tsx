import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function SearchScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Busqueda</Text>
    </View>
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
});

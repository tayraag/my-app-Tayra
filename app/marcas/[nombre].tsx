import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import ProductosFiltrables from "@/components/ProductosListado";

type MarcaParams = {
  nombre: string;
};

export default function MarcaScreen() {
  const { nombre } = useLocalSearchParams<MarcaParams>();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: nombre.charAt(0).toUpperCase() + nombre.slice(1) }} />
      <Text style={styles.title}>Marca</Text>
      <Text style={styles.value}>{nombre}</Text>
      <ProductosFiltrables tipo="marca" valor={nombre}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  value: {
    fontSize: 20,
  },
});

import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import ProductosFiltrables from "@/components/ProductosListado";

type EtiquetaParams = {
  nombre: string;
};

export default function EtiquetaScreen() {
  const { nombre } = useLocalSearchParams<EtiquetaParams>();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: nombre }} />
      <Text style={styles.title}>Etiqueta</Text>
      <Text style={styles.value}>{nombre}</Text>
      <ProductosFiltrables tipo="etiquetas" valor={nombre}/>
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

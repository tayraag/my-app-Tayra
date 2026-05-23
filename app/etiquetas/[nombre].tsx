import ProductosFiltrables from "@/src/components/ProductosListado";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

type EtiquetaParams = {
  nombre: string;
};

export default function EtiquetaScreen() {
  const { nombre } = useLocalSearchParams<EtiquetaParams>();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: nombre.charAt(0).toUpperCase() + nombre.slice(1) }}
      />
      <ProductosFiltrables tipo="etiquetas" valor={nombre} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

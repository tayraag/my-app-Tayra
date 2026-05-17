import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import ProductosFiltrables from "@/components/ProductosListado";

type CategoriaParams = {
  nombre: string;
};

export default function CategoriaScreen() {
  const { nombre } = useLocalSearchParams<CategoriaParams>();
  
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: nombre.charAt(0).toUpperCase() + nombre.slice(1) }} />
      <Text style={styles.title}> {nombre.toUpperCase()}</Text>
      <ProductosFiltrables tipo="categoria" valor={nombre}/>
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
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
  },
});
import { productos, Producto } from "@/data/productos";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

type FichaParams = {
  id: string;
};
export default function FichaScreen() {
  const { id } = useLocalSearchParams<FichaParams>();
  const prod = productos.find((p) => p.id === id);

  if (!prod) {
    return <Text>Producto no encontrado</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: prod.nombre }} />
      <DataPrincipal producto={prod}/>
    </View>
  );
}

function DataPrincipal ({producto} : {producto: Producto}){
  return (
    <View>
      <Text>{producto.marca}</Text>
      <Text>{producto.nombre}</Text>
      <View style = {flexDirection: "row"}>
        <Text style = {styles.scores}>{producto.nutriScore}</Text>
        <Text style = {styles.scores}>{producto.novaGroup}</Text>
        <Text style = {styles.scores}>{producto.ecoScore}</Text>
      </View>
      <View>
        {// nutritional values
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  scores:{

  },
});


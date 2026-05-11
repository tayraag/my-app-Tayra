import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import "react-native-reanimated";

type FichaParams = {
  id: string;
};
export default function FichaScreen() {
  const { id } = useLocalSearchParams<FichaParams>();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{title: "Producto" }}/>
      <Text> Ficha del producto {id}</Text>
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
});


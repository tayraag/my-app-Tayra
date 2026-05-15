import { productos, Producto } from "@/data/productos";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ROUTES } from "@/constants/routes";

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
      <ScrollView>
        <View style={styles.imagenPlaceholder} />
        <SeccionPrincipal producto={prod} />
        <SeccionIngredientes producto={prod} />
        <SeccionNutricional producto={prod} />
      </ScrollView>
    </View>
  );
}

function SeccionPrincipal({ producto } : { producto: Producto }){
  return (
    <View style={[styles.seccion, { marginTop: -40 }]}>
      <FavButton />
      <Text style={styles.marca}>{producto.marca.toUpperCase()}</Text>
      <Text style={styles.nombreProducto}>{producto.nombre}</Text>
      <View style = {{flexDirection: "row", gap: 8}}>
        <Text style = {styles.scores}>Nutri - Score: {producto.nutriScore}</Text>
        <Text style = {styles.scores}>Nova Group: {producto.novaGroup}</Text>
        <Text style = {styles.scores}>Eco - Store: {producto.ecoScore}</Text>
      </View>
      <ValoresNutricionales producto={producto}/>
    </View>
  );
}

function SeccionIngredientes({ producto } : { producto: Producto }){
  return(
    <View style={styles.seccion}>
      <Text style={styles.tituloSeccion}> Ingredientes</Text>
      <Text>{producto.ingredientes}</Text>
      <View>
        <Text>Alergenos</Text>
        <Text>{producto.alergenos}</Text>
      </View>
    </View>
  );
}

function SeccionNutricional({ producto }: { producto: Producto }) {
  return (
    <View style={styles.seccion}>
      <Text style={styles.tituloSeccion}> Valores Nutricional (100ml)</Text>
      <FilaValor label="Energía" valor={`${producto.energia} kJ`} />
      <FilaValor label="Grasa" valor={`${producto.grasa}g`} />
      <FilaValor label="— saturadas" valor={`${producto.grasaSaturada}g`} />
      <FilaValor label="Carbohidratos" valor={`${producto.carbohidratos}g`} />
      <FilaValor label="— azúcares" valor={`${producto.azucares}g`} />
      <FilaValor label="Fibra" valor={`${producto.fibra}g`} />
      <FilaValor label="Proteína" valor={`${producto.proteina}g`} />
      <FilaValor label="Sal" valor={`${producto.sal}g`} />
    </View>
  );
}

function ValoresNutricionales({ producto }: { producto: Producto }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <ValorItem label="Energía" valor={`${producto.energia} kJ`} />
      <ValorItem label="Grasa" valor={`${producto.grasa}g`} />
      <ValorItem label="Proteina" valor={`${producto.proteina}g`} />
      <ValorItem label="Carbohidratos" valor={`${producto.carbohidratos}g`} />
      <ValorItem label="Fibra" valor={`${producto.fibra}g`} />
      <ValorItem label="Sal" valor={`${producto.sal}g`} />
    </ScrollView>
  );
}

function ValorItem({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.valorItem}>
      <Text style={styles.valorLabel}>{label}</Text>
      <Text style={styles.valorNumero}>{valor}</Text>
    </View>
  );
}

function FilaValor({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
      <Text>{label}</Text>
      <Text style={{ fontWeight: "700" }}>{valor}</Text>
    </View>
  );
}

function FavButton(){
  const router = useRouter(); 
  return(
    <Pressable
      onPress={() => router.push(ROUTES.TABS_FAVS)}
      style={styles.floatFav}>
      <FontAwesome name="heart" size={20} color="white" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  seccion: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 15,
    padding: 16,
    gap: 8,
    marginBottom: 15,
    marginHorizontal: 16,
    backgroundColor: "#fff",
  },
  marca: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 1,
  },
  nombreProducto: {
    fontSize: 22,
    fontWeight: "700",
  },
  tituloSeccion: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  scores: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontWeight: "700",
    fontSize: 13,
  },
  valorItem: {
    alignItems: "center",
    marginRight: 16,
    minWidth: 60,
  },
  valorLabel: {
    fontSize: 10,
    fontWeight: "700",
  },
  valorNumero: {
    fontSize: 14,
  },
  imagenPlaceholder: {
    width: "100%",
    height: 280,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  floatFav: {
    position: "absolute",
    top: -20,
    right: 17,
    width: 44,
    height: 46,
    borderRadius: 22,
    backgroundColor: "#363636",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
  },
});


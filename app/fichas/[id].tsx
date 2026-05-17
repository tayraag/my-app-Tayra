import { productos, Producto } from "@/data/productos";
import { Stack, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

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
        <Image style={styles.imagenPlaceholder} source={prod.imagen} contentFit="cover" />
        <SeccionPrincipal producto={prod} />
        <SeccionIngredientes producto={prod} />
        <SeccionNutricional producto={prod} />
      </ScrollView>
    </View>
  );
}

const NUTRI_COLORES: Record<string, string> = {
  A: "#2e7d32", B: "#8bc34a", C: "#fdd835", D: "#ff9800", E: "#f44336",
};

const NOVA_COLORES: Record<number, string> = {
  1: "#2e7d32", 2: "#8bc34a", 3: "#ff9800", 4: "#f44336",
};

const ECO_COLORES: Record<string, string> = {
  "A+": "#1b5e20", A: "#2e7d32", "B+": "#558b2f", B: "#8bc34a",
  C: "#fdd835", D: "#ff9800", E: "#f44336",
};

function SeccionPrincipal({ producto } : { producto: Producto }){
  return (
    <View style={[styles.seccion, { marginTop: -40 }]}>
      <FavButton />
      <Text style={styles.marca}>{producto.marca.toUpperCase()}</Text>
      <Text style={styles.nombreProducto}>{producto.nombre}</Text>
      <View style = {{flexDirection: "row", gap: 8}}>
        <Text style={[styles.scores, { backgroundColor: NUTRI_COLORES[producto.nutriScore], color: "white", borderWidth: 0 }]}>
          Nutri-Score: {producto.nutriScore}
        </Text>
        <Text style={[styles.scores, { backgroundColor: NOVA_COLORES[producto.novaGroup], color: "white", borderWidth: 0 }]}>
          Nova: {producto.novaGroup}
        </Text>
        <Text style={[styles.scores, { backgroundColor: ECO_COLORES[producto.ecoScore] ?? "#ccc", color: "white", borderWidth: 0 }]}>
          Eco-Score: {producto.ecoScore}
        </Text>
      </View>
      <ValoresNutricionales producto={producto}/>
    </View>
  );
}

function SeccionIngredientes({ producto } : { producto: Producto }){
  return(
    <View style={styles.seccion}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <FontAwesome name="list-alt" size={20} color="#2e7d32" />
        <Text style={styles.tituloSeccion}>Ingredientes</Text>
      </View>
      <Text>{producto.ingredientes}</Text>
      <View style={styles.alergenoBox}>
        <FontAwesome name="warning" size={16} color="#c62828" />
        <View style={{ flex: 1 }}>
          <Text style={styles.alergenoTitulo}>ALERGENOS</Text>
          <Text style={styles.alergenoTexto}>{producto.alergenos}</Text>
        </View>
      </View>
    </View>
  );
}

function SeccionNutricional({ producto }: { producto: Producto }) {
  return (
    <View style={styles.seccion}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <FontAwesome name="bar-chart" size={20} color="#2e7d32" />
        <Text style={styles.tituloSeccion}>Valores Nutricionales (100ml)</Text>
      </View>
      <FilaValor label="Energía" valor={`${producto.energia} kJ`} />
      <FilaValor label="Grasa" valor={`${producto.grasa}g`} />
      <FilaValor label="— of which saturates" valor={`${producto.grasaSaturada}g`} sub />
      <FilaValor label="Carbohidratos" valor={`${producto.carbohidratos}g`} sub={false} />
      <FilaValor label="— of which sugars" valor={`${producto.azucares}g`} sub />
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

function FilaValor({ label, valor, sub = false }: { label: string; valor: string; sub?: boolean }) {
  return (
    <View style={styles.filaValor}>
      <Text style={[styles.filaLabel, sub && styles.filaLabelSub]}>{label}</Text>
      <Text style={[styles.filaValorText, sub && styles.filaValorSub]}>{valor}</Text>
    </View>
  );
}

function FavButton() {
  const [favorito, setFavorito] = useState(false);
  return (
    <Pressable style={styles.floatFav} onPress={() => setFavorito(!favorito)}>
      <LinearGradient
        colors={favorito ? ["#e91e63", "#f44336"] : ["#aaa", "#888"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradienteFav}
      >
        <FontAwesome name={favorito ? "heart" : "heart-o"} size={20} color="white" />
      </LinearGradient>
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
    color: "green",
  },
  nombreProducto: {
    fontSize: 26,
    fontWeight: "800",
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
    marginRight: 8,
    minWidth: 70,
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    padding: 10,
  },
  valorLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2e7d32",
  },
  valorNumero: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2e7d32",
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
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    zIndex: 10,
    elevation: 10,
  },
  gradienteFav: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  alergenoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#ffebee",
    borderRadius: 10,
    padding: 12,
  },
  alergenoTitulo: {
    fontSize: 13,
    fontWeight: "700",
    color: "#c62828",
    letterSpacing: 0.5,
  },
  alergenoTexto: {
    fontSize: 13,
    color: "#c62828",
    marginTop: 2,
  },
  filaValor: {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0",
  },
  filaLabel: {
    fontSize: 15,
    color: "#333",
  },
  filaLabelSub: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#888",
    paddingLeft: 8,
  },
  filaValorText: {
    fontSize: 15,
    fontWeight: "700",
  },
  filaValorSub: {
    fontWeight: "400",
    color: "#888",
  },
});


import { Producto, productos } from "@/data/productos";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
        <Image
          style={styles.imagenPlaceholder}
          source={prod.imagen}
          contentFit="cover"
        />
        <SeccionPrincipal producto={prod} />
        <SeccionIngredientes producto={prod} />
        <SeccionNutricional producto={prod} />
      </ScrollView>
    </View>
  );
}

const NUTRI_COLORES: Record<string, string> = {
  A: "#2e7d32",
  B: "#8bc34a",
  C: "#fdd835",
  D: "#ff9800",
  E: "#f44336",
};

const NOVA_COLORES: Record<number, string> = {
  1: "#2e7d32",
  2: "#8bc34a",
  3: "#ff9800",
  4: "#f44336",
};

const ECO_COLORES: Record<string, string> = {
  "A+": "#1b5e20",
  A: "#2e7d32",
  "B+": "#558b2f",
  B: "#8bc34a",
  C: "#fdd835",
  D: "#ff9800",
  E: "#f44336",
};

function SeccionPrincipal({ producto }: { producto: Producto }) {
  return (
    <View style={[styles.seccion, { marginTop: -40 }]}>
      <FavButton />
      <Text style={styles.marca}>{producto.marca.toUpperCase()}</Text>
      <Text style={styles.nombreProducto}>{producto.nombre}</Text>
      <View style={{ flexDirection: "row", gap: 15, justifyContent: "center" }}>
        <ScoreBox label={"NUTRI-\nSCORE"} valor={producto.nutriScore} color={NUTRI_COLORES[producto.nutriScore]} />
        <ScoreBox label={"NOVA\nGROUP"} valor={producto.novaGroup} color={NOVA_COLORES[producto.novaGroup]} />
        <ScoreBox label={"ECO-\nSCORE"} valor={producto.ecoScore} color={ECO_COLORES[producto.ecoScore] ?? "#ccc"} />
      </View>
      <ValoresNutricionales producto={producto} />
    </View>
  );
}

function SeccionIngredientes({ producto }: { producto: Producto }) {
  return (
    <View style={[styles.seccion, { backgroundColor: "#f9f9f9" }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <FontAwesome name="table" size={20} color="#2e7d32" />
        <Text style={styles.tituloSeccion}>Ingredients</Text>
      </View>
      <Text style={{ lineHeight: 23, marginHorizontal: 6 }}>{producto.ingredientes}</Text>
      <View style={styles.alergenoBox}>
        <FontAwesome name="warning" size={16} color="#c62828" />
        <View style={{ flex: 1 }}>
          <Text style={styles.alergenoTitulo}>ALLERGEN INFORMATION</Text>
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
        <Text style={styles.tituloSeccion}>Nutritional Values (per 100ml)</Text>
      </View>
      <FilaValor label="Energy" valor={`${producto.energia} kJ`} />
      <FilaValor label="Fat" valor={`${producto.grasa}g`} />
      <FilaValor label="  — of which saturates" valor={`${producto.grasaSaturada}g`} sub/>
      <FilaValor label="Carbohydrate" valor={`${producto.carbohidratos}g`} sub={false}/>
      <FilaValor label="  — of which sugars" valor={`${producto.azucares}g`} sub/>
      <FilaValor label="Fibre" valor={`${producto.fibra}g`} />
      <FilaValor label="Protein" valor={`${producto.proteina}g`} />
      <FilaValor label="Sal" valor={`${producto.sal}g`} />
    </View>
  );
}

function ValoresNutricionales({ producto }: { producto: Producto }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <ValorItem label="ENERGY" valor={`${producto.energia} kJ`} />
      <ValorItem label="FAT" valor={`${producto.grasa}g`} />
      <ValorItem label="CARBOHYDRATE" valor={`${producto.carbohidratos}g`} />
      <ValorItem label="FIBRE" valor={`${producto.fibra}g`} />
      <ValorItem label="PROTEIN" valor={`${producto.proteina}g`} />
      <ValorItem label="SAL" valor={`${producto.sal}g`} />
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

function ScoreBox({ label, valor, color }: { label: string; valor: string | number; color: string }) {
  return (
    <View style={styles.scoreBox}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <View style={[styles.scoreColorBox, { backgroundColor: color }]}>
        <Text style={styles.scoreValor}>{valor}</Text>
      </View>
    </View>
  );
}

function FilaValor({label, valor, sub = false}: { label: string; valor: string; sub?: boolean;}) {
  return (
    <View style={styles.filaValor}>
      <Text style={[styles.filaLabel, sub && styles.filaLabelSub]}>
        {label}
      </Text>
      <Text style={[styles.filaValorText, sub && styles.filaValorSub]}>
        {valor}
      </Text>
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
        <FontAwesome
          name={favorito ? "heart" : "heart-o"}
          size={20}
          color="white"
        />
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
    marginHorizontal: 26,
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
  scoreBox: {
    width: 80,
    height: 82,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 4,
  },
  scoreLabel: {
    fontSize: 9,
    color: "#888",
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  scoreColorBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreValor: {
    fontSize: 20,
    color: "white",
    fontWeight: "800",
  },
  valorItem: {
    alignItems: "center",
    minWidth: 60,
    backgroundColor: "#c7e0c9",
    borderRadius: 3,
    padding: 10,
    marginRight: 14,
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
    borderBottomColor: "#eeeded",
    marginHorizontal: 6,
  },
  filaLabel: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  filaLabelSub: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#888",
    paddingLeft: 24,
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

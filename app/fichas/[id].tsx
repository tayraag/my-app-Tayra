import { useQueryClient } from "@tanstack/react-query";
import { Producto } from "@/src/data/productos";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { obtenerFavorito } from "@/src/services/favoritos";
import { useFavoritos } from "@/src/hooks/useFavoritos";
import { NUTRI_COLORES, NOVA_COLORES, ECO_COLORES, normalizarEcoScore } from "@/src/constants/scores";

type FichaParams = {
  id: string;
  tipoFiltro: string;
  valorFiltro: string;
};

export default function FichaScreen() {
  const { id, tipoFiltro, valorFiltro } = useLocalSearchParams<FichaParams>();
  const queryClient = useQueryClient();
  const [prod, setProd] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarProducto() {
      if (tipoFiltro === "favorito") {
        const fav = await obtenerFavorito(id);
        setProd(fav);
      } else {
        const cachedData: any = queryClient.getQueryData(["products", tipoFiltro, valorFiltro]);
        const found = cachedData?.pages?.flatMap((page: any) => page.products).find((p: any) => p.id === id);
        setProd(found || null);
      }
      setLoading(false);
    }
    cargarProducto();
  }, [id, tipoFiltro, valorFiltro, queryClient]);

  if (loading) {
    return (
      <View style={styles.containerCenter}>
        <ActivityIndicator size="large" color="#0055ff" />
      </View>
    );
  }

  if (!prod) {
    return (
      <View style={styles.containerCenter}>
        <Text style={{ marginTop: 20 }}>Producto no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          style={styles.imagenPlaceholder}
          source={prod.imagen}
          contentFit="cover"
        />
        <SeccionPrincipal producto={prod} />
        <SeccionIngredientes producto={prod} />
        <ValoresNutricionales producto={prod} vertical />
      </ScrollView>
    </View>
  );
}


function SeccionPrincipal({ producto }: { producto: Producto }) {
  const nutriStr = String(producto.nutriScore || "").toUpperCase();
  const ecoStr = String(producto.ecoScore || "").toUpperCase();
  const esNutriNoAplicable =
    !producto.nutriScore ||
    nutriStr === "NOT-APPLICABLE" ||
    nutriStr === "UNKNOWN" ||
    nutriStr === "NOT-KNOWN" ||
    nutriStr === "N/A";
  const esEcoNoAplicable =
    !producto.ecoScore ||
    ecoStr === "NOT-APPLICABLE" ||
    ecoStr === "UNKNOWN" ||
    ecoStr === "NOT-KNOWN" ||
    ecoStr === "N/A";
  const esNovaNoAplicable =
    !producto.novaGroup ||
    producto.novaGroup < 1 ||
    producto.novaGroup > 4;

  const valorNutri = esNutriNoAplicable ? "-" : producto.nutriScore;
  const valorEco = esEcoNoAplicable ? "-" : normalizarEcoScore(producto.ecoScore);
  const valorNova = esNovaNoAplicable ? "-" : producto.novaGroup;

  return (
    <View style={[styles.seccion, styles.seccionPrincipalOffset]}>
      <FavButton producto={producto} />
      <Text style={styles.marca}>{producto.marca.toUpperCase()}</Text>
      <Text style={styles.nombreProducto}>{producto.nombre}</Text>
      <View style={styles.scoresContainer}>
        <ScoreBox
          label={"NUTRI-\nSCORE"}
          valor={valorNutri}
          color={esNutriNoAplicable ? "#727272" : (NUTRI_COLORES[producto.nutriScore] ?? "#727272")}
        />
        <ScoreBox
          label={"NOVA\nGROUP"}
          valor={valorNova}
          color={esNovaNoAplicable ? "#727272" : (NOVA_COLORES[producto.novaGroup] ?? "#727272")}
        />
        <ScoreBox
          label={"ECO-\nSCORE"}
          valor={valorEco}
          color={esEcoNoAplicable ? "#727272" : (ECO_COLORES[valorEco] ?? "#727272")}
        />
      </View>
      <ValoresNutricionales producto={producto} />
    </View>
  );
}

function SeccionIngredientes({ producto }: { producto: Producto }) {
  const sinInfo = 
    !producto.ingredientes || 
    producto.ingredientes.trim() === "" || 
    producto.ingredientes === "-" || 
    producto.ingredientes === "No especificados";
  return (
    <View style={[styles.seccion, styles.seccionIngredientesBg]}>
      <View style={styles.seccionHeaderRow}>
        <FontAwesome name="table" size={20} color="#2e7d32" />
        <Text style={styles.tituloSeccion}>Ingredients</Text>
      </View>
      {sinInfo ? (
        <View style={styles.sinInfoBox}>
          <FontAwesome name="warning" size={24} color="black" />
          <Text style={styles.sinInfoText}>Sin información</Text>
        </View>
      ) : (
        <Text style={styles.ingredientsText}>{producto.ingredientes}</Text>
      )}
    </View>
  );
}

type NutriItemConfig = {
  key: keyof Pick<
    Producto,
    | "energia"
    | "grasa"
    | "carbohidratos"
    | "fibra"
    | "proteina"
    | "sal"
  >;
  label: string;
  unit: string;
};

const SECCION_NUTRI_ITEMS: NutriItemConfig[] = [
  { key: "energia", label: "Energy", unit: "" },
  { key: "grasa", label: "Fat", unit: "g" },
  { key: "carbohidratos", label: "Carbohydrate", unit: "g" },
  { key: "fibra", label: "Fibre", unit: "g" },
  { key: "proteina", label: "Protein", unit: "g" },
  { key: "sal", label: "Salt", unit: "g" },
];

const formatearValorNutricional = (valor: any): string => {
  if (typeof valor === "number") {
    return Number(valor.toFixed(2)).toString();
  }
  return String(valor);
};

function ValoresNutricionales({ producto, vertical = false }: { producto: Producto; vertical?: boolean }) {
  const renderValor = (item: NutriItemConfig) => {
    const val = producto[item.key] as any;
    if (val === undefined || val === null || val === "" || (typeof val === "number" && isNaN(val))) {
      return "-";
    }
    if (item.key === "energia") {
      if (typeof val !== "number" || isNaN(val)) {
        return "-";
      }
      const kcal = Math.round(val / 4.184);
      return `${kcal} kcal / ${val} kJ`;
    }
    return `${formatearValorNutricional(val)}${item.unit}`;
  };

  const sinInfo = SECCION_NUTRI_ITEMS.every((item) => {
    const val = producto[item.key] as any;
    return val === undefined || val === null || val === "";
  });

  if (vertical) {
    return (
      <View style={styles.seccion}>
        <View style={styles.seccionHeaderRow}>
          <FontAwesome name="bar-chart" size={20} color="#2e7d32" />
          <Text style={styles.tituloSeccion}>Nutritional Values</Text>
        </View>
        {sinInfo ? (
          <View style={styles.sinInfoBox}>
            <FontAwesome name="warning" size={24} color="black" />
            <Text style={styles.sinInfoText}>Sin información</Text>
          </View>
        ) : (
          SECCION_NUTRI_ITEMS.map((item) => (
            <FilaValor
              key={item.key}
              label={item.label}
              valor={renderValor(item)}
            />
          ))
        )}
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {SECCION_NUTRI_ITEMS.map((item) => (
        <ValorItem
          key={item.key}
          label={item.label.toUpperCase()}
          valor={renderValor(item)}
        />
      ))}
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
  const valorStr = String(valor);
  const fontSize = valorStr.length > 2 ? 13 : valorStr.length > 1 ? 15 : 20;

  return (
    <View style={styles.scoreBox}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <View style={[styles.scoreColorBox, { backgroundColor: color }]}>
        <Text style={[styles.scoreValor, { fontSize }]}>{valor}</Text>
      </View>
    </View>
  );
}

function FilaValor({ label, valor }: { label: string; valor: string; }) {
  return (
    <View style={styles.filaValor}>
      <Text style={styles.filaLabel}>
        {label}
      </Text>
      <Text style={styles.filaValorText}>
        {valor}
      </Text>
    </View>
  );
}

function FavButton({ producto }: { producto: Producto }) {
  const { esFavorito, guardarFavorito, eliminarFavorito } = useFavoritos();
  const favorito = esFavorito(producto.id);

  const handlePress = async () => {
    if (favorito) {
      await eliminarFavorito(producto.id);
    } else {
      await guardarFavorito(producto);
    }
  };

  return (
    <Pressable style={styles.floatFav} onPress={handlePress}>
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
  seccionPrincipalOffset: {
    marginTop: -40,
  },
  seccionIngredientesBg: {
    backgroundColor: "#f9f9f9",
  },
  scoresContainer: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
  },
  seccionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ingredientsText: {
    lineHeight: 23,
    marginHorizontal: 6,
  },
  alergenoInfo: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    minWidth: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
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
  filaValorText: {
    fontSize: 15,
    fontWeight: "700",
  },
  sinInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginTop: 10,
  },
  sinInfoText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
});

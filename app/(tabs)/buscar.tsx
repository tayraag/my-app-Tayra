import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useProductos } from "@/src/hooks/useProductos";
import ProductosFiltrables from "@/src/components/ProductosListado";
import EscanerCamara from "@/src/components/EscanerCamara";
import { useRouter } from "expo-router";
import { buildRoute, ROUTES } from "@/src/constants/routes";
import { getProduct } from "@/src/services/productos";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import { getHistorial, addProductoAlHistorial } from "@/src/services/historial";
import { Producto } from "@/src/data/productos";

export default function SearchScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [scanState, setScanState] = useState<"idle" | "loading" | "found" | "not_found">("idle");
  const [historial, setHistorial] = useState<Producto[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      cargarHistorial();

      return () => {
        setScannerActive(false);
        setScanState("idle");
      };
    }, [])
  );

  const cargarHistorial = async () => {
    const data = await getHistorial();
    setHistorial(data);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductos("busqueda", debouncedTerm);

  const productos = data?.pages.flatMap((page) => page.products) ?? [];
  const totalItems = data?.pages[0]?.count ?? 0;

  const handleBarcodePress = () => {
    setScannerActive(true);
    setScannedCode(null);
    setScanState("idle");
  };

  const handleBarcodeScan = async (code: string) => {
    setScannedCode(code);
    setScanState("loading");

    const productoGuardado = historial.find((p) => p.id === code || p.id === String(code));
    if (productoGuardado) {
      queryClient.setQueryData(["products", "busqueda", code], {
        pages: [{ count: 1, products: [productoGuardado] }],
        pageParams: [1],
      });
      setScanState("found");
      return;
    }

    try {
      const parsedProduct = await getProduct(code);
      queryClient.setQueryData(["products", "busqueda", code], {
        pages: [{ count: 1, products: [parsedProduct] }],
        pageParams: [1],
      });

      await addProductoAlHistorial(parsedProduct);
      await cargarHistorial();
      setScanState("found");
    } catch {
      setScanState("not_found");
    }
  };

  const handleRetry = () => {
    setScanState("idle");
    setScannedCode(null);
  };

  const handleGoToProduct = () => {
    if (scannedCode && scanState === "found") {
      setScannerActive(false);
      router.push(buildRoute(ROUTES.FICHA, { id: scannedCode, tipoFiltro: "busqueda", valorFiltro: scannedCode }));
      setScannedCode(null);
      setScanState("idle");
    }
  };

  const mostrarHistorial = !searchTerm;
  const displayProducts = mostrarHistorial ? historial : productos;
  const displayTotal = mostrarHistorial ? historial.length : totalItems;

  return (
    <View style={styles.container}>
      <ProductosFiltrables
        tipo="busqueda"
        valor={mostrarHistorial ? "" : searchTerm}
        titulo={mostrarHistorial ? "BUSCAR" : undefined}
        productos={displayProducts}
        totalItems={displayTotal}
        onEndReached={() => !mostrarHistorial && hasNextPage && fetchNextPage()}
        isFetchingNextPage={!mostrarHistorial && isFetchingNextPage}
        onSearchChange={setSearchTerm}
        onBarcodePress={handleBarcodePress}
      />
      <EscanerCamara
        visible={scannerActive}
        onClose={() => setScannerActive(false)}
        onScan={handleBarcodeScan}
        scannedCode={scannedCode}
        scanState={scanState}
        onRetry={handleRetry}
        onGoToProduct={handleGoToProduct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
});

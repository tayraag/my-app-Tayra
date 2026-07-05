import React from "react";
import { StyleSheet, View, Text, Pressable, ActivityIndicator, Modal, AppState } from "react-native";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CameraPermissions from "./CameraPermissions";

type EscanerCamaraProps = {
  visible: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
  scannedCode: string | null;
  scanState: "idle" | "loading" | "found" | "not_found";
  onRetry: () => void;
  onGoToProduct: () => void;
};

export default function EscanerCamara({
  visible,
  onClose,
  onScan,
  scannedCode,
  scanState,
  onRetry,
  onGoToProduct,
}: EscanerCamaraProps) {
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  const [facing, setFacing] = React.useState<"back" | "front">("back");
  const scannedRef = React.useRef(false);

  React.useEffect(() => {
    // Escuchar cuando la app vuelve al primer plano para actualizar el estado del permiso
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active" && visible) {
        if (getPermission) getPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [visible, getPermission]);

  React.useEffect(() => {
    if (scanState === "idle") {
      scannedRef.current = false;
    }
  }, [scanState]);

  const handleBarcodeScan = (result: BarcodeScanningResult) => {
    if (!scannedRef.current && scanState === "idle") {
      scannedRef.current = true;
      onScan(result.data);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
    >
      <View style={styles.scannerContainer}>
        <View style={styles.scannerHeader}>
          <Text style={styles.scannerTitle}>Escanear código de barras</Text>
          <View style={styles.headerRight}>
            {permission && permission.granted && (
              <Pressable style={styles.flipButton} onPress={() => setFacing(prev => prev === "back" ? "front" : "back")}>
                <FontAwesome name="refresh" size={20} color="#333" />
              </Pressable>
            )}
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <FontAwesome name="times" size={22} color="#333" />
            </Pressable>
          </View>
        </View>

        {!permission || !permission.granted ? (
          <CameraPermissions permission={permission} onRequest={requestPermission} />
        ) : (
          <View style={styles.viewportContainer}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing={facing}
              onBarcodeScanned={handleBarcodeScan}
              barcodeScannerSettings={{
                barcodeTypes: ["ean13", "ean8", "qr", "upc_a", "code128"],
              }}
            />

            <View style={styles.overlayMaskContainer} pointerEvents="none">
              <View style={styles.overlayMask} />
              <View style={styles.overlayCenterBorder}>
                <Text style={styles.overlayText}>Apuntá al código de barras del producto</Text>
              </View>
            </View>

            <View style={styles.statusContainer} pointerEvents="box-none">
              {scanState !== "idle" && (
                <View style={styles.simulateContainer}>
                  {scanState === "loading" ? (
                    <View style={styles.loadingBox}>
                      <ActivityIndicator size="small" color="#2196f3" />
                      <Text style={styles.loadingText}>Buscando en la API...</Text>
                    </View>
                  ) : scanState === "found" ? (
                    <View style={styles.errorBox}>
                      <View style={styles.successIconContainer}>
                        <FontAwesome name="check" size={20} color="white" />
                      </View>
                      <Text style={styles.successTitle}>Producto encontrado</Text>
                      {scannedCode && <Text style={styles.errorCode}>{scannedCode}</Text>}
                      
                      <Pressable style={styles.verProductoSolidBtn} onPress={onGoToProduct}>
                        <Text style={styles.verProductoSolidBtnText}>Ver producto</Text>
                        <FontAwesome name="arrow-right" size={14} color="white" style={{ marginLeft: 4 }} />
                      </Pressable>
                      
                      <Pressable style={styles.errorRetryBtn} onPress={onRetry}>
                        <Text style={styles.errorRetryText}>Volver a escanear</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <View style={styles.errorBox}>
                      <FontAwesome name="exclamation-triangle" size={32} color="#d32f2f" style={{ marginBottom: 10 }} />
                      <Text style={styles.errorTitle}>Producto no encontrado</Text>
                      {scannedCode && <Text style={styles.errorCode}>{scannedCode}</Text>}
                      <Text style={styles.errorSubtitle}>Este producto no está en la base de datos</Text>
                      
                      <Pressable style={styles.errorRetryBtn} onPress={onRetry}>
                        <Text style={styles.errorRetryText}>Volver a escanear</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        )}

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scannerContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  scannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  scannerTitle: {
    color: "#222",
    fontSize: 18,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  closeBtn: {
    padding: 4,
  },
  flipButton: {
    padding: 4,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  permissionText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: "#0b8020",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  viewportContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  overlayMaskContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  overlayMask: {
    position: "absolute",
    width: 300,
    height: 180,
    borderRadius: 1016, 
    borderWidth: 1000,
    borderColor: "rgba(0,0,0,0.6)",
  },
  overlayCenterBorder: {
    position: "absolute",
    width: 300,
    height: 180,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 16,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  overlayText: {
    position: "absolute",
    bottom: -35,
    width: 300,
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  statusContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
  simulateContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  simulateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: "center",
  },
  simulateBtnText: {
    color: "white",
    fontSize: 15,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  detectedBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderWidth: 1,
    borderColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 30,
  },
  detectedText: {
    color: "#4caf50",
    fontSize: 15,
    fontWeight: "600",
    flexShrink: 1,
  },
  verProductoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196f3",
    paddingVertical: 14,
    marginHorizontal: 30,
    borderRadius: 8,
    gap: 8,
    marginTop: 10,
    marginBottom: 40,
  },
  verProductoBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    borderWidth: 1,
    borderColor: "#2196f3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loadingText: {
    color: "#2196f3",
    fontSize: 15,
    fontWeight: "600",
  },
  successIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  successTitle: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  verProductoSolidBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5a189a",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    marginBottom: 16,
    marginTop: 10,
  },
  verProductoSolidBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    width: "100%",
  },
  errorTitle: {
    color: "#d32f2f",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  errorCode: {
    color: "#777",
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  errorSubtitle: {
    color: "#777",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  errorRetryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  errorRetryText: {
    color: "#5a189a",
    fontWeight: "bold",
    fontSize: 14,
  },
});

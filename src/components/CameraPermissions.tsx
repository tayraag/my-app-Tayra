import React from "react";
import { StyleSheet, View, Text, Pressable, ActivityIndicator, Linking } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type CameraPermissionsProps = {
  permission: {
    granted: boolean;
    canAskAgain: boolean;
    status?: string;
  } | null;
  onRequest: () => Promise<any>;
};

export default function CameraPermissions({ permission, onRequest }: CameraPermissionsProps) {
  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#5a189a" />
      </View>
    );
  }

  const handleRequest = () => {
    // Si ya se denegó previamente y no se puede volver a preguntar con el prompt nativo,
    // abrimos los ajustes del teléfono directamente al presionar el botón.
    if (!permission.canAskAgain && permission.status !== 'undetermined') {
      Linking.openSettings();
    } else {
      onRequest();
    }
  };

  return (
    <View style={styles.container}>
      <FontAwesome name="camera" size={80} color="#d1d1d1" style={{ marginBottom: 20 }} />
      <Text style={styles.title}>
        Necesitamos permiso para usar la{"\n"}cámara
      </Text>
      <Pressable style={styles.primaryButton} onPress={handleRequest}>
        <Text style={styles.buttonText}>Solicitar permiso</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "#ffffff",
  },
  title: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: "#5a189a",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

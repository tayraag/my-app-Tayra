import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="fichas/[id]" />
      <Stack.Screen name="categorias/[nombre]" />
      <Stack.Screen name="marcas/[nombre]" />
      <Stack.Screen name="etiquetas/[nombre]" />
    </Stack>
  );
}

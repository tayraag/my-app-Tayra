import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/src/hooks/useAuth";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerBackButtonDisplayMode: "minimal", headerTitle: "" }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="fichas/[id]" />
          <Stack.Screen name="categorias/[nombre]" />
          <Stack.Screen name="marcas/[nombre]" />
          <Stack.Screen name="etiquetas/[nombre]" />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </AuthProvider>
  );
}

import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          headerTitle: "Inicio",
          tabBarLabel: "Inicio",
          tabBarIcon: ({color, size, focused}) => (
            <FontAwesome name="home" size={26} color="black" />
          )
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar",
          headerTitle: "Buscar",
          tabBarLabel: "Buscar",
          tabBarIcon: ({color, size, focused}) => (
            <FontAwesome name="search" size={22} color="black" />
          )
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          headerTitle: "Favoritos",
          tabBarLabel: "Favoritos",
          tabBarIcon: ({color, size, focused}) => (
            <FontAwesome name="heart" size={20} color="black" />
          )
        }}
      />
    </Tabs>
  );
}
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
          tabBarActiveTintColor: "green",
          tabBarIcon: ({color, size, focused}) => (
            <FontAwesome name="home" size={26} color={focused ? "green" : "black"} />
          )
        }}
      />
      <Tabs.Screen
        name="buscar"
        options={{
          title: "Buscar",
          headerTitle: "Buscar",
          tabBarLabel: "Buscar",
          tabBarActiveTintColor: "green",
          tabBarIcon: ({color, size, focused}) => (
            <FontAwesome name="search" size={22} color={focused ? "green" : "black"} />
          )
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: "Favoritos",
          headerTitle: "Favoritos",
          tabBarLabel: "Favoritos",
          tabBarActiveTintColor: "green",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name={"heart"} size={20} color={focused ? "green" : "black"} />
          )
        }}
      />
    </Tabs>
  );
}
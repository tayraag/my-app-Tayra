import { Href } from "expo-router";

export const ROUTES = {
  HOME: "/", // /(tabs)/index
  MAIN_TABS: "/(tabs)",
  ALIMENTO: "/alimento",
  FORMULARIO_PASO_1: "/formulario/paso1",
  FORMULARIOPASO2: "/formulario/paso2",
  CATEGORIA: "/categorias/[nombre]",
  MARCA: "/marcas/[nombre]",
  ETIQUETA: "/etiquetas/[nombre]",
  FICHA: "/fichas/[id]",
  TABS: "/",
  TABS_FAVS: "/favoritos",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
type RouteParams = Record<string, string | number | boolean | undefined>;

export const buildRoute = (route: AppRoute, params?: RouteParams): Href => {
  if (!params) {
    return route as Href;
  }
  return {
    pathname: route,
    params,
  } as Href;
};

export function fichaShowRoute(id: string) {
  return buildRoute(ROUTES.FICHA, { id });
}
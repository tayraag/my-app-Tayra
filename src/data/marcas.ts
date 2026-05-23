export type Marca = {
  id: string;
  nombre: string;
  imagen: string;
};

export const marcas: Marca[] = [
  { id: "nestle", nombre: "nestle", imagen: require("@/assets/images/marcas/nestle.png") },
  { id: "coca-cola", nombre: "coca-cola", imagen: require("@/assets/images/marcas/coca-cola.png") },
  { id: "pepsi", nombre: "pepsi", imagen: require("@/assets/images/marcas/pepsi.png") },
  { id: "danone", nombre: "danone", imagen: require("@/assets/images/marcas/danone.png") },
  { id: "kelloggs", nombre: "kelloggs", imagen: require("@/assets/images/marcas/kelloggs.png") },
  { id: "unilever", nombre: "unilever", imagen: require("@/assets/images/marcas/unilever.png") },
  { id: "mondelez", nombre: "mondelez", imagen: require("@/assets/images/marcas/mondelez.png") },
  { id: "ferrero", nombre: "ferrero", imagen: require("@/assets/images/marcas/ferrero.png") },
  { id: "lactalis", nombre: "lactalis", imagen: require("@/assets/images/marcas/lactalis.png") },
];

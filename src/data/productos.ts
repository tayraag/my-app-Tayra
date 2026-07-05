export type NutriScore = 'A' | 'B' | 'C' | 'D' | 'E' | 'NOT-APPLICABLE' | 'UNKNOWN' | 'N/A';
export type EcoScore = 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'E' | 'F' | 'NOT-APPLICABLE' | 'UNKNOWN' | 'N/A';
export type NovaGroup = 1 | 2 | 3 | 4;

export type Producto = {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  etiquetas: string[];
  nutriScore: NutriScore;
  novaGroup: NovaGroup;
  ecoScore: EcoScore;
  energia: number;       // kJ por 100ml/g
  grasa: number;         // g
  grasaSaturada: number; // g
  carbohidratos: number; // g
  azucares: number;      // g
  fibra: number;         // g
  proteina: number;      // g
  sal: number;           // g
  ingredientes: string;
  alergenos: string;
  imagen: string;
};

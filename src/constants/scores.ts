export const NUTRI_COLORES: Record<string, string> = {
  A: "#2e7d32",
  B: "#8bc34a",
  C: "#fdd835",
  D: "#ff9800",
  E: "#f44336",
};

export const NOVA_COLORES: Record<number, string> = {
  1: "#2e7d32",
  2: "#8bc34a",
  3: "#ff9800",
  4: "#f44336",
};

export const ECO_COLORES: Record<string, string> = {
  "A+": "#1b5e20",
  A: "#2e7d32",
  "B+": "#558b2f",
  B: "#8bc34a",
  C: "#fdd835",
  D: "#ff9800",
  E: "#f44336",
  F: "#b71c1c",
};

export const normalizarEcoScore = (score: string): string => {
  return score.replace("-PLUS", "+").toUpperCase();
};

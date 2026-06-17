export async function getCategoriesV3(query: string = ""): Promise<string[]> {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const baseUrl = `${BASE_URL}/v3/taxonomy_suggestions`;

  const params = new URLSearchParams({
    tagtype: "categories",
    lc: "es",
    string: query,
    limit: "20",
  });

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    headers: {
      "User-Agent": "UNTDF TNT 2026",
    },
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = await response.json();
  return data.suggestions as string[];
}

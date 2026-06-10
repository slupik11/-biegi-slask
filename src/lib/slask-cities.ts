// Główne miasta i miejscowości województwa śląskiego + przyległe powiaty
// Używane do filtrowania wyników z ogólnopolskich platform
export const SLASK_MIASTA = new Set([
  // Górnośląski Okręg Przemysłowy
  "katowice", "gliwice", "zabrze", "bytom", "rybnik", "tychy",
  "dąbrowa górnicza", "chorzów", "sosnowiec", "jaworzno", "siemianowice śląskie",
  "mysłowice", "piekary śląskie", "świętochłowice", "ruda śląska",
  "będzin", "czeladź", "wojkowice", "sławków",
  // Subregion zachodni
  "jastrzębie-zdrój", "żory", "wodzisław śląski", "rybnik", "racibórz",
  "pszów", "radlin", "rybnicki", "czerwionka-leszczyny",
  // Subregion południowy
  "bielsko-biała", "cieszyn", "skoczów", "czechowice-dziedzice",
  "pszczyna", "mikołów", "łaziska górne", "orzesze",
  // Subregion centralny
  "tarnowskie góry", "miasteczko śląskie", "kalety", "radzionków",
  // Subregion północny
  "częstochowa", "myszków", "zawiercie", "poręba", "blachownia",
  // Inne miejscowości śląskie
  "knurów", "lędziny", "imielin", "chełm śląski", "siewierz",
  "koziegłowy", "herby", "kłobuck", "lubliniec", "pyrzowice",
  "pyskowice", "toszek", "rudziniec", "pilchowice", "ornontowice",
  "wyry", "bojszowy", "bestwina", "kozy", "wilkowice", "porąbka",
  "brenna", "istebna", "szczyrk", "wisła", "ustroń",
  "strumień", "pawłowice", "mszana", "godów", "gorzyce",
  "pietrowice wielkie", "krzanowice", "nędza", "kuźnia raciborska",
  "rydułtowy", "lyski", "jejkowice", "świerklany",
  "suszec", "psary", "bobrowniki", "mierzęcice", "woźniki",
  "krupski młyn", "ożarowice", "wielowieś", "zbrosławice",
  "münchenbuchsee", // nie ;)
  // Okolice / powiaty przyległe często uwzględniane
  "olkusz", "oświęcim", "chrzanów", "trzebinia", "libiąż",
  "wadowice", "andrychów", "kęty", "alwernia",
]);

const SLASK_FRAGMENTY = [
  "śląsk", "silesian", "śląski", "śląska", "śląskie",
  "katowic", "gliwic", "zagłęb", "rybnick",
];

export function czyBiegSlask(miasto: string, nazwa?: string): boolean {
  const m = miasto.toLowerCase().trim();
  if (SLASK_MIASTA.has(m)) return true;
  // częściowe dopasowanie dla dłuższych nazw (np. "Ruda Śląska" → "ruda śląska")
  for (const wzorzec of SLASK_FRAGMENTY) {
    if (m.includes(wzorzec)) return true;
    if (nazwa && nazwa.toLowerCase().includes(wzorzec)) return true;
  }
  return false;
}

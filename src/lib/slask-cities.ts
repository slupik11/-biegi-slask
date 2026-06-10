// Główne miasta i miejscowości województwa śląskiego + przyległe powiaty
// Używane do filtrowania wyników z ogólnopolskich platform
export const SLASK_MIASTA = new Set([
  // Górnośląski Okręg Przemysłowy
  "katowice", "gliwice", "zabrze", "bytom", "rybnik", "tychy",
  "dąbrowa górnicza", "chorzów", "sosnowiec", "jaworzno", "siemianowice śląskie",
  "mysłowice", "piekary śląskie", "świętochłowice", "ruda śląska",
  "będzin", "czeladź", "wojkowice", "sławków", "bieruń",
  // Subregion zachodni
  "jastrzębie-zdrój", "żory", "wodzisław śląski", "racibórz",
  "pszów", "radlin", "czerwionka-leszczyny",
  "rydułtowy", "lyski", "jejkowice", "świerklany", "gorzyce", "godów",
  "pietrowice wielkie", "krzanowice", "nędza", "kuźnia raciborska",
  // Subregion południowy — bielski
  "bielsko-biała", "cieszyn", "skoczów", "czechowice-dziedzice",
  "pszczyna", "mikołów", "łaziska górne", "orzesze",
  "brenna", "istebna", "szczyrk", "wisła", "ustroń",
  "strumień", "pawłowice", "mszana",
  "bestwina", "kozy", "wilkowice", "porąbka",
  // Subregion żywiecki (powiat żywiecki należy do woj. śląskiego)
  "żywiec", "łodygowice", "milówka", "rajcza", "węgierska górka",
  "jeleśnia", "ujsoły", "koszarawa", "gilowice", "lipowa",
  "łękawica", "ślemień", "czernichów", "radziechowy-wieprz",
  "śleszowice", "radziechowy",
  // Subregion centralny
  "tarnowskie góry", "miasteczko śląskie", "kalety", "radzionków",
  "pyskowice", "toszek", "rudziniec", "pilchowice", "ornontowice",
  "zbrosławice", "wielowieś", "ożarowice", "krupski młyn",
  // Subregion północny — częstochowski i zawierciański
  "częstochowa", "myszków", "zawiercie", "poręba", "blachownia",
  "koziegłowy", "herby", "kłobuck", "lubliniec",
  "siewierz", "mierzęcice", "psary", "bobrowniki", "woźniki",
  "rędziny", "poraj", "konopiska", "kamienica polska",
  // Inne miejscowości śląskie
  "knurów", "lędziny", "imielin", "chełm śląski",
  "pyrzowice", "wyry", "bojszowy", "suszec",
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

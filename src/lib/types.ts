export type StatusBiegu = "do_akceptacji" | "opublikowany" | "odrzucony";

export type TypBiegu =
  | "uliczny"
  | "przełajowy"
  | "maraton"
  | "półmaraton"
  | "triathlon"
  | "inne";

export type ZrodloBiegu =
  | "maratonypolskie"
  | "dostartu"
  | "datasport"
  | "personalbest"
  | "formularz"
  | "niszowe";

export interface BiegDTO {
  id: number;
  nazwa: string;
  data: string; // ISO string
  miasto: string;
  wojewodztwo: string;
  dystanse: string[]; // sparsowane z JSON
  typ: TypBiegu;
  linkDoZapisow: string | null;
  opis: string | null;
  zrodlo: ZrodloBiegu;
  status: StatusBiegu;
  lat: number | null;
  lng: number | null;
  dataUtworzenia: string;
}

export interface FetchedEvent {
  nazwa: string;
  data: Date;
  miasto: string;
  wojewodztwo?: string;
  dystanse: string[];
  typ: TypBiegu;
  linkDoZapisow?: string;
  opis?: string;
  zewnetrznyId: string;
  zrodlo: ZrodloBiegu;
}

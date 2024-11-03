export interface Turn {
  id: number;
  turnnumber: number;
  challenge?: string;
  description?: string;
  game: number;
  created_at?: string;
}

export interface Option {
  created_at?: string;
  description?: string;
  game?: number;
  id?: never;
  image?: string;
  impactkpi1?: string;
  impactkpi1amount?: number;
  impactkpi2?: string;
  impactkpi2amount?: number;
  impactkpi3?: string;
  impactkpi3amount?: number;
  optionnumber?: number;
  title?: string;
  turn?: number;
}

export interface Team {
  id: number;
  teamname?: string;
  teamlogo?: string;
  email?: string;
  created_at?: string;
}
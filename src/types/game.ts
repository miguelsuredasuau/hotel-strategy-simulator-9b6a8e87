export interface Turn {
  id: number;
  turnnumber: number;
  challenge?: string;
  description?: string;
  game: number;
}

export interface Option {
  id: number;
  title?: string;
  description?: string;
  image?: string;
  optionnumber: number;
  impactkpi1?: string;
  impactkpi1amount?: number;
  impactkpi2?: string;
  impactkpi2amount?: number;
  impactkpi3?: string;
  impactkpi3amount?: number;
  turn?: number;
  game?: number;
}

export interface Team {
  id: number;
  teamname?: string;
  teamlogo?: string;
  email?: string;
  created_at?: string;
}

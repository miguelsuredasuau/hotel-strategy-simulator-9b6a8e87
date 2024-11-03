export interface Turn {
  id: number;
  turnnumber: number;
  challenge?: string;
  description?: string;
  game: number;
  created_at?: string;
  uuid?: string;
  game_uuid?: string;
}

export interface Option {
  id: number;
  created_at?: string;
  description?: string;
  game?: number;
  game_uuid?: string;
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
  turn_uuid?: string;
  uuid: string;
}

export interface Team {
  id: number;
  teamname?: string;
  teamlogo?: string;
  email?: string;
  created_at?: string;
}
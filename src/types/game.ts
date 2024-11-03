export interface Turn {
  uuid: string;
  turnnumber: number;
  challenge?: string;
  description?: string;
  game?: number;
  created_at?: string;
  game_uuid?: string;
}

export interface Option {
  uuid: string;
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
}

export interface Team {
  uuid: string;
  teamname?: string;
  teamlogo?: string;
  email?: string;
  created_at?: string;
}
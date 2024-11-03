export interface Turn {
  uuid: string;
  turnnumber: number;
  challenge?: string;
  description?: string;
  game_uuid?: string;
  created_at?: string;
}

export interface Option {
  uuid: string;
  created_at?: string;
  description?: string;
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
  turn_uuid?: string;
}

export interface Team {
  uuid: string;
  teamname?: string;
  teamlogo?: string;
  email?: string;
  created_at?: string;
}
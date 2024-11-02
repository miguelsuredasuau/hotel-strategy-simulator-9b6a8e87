export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string | null
          id: string
          team_id: number | null
        }
        Insert: {
          created_at?: string | null
          id: string
          team_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          teamlogo: string | null
          teamname: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: number
          teamlogo?: string | null
          teamname?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          teamlogo?: string | null
          teamname?: string | null
        }
        Relationships: []
      }
      Games: {
        Row: {
          id: number
          created_at: string | null
          name: string | null
          status: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          name?: string | null
          status?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          name?: string | null
          status?: string | null
        }
        Relationships: []
      }
      Turns: {
        Row: {
          id: number
          created_at: string | null
          challenge: string | null
          description: string | null
          game: number | null
          turnnumber: number | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          challenge?: string | null
          description?: string | null
          game?: number | null
          turnnumber?: number | null
        }
        Update: {
          id?: number
          created_at?: string | null
          challenge?: string | null
          description?: string | null
          game?: number | null
          turnnumber?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Turns_game_fkey"
            columns: ["game"]
            referencedRelation: "Games"
            referencedColumns: ["id"]
          }
        ]
      }
      Options: {
        Row: {
          id: number
          created_at: string | null
          title: string | null
          description: string | null
          image: string | null
          turn: number | null
          optionnumber: number | null
          impactkpi1: string | null
          impactkpi1amount: number | null
          impactkpi2: string | null
          impactkpi2amount: number | null
          impactkpi3: string | null
          impactkpi3amount: number | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          title?: string | null
          description?: string | null
          image?: string | null
          turn?: number | null
          optionnumber?: number | null
          impactkpi1?: string | null
          impactkpi1amount?: number | null
          impactkpi2?: string | null
          impactkpi2amount?: number | null
          impactkpi3?: string | null
          impactkpi3amount?: number | null
        }
        Update: {
          id?: number
          created_at?: string | null
          title?: string | null
          description?: string | null
          image?: string | null
          turn?: number | null
          optionnumber?: number | null
          impactkpi1?: string | null
          impactkpi1amount?: number | null
          impactkpi2?: string | null
          impactkpi2amount?: number | null
          impactkpi3?: string | null
          impactkpi3amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Options_turn_fkey"
            columns: ["turn"]
            referencedRelation: "Turns"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
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
      Games: {
        Row: {
          created_at: string | null
          description: string | null
          inspirational_image: string | null
          name: string | null
          status: string | null
          uuid: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          inspirational_image?: string | null
          name?: string | null
          status?: string | null
          uuid?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          inspirational_image?: string | null
          name?: string | null
          status?: string | null
          uuid?: string
        }
        Relationships: []
      }
      game_teams: {
        Row: {
          uuid: string
          game_uuid: string
          team_uuid: string
          created_at: string | null
        }
        Insert: {
          uuid?: string
          game_uuid: string
          team_uuid: string
          created_at?: string | null
        }
        Update: {
          uuid?: string
          game_uuid?: string
          team_uuid?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_teams_game_uuid_fkey"
            columns: ["game_uuid"]
            referencedRelation: "Games"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "game_teams_team_uuid_fkey"
            columns: ["team_uuid"]
            referencedRelation: "teams"
            referencedColumns: ["uuid"]
          }
        ]
      }
      Options: {
        Row: {
          created_at: string | null
          description: string | null
          game_uuid: string | null
          image: string | null
          impactkpi1: string | null
          impactkpi1amount: number | null
          impactkpi2: string | null
          impactkpi2amount: number | null
          impactkpi3: string | null
          impactkpi3amount: number | null
          optionnumber: number | null
          title: string | null
          turn_uuid: string | null
          uuid: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          game_uuid?: string | null
          image?: string | null
          impactkpi1?: string | null
          impactkpi1amount?: number | null
          impactkpi2?: string | null
          impactkpi2amount?: number | null
          impactkpi3?: string | null
          impactkpi3amount?: number | null
          optionnumber?: number | null
          title?: string | null
          turn_uuid?: string | null
          uuid?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          game_uuid?: string | null
          image?: string | null
          impactkpi1?: string | null
          impactkpi1amount?: number | null
          impactkpi2?: string | null
          impactkpi2amount?: number | null
          impactkpi3?: string | null
          impactkpi3amount?: number | null
          optionnumber?: number | null
          title?: string | null
          turn_uuid?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "Options_game_uuid_fkey"
            columns: ["game_uuid"]
            referencedRelation: "Games"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "Options_turn_uuid_fkey"
            columns: ["turn_uuid"]
            referencedRelation: "Turns"
            referencedColumns: ["uuid"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          team_uuid: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: string | null
          team_uuid?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          team_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_team_uuid_fkey"
            columns: ["team_uuid"]
            referencedRelation: "teams"
            referencedColumns: ["uuid"]
          }
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          email: string | null
          teamlogo: string | null
          teamname: string | null
          uuid: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          teamlogo?: string | null
          teamname?: string | null
          uuid?: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          teamlogo?: string | null
          teamname?: string | null
          uuid?: string
        }
        Relationships: []
      }
      Turns: {
        Row: {
          challenge: string | null
          created_at: string | null
          description: string | null
          game_uuid: string | null
          turnnumber: number | null
          uuid: string
        }
        Insert: {
          challenge?: string | null
          created_at?: string | null
          description?: string | null
          game_uuid?: string | null
          turnnumber?: number | null
          uuid?: string
        }
        Update: {
          challenge?: string | null
          created_at?: string | null
          description?: string | null
          game_uuid?: string | null
          turnnumber?: number | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "Turns_game_uuid_fkey"
            columns: ["game_uuid"]
            referencedRelation: "Games"
            referencedColumns: ["uuid"]
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
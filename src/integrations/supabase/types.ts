export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      Options: {
        Row: {
          created_at: string | null
          description: string | null
          game_uuid: string | null
          image: string | null
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
          optionnumber?: number | null
          title?: string | null
          turn_uuid?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "Options_game_uuid_fkey"
            columns: ["game_uuid"]
            isOneToOne: false
            referencedRelation: "Games"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "Options_turn_uuid_fkey"
            columns: ["turn_uuid"]
            isOneToOne: false
            referencedRelation: "Turns"
            referencedColumns: ["uuid"]
          },
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
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["uuid"]
          },
        ]
      }
      round_teams: {
        Row: {
          created_at: string | null
          game_uuid: string | null
          team_uuid: string | null
          turn_uuid: string | null
          uuid: string
        }
        Insert: {
          created_at?: string | null
          game_uuid?: string | null
          team_uuid?: string | null
          turn_uuid?: string | null
          uuid?: string
        }
        Update: {
          created_at?: string | null
          game_uuid?: string | null
          team_uuid?: string | null
          turn_uuid?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "round_teams_game_uuid_fkey"
            columns: ["game_uuid"]
            isOneToOne: false
            referencedRelation: "Games"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "round_teams_team_uuid_fkey"
            columns: ["team_uuid"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "round_teams_turn_uuid_fkey"
            columns: ["turn_uuid"]
            isOneToOne: false
            referencedRelation: "Turns"
            referencedColumns: ["uuid"]
          },
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
            isOneToOne: false
            referencedRelation: "Games"
            referencedColumns: ["uuid"]
          },
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

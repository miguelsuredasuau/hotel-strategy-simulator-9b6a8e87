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
      Options: {
        Row: {
          created_at: string
          Description: string | null
          id: number
          Image: string | null
          ImpactKPI1: string | null
          ImpactKPI1Amount: number | null
          ImpactKPI2: string | null
          ImpactKPI2Amount: number | null
          ImpactKPI3: string | null
          ImpactKPI3Amount: number | null
          OptionNumber: number | null
          Title: string | null
          Turn: number | null
        }
        Insert: {
          created_at?: string
          Description?: string | null
          id?: number
          Image?: string | null
          ImpactKPI1?: string | null
          ImpactKPI1Amount?: number | null
          ImpactKPI2?: string | null
          ImpactKPI2Amount?: number | null
          ImpactKPI3?: string | null
          ImpactKPI3Amount?: number | null
          OptionNumber?: number | null
          Title?: string | null
          Turn?: number | null
        }
        Update: {
          created_at?: string
          Description?: string | null
          id?: number
          Image?: string | null
          ImpactKPI1?: string | null
          ImpactKPI1Amount?: number | null
          ImpactKPI2?: string | null
          ImpactKPI2Amount?: number | null
          ImpactKPI3?: string | null
          ImpactKPI3Amount?: number | null
          OptionNumber?: number | null
          Title?: string | null
          Turn?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Options_Turn_fkey"
            columns: ["Turn"]
            isOneToOne: false
            referencedRelation: "Turns"
            referencedColumns: ["id"]
          },
        ]
      }
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
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
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
          id?: never
          teamlogo?: string | null
          teamname?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: never
          teamlogo?: string | null
          teamname?: string | null
        }
        Relationships: []
      }
      Teams: {
        Row: {
          created_at: string
          email: string | null
          id: number
          teamlogo: string | null
          teamname: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          teamlogo?: string | null
          teamname?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          teamlogo?: string | null
          teamname?: string | null
        }
        Relationships: []
      }
      Turns: {
        Row: {
          Challenge: string | null
          created_at: string
          Description: string | null
          id: number
        }
        Insert: {
          Challenge?: string | null
          created_at?: string
          Description?: string | null
          id?: number
        }
        Update: {
          Challenge?: string | null
          created_at?: string
          Description?: string | null
          id?: number
        }
        Relationships: []
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

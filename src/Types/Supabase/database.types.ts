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
      exames: {
        Row: {
          criado_em: string
          id: number
          nome: string
          unidade: string | null
        }
        Insert: {
          criado_em?: string
          id?: number
          nome: string
          unidade?: string | null
        }
        Update: {
          criado_em?: string
          id?: number
          nome?: string
          unidade?: string | null
        }
        Relationships: []
      }
      pacientes: {
        Row: {
          atualizado_em: string
          criado_em: string
          data_nascimento: string
          id: number
          nome: string
          profile_id: string
          sexo: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          data_nascimento: string
          id?: number
          nome: string
          profile_id: string
          sexo: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          data_nascimento?: string
          id?: number
          nome?: string
          profile_id?: string
          sexo?: string
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_admin: boolean
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          is_admin?: boolean
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean
        }
        Relationships: []
      }
      resultados_exames: {
        Row: {
          exame_id: number
          id: number
          resultado: string
          sexo: string
          valor: string
        }
        Insert: {
          exame_id: number
          id?: number
          resultado: string
          sexo: string
          valor: string
        }
        Update: {
          exame_id?: number
          id?: number
          resultado?: string
          sexo?: string
          valor?: string
        }
        Relationships: [
          {
            foreignKeyName: "resultados_exames_exame_id_fkey"
            columns: ["exame_id"]
            isOneToOne: false
            referencedRelation: "exames"
            referencedColumns: ["id"]
          },
        ]
      }
      resultados_pacientes: {
        Row: {
          criado_em: string
          data_exame: string
          exame_id: number
          id: number
          paciente_id: number
          resultado: number
        }
        Insert: {
          criado_em?: string
          data_exame: string
          exame_id: number
          id?: number
          paciente_id: number
          resultado: number
        }
        Update: {
          criado_em?: string
          data_exame?: string
          exame_id?: number
          id?: number
          paciente_id?: number
          resultado?: number
        }
        Relationships: [
          {
            foreignKeyName: "resultados_pacientes_exame_id_fkey"
            columns: ["exame_id"]
            isOneToOne: false
            referencedRelation: "exames"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resultados_pacientes_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

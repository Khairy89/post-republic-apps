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
      country_zones: {
        Row: {
          country_code: string
          country_name: string
          created_at: string
          id: string
          zone_number: number
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string
          id?: string
          zone_number: number
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string
          id?: string
          zone_number?: number
        }
        Relationships: []
      }
      fuel_surcharge_rates: {
        Row: {
          created_at: string
          effective_date: string
          id: string
          rate_percentage: number
        }
        Insert: {
          created_at?: string
          effective_date?: string
          id?: string
          rate_percentage?: number
        }
        Update: {
          created_at?: string
          effective_date?: string
          id?: string
          rate_percentage?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      shipping_orders: {
        Row: {
          actual_weight: number
          address: string
          base_price: number
          chargeable_weight: number
          city: string
          country: string
          created_at: string
          fuel_surcharge: number
          handling_fee: number
          height: number
          id: string
          length: number
          phone: string
          recipient_name: string
          repacking: boolean | null
          repacking_fee: number | null
          state: string
          status: string | null
          total_price: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
          volumetric_weight: number
          weight: number
          width: number
          zip: string
          zone_number: number | null
        }
        Insert: {
          actual_weight: number
          address: string
          base_price: number
          chargeable_weight: number
          city: string
          country: string
          created_at?: string
          fuel_surcharge: number
          handling_fee: number
          height: number
          id?: string
          length: number
          phone: string
          recipient_name: string
          repacking?: boolean | null
          repacking_fee?: number | null
          state: string
          status?: string | null
          total_price: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
          volumetric_weight: number
          weight: number
          width: number
          zip: string
          zone_number?: number | null
        }
        Update: {
          actual_weight?: number
          address?: string
          base_price?: number
          chargeable_weight?: number
          city?: string
          country?: string
          created_at?: string
          fuel_surcharge?: number
          handling_fee?: number
          height?: number
          id?: string
          length?: number
          phone?: string
          recipient_name?: string
          repacking?: boolean | null
          repacking_fee?: number | null
          state?: string
          status?: string | null
          total_price?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
          volumetric_weight?: number
          weight?: number
          width?: number
          zip?: string
          zone_number?: number | null
        }
        Relationships: []
      }
      zone_weight_rates: {
        Row: {
          created_at: string
          id: string
          weight_kg: number
          zone_1: number | null
          zone_2: number | null
          zone_3: number | null
          zone_4: number | null
          zone_5: number | null
          zone_6: number | null
          zone_7: number | null
          zone_8: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          weight_kg: number
          zone_1?: number | null
          zone_2?: number | null
          zone_3?: number | null
          zone_4?: number | null
          zone_5?: number | null
          zone_6?: number | null
          zone_7?: number | null
          zone_8?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          weight_kg?: number
          zone_1?: number | null
          zone_2?: number | null
          zone_3?: number | null
          zone_4?: number | null
          zone_5?: number | null
          zone_6?: number | null
          zone_7?: number | null
          zone_8?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_shipping_rate: {
        Args: { target_weight: number; target_zone: number }
        Returns: number
      }
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

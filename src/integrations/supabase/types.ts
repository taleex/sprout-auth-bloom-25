export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_type: string | null
          balance: number
          color: string | null
          created_at: string | null
          currency: string
          hide_balance: boolean
          icon: string | null
          id: string
          is_archived: boolean
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_type?: string | null
          balance?: number
          color?: string | null
          created_at?: string | null
          currency?: string
          hide_balance?: boolean
          icon?: string | null
          id?: string
          is_archived?: boolean
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_type?: string | null
          balance?: number
          color?: string | null
          created_at?: string | null
          currency?: string
          hide_balance?: boolean
          icon?: string | null
          id?: string
          is_archived?: boolean
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      allocations: {
        Row: {
          asset_id: string
          created_at: string
          id: string
          initial_price: number
          invested_amount: number | null
          investment_account_id: string
          investment_start_date: string
          is_active: boolean
          percentage: number
          purchase_price: number | null
          sold_date: string | null
          sold_price: number | null
          updated_at: string
        }
        Insert: {
          asset_id: string
          created_at?: string
          id?: string
          initial_price?: number
          invested_amount?: number | null
          investment_account_id: string
          investment_start_date: string
          is_active?: boolean
          percentage: number
          purchase_price?: number | null
          sold_date?: string | null
          sold_price?: number | null
          updated_at?: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          id?: string
          initial_price?: number
          invested_amount?: number | null
          investment_account_id?: string
          investment_start_date?: string
          is_active?: boolean
          percentage?: number
          purchase_price?: number | null
          sold_date?: string | null
          sold_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "allocations_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allocations_investment_account_id_fkey"
            columns: ["investment_account_id"]
            isOneToOne: false
            referencedRelation: "investment_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          asset_type: string
          created_at: string
          current_price: number
          id: string
          last_price_fetch: string | null
          market_cap: number | null
          name: string
          price_change_24h: number | null
          price_updated_at: string
          symbol: string
          update_frequency: string
          volume_24h: number | null
        }
        Insert: {
          asset_type?: string
          created_at?: string
          current_price?: number
          id?: string
          last_price_fetch?: string | null
          market_cap?: number | null
          name: string
          price_change_24h?: number | null
          price_updated_at?: string
          symbol: string
          update_frequency?: string
          volume_24h?: number | null
        }
        Update: {
          asset_type?: string
          created_at?: string
          current_price?: number
          id?: string
          last_price_fetch?: string | null
          market_cap?: number | null
          name?: string
          price_change_24h?: number | null
          price_updated_at?: string
          symbol?: string
          update_frequency?: string
          volume_24h?: number | null
        }
        Relationships: []
      }
      bills: {
        Row: {
          account_id: string | null
          amount: number
          category_id: string | null
          color: string | null
          created_at: string
          id: string
          include_in_forecast: boolean
          is_active: boolean
          name: string
          notes: string | null
          repeat_interval: number | null
          repeat_pattern: string
          specific_dates: number[] | null
          specific_day: number | null
          start_date: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          category_id?: string | null
          color?: string | null
          created_at?: string
          id?: string
          include_in_forecast?: boolean
          is_active?: boolean
          name: string
          notes?: string | null
          repeat_interval?: number | null
          repeat_pattern: string
          specific_dates?: number[] | null
          specific_day?: number | null
          start_date?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          category_id?: string | null
          color?: string | null
          created_at?: string
          id?: string
          include_in_forecast?: boolean
          is_active?: boolean
          name?: string
          notes?: string | null
          repeat_interval?: number | null
          repeat_pattern?: string
          specific_dates?: number[] | null
          specific_day?: number | null
          start_date?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
          type: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          type: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      deposits: {
        Row: {
          amount: number
          created_at: string
          deposit_date: string
          id: string
          investment_account_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          deposit_date?: string
          id?: string
          investment_account_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          deposit_date?: string
          id?: string
          investment_account_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deposits_investment_account_id_fkey"
            columns: ["investment_account_id"]
            isOneToOne: false
            referencedRelation: "investment_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_accounts: {
        Row: {
          created_at: string
          id: string
          name: string
          total_deposits: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          total_deposits?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          total_deposits?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          asset_id: string
          id: string
          market_cap: number | null
          price: number
          recorded_at: string
          source: string | null
          volume_24h: number | null
        }
        Insert: {
          asset_id: string
          id?: string
          market_cap?: number | null
          price: number
          recorded_at?: string
          source?: string | null
          volume_24h?: number | null
        }
        Update: {
          asset_id?: string
          id?: string
          market_cap?: number | null
          price?: number
          recorded_at?: string
          source?: string | null
          volume_24h?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          account_id: string
          created_at: string
          id: string
          target_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          created_at?: string
          id?: string
          target_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          created_at?: string
          id?: string
          target_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "savings_goals_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      transaction_tags: {
        Row: {
          tag_id: string
          transaction_id: string
        }
        Insert: {
          tag_id: string
          transaction_id: string
        }
        Update: {
          tag_id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_tags_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          category_id: string | null
          created_at: string
          date: string
          description: string | null
          destination_account_id: string | null
          id: string
          notes: string | null
          photo_url: string | null
          source_account_id: string | null
          transaction_type: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          category_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          destination_account_id?: string | null
          id?: string
          notes?: string | null
          photo_url?: string | null
          source_account_id?: string | null
          transaction_type?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          category_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          destination_account_id?: string | null
          id?: string
          notes?: string | null
          photo_url?: string | null
          source_account_id?: string | null
          transaction_type?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_destination_account_id_fkey"
            columns: ["destination_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_source_account_id_fkey"
            columns: ["source_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      transfers: {
        Row: {
          amount: number
          created_at: string
          destination_account_id: string
          id: string
          notes: string | null
          source_account_id: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          destination_account_id: string
          id?: string
          notes?: string | null
          source_account_id: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          destination_account_id?: string
          id?: string
          notes?: string | null
          source_account_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transfers_destination_account_id_fkey"
            columns: ["destination_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_source_account_id_fkey"
            columns: ["source_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_api_keys: {
        Row: {
          api_key_encrypted: string
          created_at: string
          id: string
          is_active: boolean
          service_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key_encrypted: string
          created_at?: string
          id?: string
          is_active?: boolean
          service_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key_encrypted?: string
          created_at?: string
          id?: string
          is_active?: boolean
          service_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          monthly_checkup_enabled: boolean
          monthly_checkup_method: string
          recurring_transactions_enabled: boolean
          recurring_transactions_method: string
          theme_preference: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          monthly_checkup_enabled?: boolean
          monthly_checkup_method?: string
          recurring_transactions_enabled?: boolean
          recurring_transactions_method?: string
          theme_preference?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          monthly_checkup_enabled?: boolean
          monthly_checkup_method?: string
          recurring_transactions_enabled?: boolean
          recurring_transactions_method?: string
          theme_preference?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrypt_api_key: {
        Args: { encrypted_key: string }
        Returns: string
      }
      encrypt_api_key: {
        Args: { api_key: string }
        Returns: string
      }
      update_account_balance: {
        Args: { account_id: string; amount_change: number }
        Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

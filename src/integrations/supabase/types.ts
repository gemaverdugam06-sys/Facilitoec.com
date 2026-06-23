export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      categorias: {
        Row: {
          icono: string;
          id: string;
          nombre: string;
          orden: number;
        };
        Insert: {
          icono: string;
          id: string;
          nombre: string;
          orden?: number;
        };
        Update: {
          icono?: string;
          id?: string;
          nombre?: string;
          orden?: number;
        };
        Relationships: [];
      };
      chats: {
        Row: {
          comprador_id: string;
          created_at: string;
          id: string;
          producto_id: string;
          ultimo_leido_comprador: string | null;
          ultimo_leido_vendedor: string | null;
          updated_at: string;
          vendedor_id: string;
        };
        Insert: {
          comprador_id: string;
          created_at?: string;
          id?: string;
          producto_id: string;
          ultimo_leido_comprador?: string | null;
          ultimo_leido_vendedor?: string | null;
          updated_at?: string;
          vendedor_id: string;
        };
        Update: {
          comprador_id?: string;
          created_at?: string;
          id?: string;
          producto_id?: string;
          ultimo_leido_comprador?: string | null;
          ultimo_leido_vendedor?: string | null;
          updated_at?: string;
          vendedor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chats_comprador_profile_fk";
            columns: ["comprador_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chats_producto_id_fkey";
            columns: ["producto_id"];
            isOneToOne: false;
            referencedRelation: "productos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chats_vendedor_profile_fk";
            columns: ["vendedor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      mensajes: {
        Row: {
          chat_id: string;
          contenido: string;
          created_at: string;
          id: string;
          remitente_id: string;
        };
        Insert: {
          chat_id: string;
          contenido: string;
          created_at?: string;
          id?: string;
          remitente_id: string;
        };
        Update: {
          chat_id?: string;
          contenido?: string;
          created_at?: string;
          id?: string;
          remitente_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mensajes_chat_id_fkey";
            columns: ["chat_id"];
            isOneToOne: false;
            referencedRelation: "chats";
            referencedColumns: ["id"];
          },
        ];
      };
      productos: {
        Row: {
          activo: boolean;
          categoria_id: string;
          ciudad: string;
          created_at: string;
          descripcion: string;
          es_destacado: boolean;
          estado: string;
          id: string;
          imagenes: string[];
          moneda: string;
          precio: number;
          promocionado_hasta: string | null;
          tipo_promocion: string;
          titulo: string;
          updated_at: string;
          user_id: string;
          whatsapp: string | null;
        };
        Insert: {
          activo?: boolean;
          categoria_id: string;
          ciudad: string;
          created_at?: string;
          descripcion: string;
          es_destacado?: boolean;
          estado?: string;
          id?: string;
          imagenes?: string[];
          moneda?: string;
          precio?: number;
          promocionado_hasta?: string | null;
          tipo_promocion?: string;
          titulo: string;
          updated_at?: string;
          user_id: string;
          whatsapp?: string | null;
        };
        Update: {
          activo?: boolean;
          categoria_id?: string;
          ciudad?: string;
          created_at?: string;
          descripcion?: string;
          es_destacado?: boolean;
          estado?: string;
          id?: string;
          imagenes?: string[];
          moneda?: string;
          precio?: number;
          promocionado_hasta?: string | null;
          tipo_promocion?: string;
          titulo?: string;
          updated_at?: string;
          user_id?: string;
          whatsapp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "productos_categoria_id_fkey";
            columns: ["categoria_id"];
            isOneToOne: false;
            referencedRelation: "categorias";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "productos_user_profile_fk";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          ciudad: string | null;
          created_at: string;
          id: string;
          nombre_completo: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          ciudad?: string | null;
          created_at?: string;
          id: string;
          nombre_completo?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          ciudad?: string | null;
          created_at?: string;
          id?: string;
          nombre_completo?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles_private: {
        Row: {
          created_at: string;
          id: string;
          telefono: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          telefono?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          telefono?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      transacciones: {
        Row: {
          comprobante_url: string | null;
          created_at: string;
          estado_pago: string;
          id: string;
          monto: number;
          notas_admin: string | null;
          pasarela: string;
          plan: string;
          producto_id: string;
          referencia: string | null;
          user_id: string;
        };
        Insert: {
          comprobante_url?: string | null;
          created_at?: string;
          estado_pago?: string;
          id?: string;
          monto: number;
          notas_admin?: string | null;
          pasarela?: string;
          plan: string;
          producto_id: string;
          referencia?: string | null;
          user_id: string;
        };
        Update: {
          comprobante_url?: string | null;
          created_at?: string;
          estado_pago?: string;
          id?: string;
          monto?: number;
          notas_admin?: string | null;
          pasarela?: string;
          plan?: string;
          producto_id?: string;
          referencia?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transacciones_producto_id_fkey";
            columns: ["producto_id"];
            isOneToOne: false;
            referencedRelation: "productos";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      expire_promociones: { Args: never; Returns: undefined };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_admin_email: { Args: { _email: string }; Returns: boolean };
      is_chat_participant: { Args: { _chat_id: string }; Returns: boolean };
    };
    Enums: {
      app_role: "admin" | "moderator" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const;

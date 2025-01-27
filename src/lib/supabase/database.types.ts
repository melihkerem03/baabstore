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
      announcements: {
        Row: {
          id: string
          text: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          text: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          text?: string
          is_active?: boolean
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image: string
          stock: number
          category: string
          subcategory: string
          created_at: string
          updated_at: string
          order: number
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          image: string
          stock: number
          category: string
          subcategory: string
          created_at?: string
          updated_at?: string
          order?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          image?: string
          stock?: number
          category?: string
          subcategory?: string
          updated_at?: string
          order?: number
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          subcategories: string[]
          created_at: string
          updated_at: string
          order: number
        }
        Insert: {
          id?: string
          name: string
          subcategories: string[]
          created_at?: string
          updated_at?: string
          order?: number
        }
        Update: {
          id?: string
          name?: string
          subcategories?: string[]
          updated_at?: string
          order?: number
        }
      }
      home_sections: {
        Row: {
          id: string
          title: string
          subtitle: string
          image: string
          category: string
          button_text: string
          target_subcategory: string
          created_at: string
          updated_at: string
          order: number
        }
        Insert: {
          id?: string
          title: string
          subtitle: string
          image: string
          category: string
          button_text?: string
          target_subcategory: string
          created_at?: string
          updated_at?: string
          order?: number
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string
          image?: string
          category?: string
          button_text?: string
          target_subcategory?: string
          updated_at?: string
          order?: number
        }
        Relationships: [
          {
            foreignKeyName: "home_sections_category_fkey"
            columns: ["category"]
            referencedRelation: "categories"
            referencedColumns: ["name"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          is_admin?: boolean
          updated_at?: string
        }
      }
    }
  }
}
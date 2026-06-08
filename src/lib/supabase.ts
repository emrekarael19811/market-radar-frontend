import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  category: string
  barcode: string
  prices: {
    migros?: number
    sok?: number
    a101?: number
    carrefoursa?: number
  }
}

export type Campaign = {
  id: string
  market: string
  name: string
  brand: string | null
  category: string | null
  old_price: number | null
  price: number
  discount_percent: number | null
  image_url: string | null
  product_url: string | null
  catalog_label: string | null
  catalog_date: string | null
  period: 'current' | 'upcoming'
  scraped_at: string
}

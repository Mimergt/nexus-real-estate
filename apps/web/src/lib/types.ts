export const DEMO_AGENCY_ID = '11111111-1111-4111-8111-111111111111'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8787'

export type Property = {
  id: string
  title: string
  address: string
  city: string
  zone: string
  status: string
  currency: string
  price: number
  featured: boolean
  published: boolean
}

export type PropertyOfferType = 'venta' | 'renta' | 'ambos'
export type CurrencyCode = 'USD' | 'GTQ'

export type NewPropertyDraft = {
  title: string
  description: string
  tags: string[]
  offerType: PropertyOfferType
  salePriceUsd: number | null
  salePriceGtq: number | null
  rentPriceUsd: number | null
  rentPriceGtq: number | null
  department: string
  municipality: string
  addressLine: string
  googleMapsUrl: string
  latitude: string
  longitude: string
  amenities: string[]
  mediaUrls: string[]
  customFormEnabled: boolean
  customFormHtml: string
}

export type DashboardMetrics = {
  total_properties: number
  active_properties: number
  featured_properties: number
  published_properties: number
  portfolio_value: number
  recent_properties_30d: number
}

export type AgencySettings = {
  id: string | null
  primary_color: string | null
  secondary_color: string | null
  layout_style: string | null
}

export type Agency = {
  id: string
  name: string
  location: string
  status: 'active' | 'inactive'
  totalProperties: number
  isDemo?: boolean
}

export const defaultMetrics: DashboardMetrics = {
  total_properties: 0,
  active_properties: 0,
  featured_properties: 0,
  published_properties: 0,
  portfolio_value: 0,
  recent_properties_30d: 0,
}

export const agenciesSeed: Agency[] = [
  {
    id: DEMO_AGENCY_ID,
    name: 'Epic Real Estate Demo',
    location: 'Guatemala, GT',
    status: 'active',
    totalProperties: 1,
    isDemo: true,
  },
  {
    id: '2',
    name: 'Aura Realty Partners',
    location: 'Miami, FL',
    status: 'active',
    totalProperties: 892,
  },
  {
    id: '3',
    name: 'Lumina Group',
    location: 'Chicago, IL',
    status: 'inactive',
    totalProperties: 0,
  },
  {
    id: '4',
    name: 'Opus International',
    location: 'London, UK',
    status: 'active',
    totalProperties: 3410,
  },
]

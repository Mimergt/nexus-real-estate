import type { Property } from './types'

export type TemplatePropertyType = 'villa' | 'penthouse' | 'mansion'

export type TemplateProperty = {
  id: string
  slug: string
  title: string
  zone: string
  city: string
  price: number
  currency: 'USD' | 'GTQ'
  type: TemplatePropertyType
  beds: number
  baths: string
  area: string
  parking: number
  yearBuilt: number
  forSale: boolean
  forRent: boolean
  pricing: {
    saleUsd?: number
    saleGtq?: number
    rentUsd?: number
    rentGtq?: number
  }
  description: string
  photos: string[]
}

export const slugifyTemplateProperty = (value: string) => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const galleryPool = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDMFSwjoK4AEoZL-_B8FL7iYkQbNa0r92Ut_4L_Xp7AAXN9SqE9vcEVe7NfHWJkRJGlMr76UxZELyUlRyiDWwZz18Y_PzMurq-8M594oCLkCNkzWaVnsKWMCE_SD059reqHAOKbo4tsQKZHhOKUz6UvCUDBuWrdMISVkMpOlHnCy62ZIvT-rM-C2vfmbZuIIdU3xJ9SuBjnTDyWA9bK49LebrKo1KJNdmwP5km35d3OhZ5BsYdABa5JWnxWIrFd_V9ACSIVEs90hg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAaRjSG8KosGKzOczXTDkXul68kYUIROK6varXYdF9qProuj-FlMTgIj0BOroq2Y7X3jVjCwiWzZNbcrMKnwf9U1h3FxAKLR3lRRS80k8I2uiFg2QZ7PCT2bBCGvB-85GmnNz62uOE39ZmfKqDmN-GwSSeNO6ntKQbCRUhP8BhOOCH6FSoPXXLHYj6pf28h_bohF6XqCLtYSl5E-dXSa-XPERaTOhnE59rxKvT5OXDnpb-VVhnFDn7EwggYAPx4Tq4Qu5AR9U6M0A',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC0VFv5kUVfdVSRGAA30lk1ZH4b4rr4u-RpCHqOrFK3J1NaZf-znBmJmzE8ZPJwswU_iS3IAVnZMXMTpH3hEESPbdYzkC1neRWs_SjgO1crrJjJQ04zokNxx9UWshBP7IwwFvRittuHa-OuXNUBqmEwNeihshrB-4nH-UvbYH0uTnIiTU6R1j3-bk199I94I3luBFm0gA8XSOUXV0UeUxolzATKz8t0yVnBYkI4G6awZYtpbUtrErRFYn14XLZqjN_PCXAxZMKqtQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB0blybQTFg2VJvO7MG2tOdanB5COESPvP1y50OhzEUbq0WwtYErmChz94Jgt6EjwtqqUN1Sznu-7q8X-ybSNY_WChuluFLCYxAtOKPi0J8AYNkh5da6FvU7Tw9O6euk0mYLc8_XwrTZYVzhvbPQzFRPPJx-Rdo4SfLwjaix_HbHXRdyhemksdvCmMNG0gXu5kKDOKvZLMOLd0By4AgZUHWednNWMwvzMUZWzcRIk_8-Tcxc10yvpcCPVynHWf3NIMxG8ynpm56eQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDG86mUsgxOUtu19Ro2C-kfCwG2mJ4cgbvKdfk0tOXYfrcUmAlxrP47PAEHbxCUZGb8ht7dpQmnu7Y9V-f3S5tEKcBUcQBRLmCWX6awbK63Gozs7cOCEeuon63JqzQiGU3zIm2qMTY2DGrkPzUENigTEIAz8CghF06dO8atPkuEHSIuC_4VJSHraIDdrxmPv43mkrfuIkN9ru1t2-j8SdV-07DZay6zsVWveaDITV5vDFMxNzKwq7xCSQKrVbyiTsF0I2wbTt1ZfQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAcjEBTulGJABC-y3jJphfexdI3NitqWYP-MZN0Y9Z0nF5LFASQlogsMXwQWRQP4qST1rpnXhqkZVFtl2odIKrePC9q5r4_mDYIcSgsodlzJPlu0jGO01DMK-hfUzZKaygzvAUAv80ox6Ng0ppHMqJbzCNErfm9hNLFDPN796MbGcUnpIU9njS9AWTbWTH0smuxes3XdwXye3GCdbv4i8Okn46I-u2aIXdcCxeQ62VTJBdiiuoeHop2rfPugO4E2nZqIAO_B0a1xw',
]

const templateSeedPropertiesBase = [
  { id: 't1-001', title: 'Villa Horizonte', zone: 'Golden Mile', city: 'Marbella', price: 8500000, currency: 'USD', type: 'villa', beds: 5, baths: '6', area: '850m2', parking: 4, yearBuilt: 2021 },
  { id: 't1-002', title: 'Sky Penthouse', zone: 'Salamanca', city: 'Madrid', price: 12250000, currency: 'USD', type: 'penthouse', beds: 4, baths: '4.5', area: '420m2', parking: 3, yearBuilt: 2020 },
  { id: 't1-003', title: 'Finca La Esmeralda', zone: 'Son Vida', city: 'Mallorca', price: 15000000, currency: 'USD', type: 'mansion', beds: 8, baths: '10', area: '1200m2', parking: 8, yearBuilt: 2019 },
  { id: 't1-004', title: 'Casa Aura', zone: 'Talamanca', city: 'Ibiza', price: 5400000, currency: 'USD', type: 'villa', beds: 4, baths: '4', area: '380m2', parking: 2, yearBuilt: 2022 },
  { id: 't1-005', title: 'Villa Serenity', zone: 'Pedralbes', city: 'Barcelona', price: 3200000, currency: 'USD', type: 'villa', beds: 5, baths: '3.5', area: '450m2', parking: 2, yearBuilt: 2018 },
  { id: 't1-006', title: 'Penthouse Mirador', zone: 'Costa del Este', city: 'Panama', price: 2750000, currency: 'USD', type: 'penthouse', beds: 3, baths: '3', area: '290m2', parking: 2, yearBuilt: 2020 },
  { id: 't1-007', title: 'Casa de Lago Armonia', zone: 'Zona 16', city: 'Ciudad de Guatemala', price: 9200000, currency: 'GTQ', type: 'mansion', beds: 6, baths: '6', area: '940m2', parking: 5, yearBuilt: 2021 },
  { id: 't1-008', title: 'Residencia Bel Air', zone: 'Bel Air', city: 'Los Angeles', price: 18750000, currency: 'USD', type: 'mansion', beds: 7, baths: '8', area: '1500m2', parking: 6, yearBuilt: 2017 },
  { id: 't1-009', title: 'Penthouse Atria', zone: 'Puerto Madero', city: 'Buenos Aires', price: 4800000, currency: 'USD', type: 'penthouse', beds: 4, baths: '4', area: '360m2', parking: 2, yearBuilt: 2019 },
  { id: 't1-010', title: 'Villa Nacar', zone: 'Punta Cana Village', city: 'Punta Cana', price: 3650000, currency: 'USD', type: 'villa', beds: 4, baths: '4.5', area: '470m2', parking: 3, yearBuilt: 2022 },
  { id: 't1-011', title: 'Casa Bosque Alto', zone: 'Carretera a El Salvador', city: 'Ciudad de Guatemala', price: 6400000, currency: 'GTQ', type: 'villa', beds: 5, baths: '5', area: '610m2', parking: 4, yearBuilt: 2020 },
  { id: 't1-012', title: 'Mansion Monte Azul', zone: 'Escazu', city: 'San Jose', price: 6950000, currency: 'USD', type: 'mansion', beds: 6, baths: '7', area: '980m2', parking: 5, yearBuilt: 2018 },
  { id: 't1-013', title: 'Penthouse Obsidian', zone: 'Polanco', city: 'CDMX', price: 5600000, currency: 'USD', type: 'penthouse', beds: 4, baths: '4', area: '410m2', parking: 3, yearBuilt: 2021 },
  { id: 't1-014', title: 'Villa Olas', zone: 'Costa Verde', city: 'Lima', price: 3350000, currency: 'USD', type: 'villa', beds: 4, baths: '3.5', area: '430m2', parking: 2, yearBuilt: 2019 },
  { id: 't1-015', title: 'Mansion Royal Cedar', zone: 'Brickell', city: 'Miami', price: 21400000, currency: 'USD', type: 'mansion', beds: 9, baths: '11', area: '1800m2', parking: 8, yearBuilt: 2016 },
] as const

const seedDescriptions = [
  'Propiedad premium con acabados de autor, amplios ambientes y vistas panoramicas privilegiadas.',
  'Distribucion moderna con luz natural, terraza social y amenities de alto nivel para estilo de vida urbano.',
  'Disenada para privacidad y confort, integra arquitectura contemporanea con espacios verdes exclusivos.',
  'Una residencia lista para habitar, con tecnologia domotica, cocina de lujo y excelentes conexiones de acceso.',
]

const buildGalleryForIndex = (index: number) => {
  return Array.from({ length: 6 }, (_, offset) => galleryPool[(index + offset) % galleryPool.length])
}

const roundPrice = (value: number) => Math.round(value / 100) * 100

const toUsd = (amount: number, currency: 'USD' | 'GTQ') => (currency === 'USD' ? amount : amount / 7.8)
const toGtq = (amount: number, currency: 'USD' | 'GTQ') => (currency === 'GTQ' ? amount : amount * 7.8)

export const templateSeedProperties: TemplateProperty[] = templateSeedPropertiesBase.map((property, index) => {
  const saleUsd = roundPrice(toUsd(property.price, property.currency))
  const saleGtq = roundPrice(toGtq(property.price, property.currency))
  const forSale = index % 7 !== 0
  const forRent = index % 4 !== 1

  return {
    ...property,
    slug: slugifyTemplateProperty(property.title),
    forSale,
    forRent,
    pricing: {
      saleUsd: forSale ? saleUsd : undefined,
      saleGtq: forSale ? saleGtq : undefined,
      rentUsd: forRent ? roundPrice(saleUsd * 0.006) : undefined,
      rentGtq: forRent ? roundPrice(saleGtq * 0.006) : undefined,
    },
    description: seedDescriptions[index % seedDescriptions.length],
    photos: buildGalleryForIndex(index),
  }
})

export const normalizeTemplateCurrency = (currency: string): 'USD' | 'GTQ' => (currency === 'GTQ' ? 'GTQ' : 'USD')

export const buildTemplate1Catalog = (apiProperties: Property[]): TemplateProperty[] => {
  const fromApi = apiProperties.slice(0, 15).map((property, index) => {
    const seed = templateSeedProperties[index % templateSeedProperties.length]
    const slug = slugifyTemplateProperty(property.title)
    const saleUsd = roundPrice(toUsd(property.price, normalizeTemplateCurrency(property.currency)))
    const saleGtq = roundPrice(toGtq(property.price, normalizeTemplateCurrency(property.currency)))

    return {
      ...seed,
      id: property.id,
      slug: slug || seed.slug,
      title: property.title,
      zone: property.zone,
      city: property.city,
      price: property.price,
      currency: normalizeTemplateCurrency(property.currency),
      pricing: {
        saleUsd: seed.forSale ? saleUsd : undefined,
        saleGtq: seed.forSale ? saleGtq : undefined,
        rentUsd: seed.forRent ? roundPrice(saleUsd * 0.006) : undefined,
        rentGtq: seed.forRent ? roundPrice(saleGtq * 0.006) : undefined,
      },
    }
  })

  if (fromApi.length >= 15) {
    return fromApi
  }

  const usedIds = new Set(fromApi.map((item) => item.id))
  const filler = templateSeedProperties.filter((item) => !usedIds.has(item.id)).slice(0, 15 - fromApi.length)

  return [...fromApi, ...filler]
}

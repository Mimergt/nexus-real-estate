import { z } from 'zod'

export const roleSchema = z.enum(['admin', 'agency_user'])
export const listingTypeSchema = z.enum(['venta', 'renta'])

export type Role = z.infer<typeof roleSchema>
export type ListingType = z.infer<typeof listingTypeSchema>

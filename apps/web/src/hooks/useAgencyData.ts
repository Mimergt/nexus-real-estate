import { useEffect, useMemo, useState } from 'react'
import { API_BASE_URL, defaultMetrics, DEMO_AGENCY_ID, type AgencySettings, type DashboardMetrics, type Property } from '../lib/types'

export function useAgencyData() {
  const [agencyQuery, setAgencyQuery] = useState('')
  const [properties, setProperties] = useState<Property[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const [dashboardRes, propertiesRes, settingsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/v1/agency/dashboard`, {
            headers: { 'x-agency-id': DEMO_AGENCY_ID },
          }),
          fetch(`${API_BASE_URL}/v1/properties`, {
            headers: { 'x-agency-id': DEMO_AGENCY_ID },
          }),
          fetch(`${API_BASE_URL}/v1/agency/settings`, {
            headers: { 'x-agency-id': DEMO_AGENCY_ID },
          }),
        ])

        if (!dashboardRes.ok || !propertiesRes.ok || !settingsRes.ok) {
          throw new Error('No se pudo cargar el dashboard de agencia.')
        }

        const dashboardJson = (await dashboardRes.json()) as { item?: DashboardMetrics }
        const propertiesJson = (await propertiesRes.json()) as { items?: Property[] }
        await settingsRes.json() as { item?: AgencySettings }

        setMetrics(dashboardJson.item ?? defaultMetrics)
        setProperties(propertiesJson.items ?? [])
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Error cargando datos de agencia.')
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [])

  const filteredProperties = useMemo(() => {
    const normalized = agencyQuery.trim().toLowerCase()

    if (!normalized) {
      return properties
    }

    return properties.filter((property) => {
      return (
        property.title.toLowerCase().includes(normalized) ||
        property.city.toLowerCase().includes(normalized) ||
        property.zone.toLowerCase().includes(normalized) ||
        property.status.toLowerCase().includes(normalized)
      )
    })
  }, [properties, agencyQuery])

  const visibleProperties = useMemo(() => filteredProperties.slice(0, 10), [filteredProperties])

  return {
    agencyQuery,
    setAgencyQuery,
    properties,
    metrics,
    loading,
    error,
    filteredProperties,
    visibleProperties,
  }
}

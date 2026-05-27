import { useEffect, useMemo, useState } from 'react'
import './App.css'
import nexusWordmark from './assets/nexus-logo-w2.png'
import nexusIcon from './assets/nexus-logo-ico.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8787'
const DEMO_AGENCY_ID = '11111111-1111-4111-8111-111111111111'

type Property = {
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

type DashboardMetrics = {
  total_properties: number
  active_properties: number
  featured_properties: number
  published_properties: number
  portfolio_value: number
  recent_properties_30d: number
}

type AgencySettings = {
  id: string | null
  primary_color: string | null
  secondary_color: string | null
  layout_style: string | null
}

const defaultMetrics: DashboardMetrics = {
  total_properties: 0,
  active_properties: 0,
  featured_properties: 0,
  published_properties: 0,
  portfolio_value: 0,
  recent_properties_30d: 0,
}

const formatCurrency = (value: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `${currency} ${value.toLocaleString()}`
  }
}

const statusToTone = (status: string) => {
  const normalized = status.toLowerCase()

  if (['disponible', 'active', 'publicada', 'published'].includes(normalized)) {
    return 'active'
  }

  if (['pendiente', 'pending', 'draft', 'borrador'].includes(normalized)) {
    return 'pending'
  }

  if (['vendida', 'sold', 'inactiva', 'inactive'].includes(normalized)) {
    return 'inactive'
  }

  return 'neutral'
}

function App() {
  const [query, setQuery] = useState('')
  const [activeNav, setActiveNav] = useState<'dashboard' | 'properties' | 'settings'>('dashboard')
  const [properties, setProperties] = useState<Property[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics)
  const [settings, setSettings] = useState<AgencySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filteredProperties = useMemo(() => {
    const normalized = query.trim().toLowerCase()

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
  }, [properties, query])

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

        const dashboardJson = await dashboardRes.json() as { item?: DashboardMetrics }
        const propertiesJson = await propertiesRes.json() as { items?: Property[] }
        const settingsJson = await settingsRes.json() as { item?: AgencySettings }

        setMetrics(dashboardJson.item ?? defaultMetrics)
        setProperties(propertiesJson.items ?? [])
        setSettings(settingsJson.item ?? null)
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Error cargando datos de agencia.')
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [])

  return (
    <main className="agency-dashboard-screen">
      <aside className="left-sidebar">
        <div>
          <div className="brand-lockup">
            <img src={nexusIcon} alt="Nexus icon" className="brand-icon" />
            <img src={nexusWordmark} alt="Nexus Elite CRM" className="brand-wordmark" />
          </div>

          <nav className="sidebar-nav" aria-label="Panel de agencia">
            <button
              type="button"
              className={activeNav === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveNav('dashboard')}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={activeNav === 'properties' ? 'active' : ''}
              onClick={() => setActiveNav('properties')}
            >
              Properties
            </button>
            <button
              type="button"
              className={activeNav === 'settings' ? 'active' : ''}
              onClick={() => setActiveNav('settings')}
            >
              Settings
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button type="button" className="primary-side-btn">+ Add Property</button>
          <button type="button" className="text-link-btn">Support</button>
          <button type="button" className="text-link-btn">Log Out</button>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="search-shell">
            <span className="search-icon">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search properties, city, status"
              aria-label="Search"
            />
          </div>

          <div className="topbar-right">
            <div className="mini-avatar">A</div>
          </div>
        </header>

        <section className="hero-section">
          <div>
            <h1>Properties Dashboard</h1>
            <p>Gestiona propiedades y configuraciones de la sub-cuenta inmobiliaria.</p>
          </div>
          <button type="button" className="primary-cta">+ Add New Property</button>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <h3>Total Properties</h3>
            <p>{metrics.total_properties}</p>
            <small>+{metrics.recent_properties_30d} en los ultimos 30 dias</small>
          </article>

          <article className="stat-card">
            <h3>Active Properties</h3>
            <p>{metrics.active_properties}</p>
            <small>{metrics.published_properties} publicadas</small>
          </article>

          <article className="stat-card">
            <h3>Portfolio Value</h3>
            <p>{formatCurrency(metrics.portfolio_value, 'USD')}</p>
            <small>{metrics.featured_properties} destacadas</small>
          </article>
        </section>

        <section className="portfolio-shell">
          <div className="portfolio-header">
            <div>
              <h2>Portfolio Details</h2>
              <span>{filteredProperties.length} items</span>
            </div>

            <button type="button" className="ghost-filter-btn">
              {settings?.layout_style ? `Layout: ${settings.layout_style}` : 'Default layout'}
            </button>
          </div>

          <div className="table-header-row">
            <span>Property</span>
            <span>Price</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <ul className="table-body">
            {loading ? <li className="table-feedback">Cargando propiedades...</li> : null}
            {error ? <li className="table-feedback error">{error}</li> : null}
            {!loading && !error && filteredProperties.length === 0 ? (
              <li className="table-feedback">No hay propiedades para mostrar.</li>
            ) : null}

            {!loading && !error
              ? filteredProperties.slice(0, 8).map((property) => (
                  <li key={property.id} className="table-row">
                    <div className="property-cell">
                      <div className="property-thumb">🏠</div>
                      <div>
                        <strong>{property.title}</strong>
                        <span>{property.address}, {property.zone}, {property.city}</span>
                      </div>
                    </div>

                    <div className="price-cell">{formatCurrency(property.price, property.currency || 'USD')}</div>

                    <div>
                      <span className={`status-pill ${statusToTone(property.status)}`}>
                        • {property.status}
                      </span>
                    </div>

                    <div className="actions-cell">
                      <button type="button" className="ghost-btn">Edit</button>
                      <button type="button" className="ghost-btn accent">View</button>
                    </div>
                  </li>
                ))
              : null}
          </ul>

          <footer className="table-footer">
            <span>
              Showing 1 to {Math.min(filteredProperties.length, 8)} of {filteredProperties.length}
            </span>
            <div className="pager">
              <button type="button">‹</button>
              <button type="button" className="active">1</button>
              <button type="button">›</button>
            </div>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default App

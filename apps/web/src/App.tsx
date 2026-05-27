import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import nexusWordmark from './assets/nexus-logo-w2.png'
import nexusIcon from './assets/nexus-logo-ico.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8787'
const DEMO_AGENCY_ID = '11111111-1111-4111-8111-111111111111'

type ViewMode = 'super-admin' | 'agency-dashboard'

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

type Agency = {
  id: string
  name: string
  location: string
  status: 'active' | 'inactive'
  totalProperties: number
  isDemo?: boolean
}

const defaultMetrics: DashboardMetrics = {
  total_properties: 0,
  active_properties: 0,
  featured_properties: 0,
  published_properties: 0,
  portfolio_value: 0,
  recent_properties_30d: 0,
}

const agenciesSeed: Agency[] = [
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

const getViewFromHash = (): ViewMode => {
  if (typeof window === 'undefined') {
    return 'super-admin'
  }

  return window.location.hash === '#agency-demo' ? 'agency-dashboard' : 'super-admin'
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

const formatCompactNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.5 4a6.5 6.5 0 1 0 4.03 11.6l4.43 4.44 1.06-1.06-4.44-4.43A6.5 6.5 0 0 0 10.5 4Zm0 1.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3a4 4 0 0 0-4 4v1.12c0 .66-.2 1.31-.56 1.86L6.2 11.84A4 4 0 0 0 5.5 14v1h13v-1a4 4 0 0 0-.7-2.16l-1.24-1.86A3.35 3.35 0 0 1 16 8.12V7a4 4 0 0 0-4-4Zm0 18a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 21Z" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13h7V4H4v9Zm9 7h7V4h-7v16ZM4 20h7v-5H4v5Z" />
    </svg>
  )
}

function PropertyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 4 8 6v10h-5v-6H9v6H4V10l8-6Zm0 1.88L5.5 10.7V19h2v-6.5h9V19h2v-8.3L12 5.88Z" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m19.14 12.94.04-.94-.04-.94 2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.1 7.1 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.58.23-1.13.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.7 8.84a.5.5 0 0 0 .12.64l2.03 1.58-.04.94.04.94-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.4 1.05.71 1.63.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54c.58-.23 1.13-.54 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20V5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5V9h2.5A1.5 1.5 0 0 1 20 10.5V20h-5v-3.5h-2V20H4Zm1.5-1.5h2v-2h-2v2Zm0-4h2v-2h-2v2Zm0-4h2v-2h-2v2Zm4 8h2v-2h-2v2Zm0-4h2v-2h-2v2Zm0-4h2v-2h-2v2Zm4 8h2v-2h-2v2Zm4 0h1v-2h-1v2Zm0-4h1v-2h-1v2Z" />
    </svg>
  )
}

function SparklineIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 16.5 9 12l3 3 6-7 1.5 1.2-7.07 8.25L9 13.98l-2.6 2.6L5 16.5Z" />
    </svg>
  )
}

function MoneyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm0 1.5v1A2.5 2.5 0 0 0 6.5 11h11A2.5 2.5 0 0 0 20 8.5v-1H4Zm16 9v-1A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5v1h16ZM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 6c4.8 0 8.77 2.93 10 6-1.23 3.07-5.2 6-10 6S3.23 15.07 2 12c1.23-3.07 5.2-6 10-6Zm0 1.5c-3.83 0-7.1 2.18-8.35 4.5 1.25 2.32 4.52 4.5 8.35 4.5s7.1-2.18 8.35-4.5C19.1 9.68 15.83 7.5 12 7.5Zm0 1.5A3 3 0 1 1 12 15a3 3 0 0 1 0-6Z" />
    </svg>
  )
}

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(getViewFromHash)
  const [query, setQuery] = useState('')
  const [agencyQuery, setAgencyQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'agencies' | 'global'>('agencies')
  const [activeNav, setActiveNav] = useState<'dashboard' | 'properties' | 'settings'>('properties')
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics)
  const [settings, setSettings] = useState<AgencySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const avatarMenuRef = useRef<HTMLDivElement | null>(null)

  const filteredAgencies = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) {
      return agenciesSeed
    }

    return agenciesSeed.filter((agency) => {
      return (
        agency.name.toLowerCase().includes(normalized) ||
        agency.location.toLowerCase().includes(normalized) ||
        String(agency.totalProperties).includes(normalized)
      )
    })
  }, [query])

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

  useEffect(() => {
    const syncView = () => {
      setViewMode(getViewFromHash())
    }

    window.addEventListener('hashchange', syncView)

    return () => {
      window.removeEventListener('hashchange', syncView)
    }
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!avatarMenuRef.current) {
        return
      }

      if (event.target instanceof Node && !avatarMenuRef.current.contains(event.target)) {
        setIsAvatarMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

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

  const openAgencyDashboard = () => {
    window.location.hash = 'agency-demo'
    setViewMode('agency-dashboard')
  }

  const openSuperAdmin = () => {
    window.location.hash = ''
    setViewMode('super-admin')
  }

  if (viewMode === 'super-admin') {
    return (
      <main className="super-admin-screen">
        <header className="super-admin-topbar">
          <div className="brand-lockup brand-lockup-super-admin">
            <img src={nexusIcon} alt="Nexus icon" className="brand-icon brand-icon-super-admin" />
            <img src={nexusWordmark} alt="Nexus Elite CRM" className="brand-wordmark brand-wordmark-super-admin" />
          </div>

          <div className="topbar-center">
            <div className="search-shell search-shell-super-admin">
              <span className="search-icon icon-shell"><SearchIcon /></span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar agencias, usuarios o ajustes"
                aria-label="Buscar"
              />
            </div>

            <nav className="tab-nav" aria-label="Secciones de Super Admin">
              <button
                type="button"
                className={activeTab === 'agencies' ? 'active' : ''}
                onClick={() => setActiveTab('agencies')}
              >
                Agencias
              </button>
              <button
                type="button"
                className={activeTab === 'global' ? 'active' : ''}
                onClick={() => setActiveTab('global')}
              >
                Ajustes globales
              </button>
            </nav>
          </div>

          <div className="topbar-actions" aria-label="User actions" ref={avatarMenuRef}>
            <button
              type="button"
              className="avatar-trigger"
              onClick={() => setIsAvatarMenuOpen((current) => !current)}
              aria-expanded={isAvatarMenuOpen}
              aria-haspopup="menu"
            >
              <span className="avatar">M</span>
            </button>
            {isAvatarMenuOpen ? (
              <div className="avatar-menu" role="menu" aria-label="User menu">
                <button type="button" role="menuitem" onClick={() => setIsAvatarMenuOpen(false)}>
                  Configuracion / Cambiar password
                </button>
                <button type="button" role="menuitem" onClick={() => setIsAvatarMenuOpen(false)}>
                  Cerrar sesion
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <section className="hero-copy">
          <h1>Agencies Overview</h1>
          <p>
            Monitor and manage all connected real estate brokerages within the Nexus Elite network.
            Configure global access controls and monitor property portfolios.
          </p>
          <button type="button" className="primary-cta super-admin-cta">+ Add New Agency</button>
        </section>

        <section className="agencies-table-shell">
          <div className="table-header-row super-admin-header-row">
            <span>Agency Details</span>
            <span>Status</span>
            <span>Total Properties</span>
            <span>Actions</span>
          </div>

          <ul className="table-body">
            {filteredAgencies.map((agency) => (
              <li key={agency.id} className="table-row super-admin-table-row">
                <div className="agency-cell">
                  <div className="agency-badge">{agency.name.charAt(0)}</div>
                  <div>
                    <strong>{agency.name}</strong>
                    <span>{agency.location}</span>
                  </div>
                </div>

                <div>
                  <span className={`status-pill ${agency.status}`}>
                    • {agency.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="count-cell">{agency.totalProperties.toLocaleString()}</div>

                <div className="actions-cell">
                  <button type="button" className="ghost-btn">Configure</button>
                  {agency.status === 'active' ? (
                    <button
                      type="button"
                      className="ghost-btn accent"
                      onClick={agency.isDemo ? openAgencyDashboard : undefined}
                    >
                      {agency.isDemo ? 'Login as Agency' : 'Available Soon'}
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          <footer className="table-footer">
            <span>
              Showing 1-{filteredAgencies.length} of 128 Agencies
            </span>
            <div className="pager">
              <button type="button">‹</button>
              <button type="button" className="active">1</button>
              <button type="button">2</button>
              <button type="button">›</button>
            </div>
          </footer>
        </section>
      </main>
    )
  }

  return (
    <main className="agency-dashboard-screen">
      <aside className="left-sidebar">
        <div>
          <div className="brand-lockup brand-lockup-sidebar" onClick={openSuperAdmin} role="button" tabIndex={0}>
            <img src={nexusIcon} alt="Nexus icon" className="brand-icon" />
            <img src={nexusWordmark} alt="Nexus Elite CRM" className="brand-wordmark" />
          </div>

          <nav className="sidebar-nav" aria-label="Panel de agencia">
            <button
              type="button"
              className={activeNav === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveNav('dashboard')}
            >
              <span className="nav-icon"><DashboardIcon /></span>
              Dashboard
            </button>
            <button
              type="button"
              className={activeNav === 'properties' ? 'active' : ''}
              onClick={() => setActiveNav('properties')}
            >
              <span className="nav-icon"><PropertyIcon /></span>
              Propiedades
            </button>
            <button type="button" className={activeNav === 'settings' ? 'active' : ''} onClick={() => setActiveNav('settings')}>
              <span className="nav-icon"><SettingsIcon /></span>
              Configuracion
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button type="button" className="primary-side-btn">+ Add Property</button>
          <button type="button" className="text-link-btn" onClick={openSuperAdmin}>Volver a Super Admin</button>
          <button type="button" className="text-link-btn">Soporte</button>
          <button type="button" className="text-link-btn">Cerrar sesion</button>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="search-shell">
            <span className="search-icon icon-shell"><SearchIcon /></span>
            <input
              value={agencyQuery}
              onChange={(event) => setAgencyQuery(event.target.value)}
              placeholder="Buscar propiedades, ciudad, estado"
              aria-label="Buscar"
            />
          </div>

          <div className="topbar-right">
            <button type="button" className="topbar-icon-btn" aria-label="Notificaciones"><BellIcon /></button>
            <button type="button" className="topbar-icon-btn" aria-label="Aplicaciones"><GridIcon /></button>
            <div className="mini-avatar">A</div>
          </div>
        </header>

        <section className="hero-section">
          <div>
            <h1>Propiedades</h1>
            <p>Administra tu inventario inmobiliario y la configuracion general de la sub-cuenta.</p>
          </div>
          <button type="button" className="primary-cta">+ Agregar Propiedad</button>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-card-header">
              <h3>Total propiedades</h3>
              <span className="stat-icon blue"><BuildingIcon /></span>
            </div>
            <p>{metrics.total_properties}</p>
            <small className="trend-positive">+{metrics.recent_properties_30d} vs ultimos 30 dias</small>
          </article>

          <article className="stat-card">
            <div className="stat-card-header">
              <h3>Propiedades activas</h3>
              <span className="stat-icon amber"><SparklineIcon /></span>
            </div>
            <p>{metrics.active_properties}</p>
            <small className="trend-positive">{metrics.published_properties} publicadas</small>
          </article>

          <article className="stat-card stat-card-accent">
            <div className="stat-card-header">
              <h3>Valor del portafolio</h3>
              <span className="stat-icon green"><MoneyIcon /></span>
            </div>
            <p>{formatCurrency(metrics.portfolio_value, 'USD')}</p>
            <small className="trend-neutral">{metrics.featured_properties} destacadas</small>
          </article>
        </section>

        <section className="portfolio-shell">
          <div className="portfolio-header">
            <div>
              <h2>Detalle del portafolio</h2>
              <span>{filteredProperties.length} items</span>
            </div>

            <button type="button" className="ghost-filter-btn">
              {settings?.layout_style ? `Layout: ${settings.layout_style}` : 'Todos los estados'}
            </button>
          </div>

          <div className="table-header-row">
            <span>Propiedad</span>
            <span>Precio</span>
            <span>Estado</span>
            <span>Vistas</span>
            <span>Acciones</span>
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
                      <div className="property-thumb"><PropertyIcon /></div>
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

                    <div className="views-cell">
                      <span className="views-badge"><EyeIcon /> {formatCompactNumber(property.featured ? 1200 : 845)}</span>
                    </div>

                    <div className="actions-cell">
                      <button type="button" className="ghost-btn">Editar</button>
                      <button type="button" className="ghost-btn accent">Ver</button>
                    </div>
                  </li>
                ))
              : null}
          </ul>

          <footer className="table-footer">
            <span>
              Mostrando 1 a {Math.min(filteredProperties.length, 8)} de {filteredProperties.length}
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

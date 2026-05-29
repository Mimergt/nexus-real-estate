import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MaterialIcon } from '../components/icons'
import { useAgencyData } from '../hooks/useAgencyData'
import { formatCurrency } from '../lib/formatters'
import { buildTemplate1Catalog } from '../lib/template1Data'

type ListingMode = 'all' | 'rent' | 'sale'

const getListingModeFromHash = (hash: string): ListingMode => {
  const value = hash.replace('#', '').toLowerCase().trim()
  if (value === 'renta') return 'rent'
  if (value === 'venta') return 'sale'
  return 'all'
}

export function AgencyTemplate1HomePage() {
  const navigate = useNavigate()
  const { filteredProperties } = useAgencyData()
  const [locationQuery, setLocationQuery] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [listingMode, setListingMode] = useState<ListingMode>(() => {
    if (typeof window === 'undefined') return 'all'
    return getListingModeFromHash(window.location.hash)
  })

  const contactEmbedHtml = `
    <div style="display:grid;gap:10px;">
      <input type="text" placeholder="Nombre" style="width:100%;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.03);color:#e8efff;padding:11px 12px;border-radius:10px;" />
      <input type="email" placeholder="Email" style="width:100%;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.03);color:#e8efff;padding:11px 12px;border-radius:10px;" />
      <textarea placeholder="Mensaje" rows="4" style="width:100%;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.03);color:#e8efff;padding:11px 12px;border-radius:10px;resize:vertical;"></textarea>
      <button type="button" style="border:none;border-radius:10px;background:#adc6ff;color:#10326f;padding:11px 14px;font-weight:700;cursor:pointer;">Enviar</button>
    </div>
  `

  const seededWithApi = useMemo(() => buildTemplate1Catalog(filteredProperties), [filteredProperties])

  const filteredTemplateProperties = useMemo(() => {
    return seededWithApi.filter((property) => {
      const locationMatches = locationQuery.trim()
        ? `${property.zone} ${property.city}`.toLowerCase().includes(locationQuery.trim().toLowerCase())
        : true

      const typeMatches = propertyType ? property.type === propertyType : true

      const priceMatches = (() => {
        if (!priceRange) return true
        if (priceRange === '1m-5m') return property.price >= 1000000 && property.price <= 5000000
        if (priceRange === '5m-10m') return property.price > 5000000 && property.price <= 10000000
        if (priceRange === '10m+') return property.price > 10000000
        return true
      })()

      const favoriteMatches = showFavoritesOnly ? favoriteIds.includes(property.id) : true

      const availabilityMatches = (() => {
        if (listingMode === 'rent') return property.forRent
        if (listingMode === 'sale') return property.forSale
        return true
      })()

      return locationMatches && typeMatches && priceMatches && favoriteMatches && availabilityMatches
    })
  }, [seededWithApi, locationQuery, propertyType, priceRange, showFavoritesOnly, favoriteIds, listingMode])

  const totalPages = Math.max(1, Math.ceil(filteredTemplateProperties.length / 10))

  const visibleProperties = useMemo(() => {
    const start = (currentPage - 1) * 10
    return filteredTemplateProperties.slice(start, start + 10)
  }, [filteredTemplateProperties, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [locationQuery, propertyType, priceRange, showFavoritesOnly, listingMode])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const syncModeFromHash = () => {
      setListingMode(getListingModeFromHash(window.location.hash))
    }

    syncModeFromHash()
    window.addEventListener('hashchange', syncModeFromHash)
    return () => window.removeEventListener('hashchange', syncModeFromHash)
  }, [])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const toggleFavorite = (propertyId: string) => {
    setFavoriteIds((current) => {
      if (current.includes(propertyId)) {
        return current.filter((id) => id !== propertyId)
      }
      return [...current, propertyId]
    })
  }

  const handleListingModeChange = (mode: ListingMode) => {
    setListingMode(mode)
    if (mode === 'rent') {
      navigate('/portal/template-1#renta')
      return
    }
    if (mode === 'sale') {
      navigate('/portal/template-1#venta')
      return
    }
    navigate('/portal/template-1')
  }

  return (
    <main className="template1-home-screen">
      <nav className="template1-top-nav">
        <div className="template1-top-nav-inner">
          <a className="template1-brand" href="#inicio">Estately</a>

          <div className="template1-nav-links" aria-label="Tipo de propiedad">
            <button
              type="button"
              className={listingMode === 'rent' ? 'active' : ''}
              onClick={() => handleListingModeChange('rent')}
            >
              Renta
            </button>
            <button
              type="button"
              className={listingMode === 'sale' ? 'active' : ''}
              onClick={() => handleListingModeChange('sale')}
            >
              Venta
            </button>
          </div>

          <div className="template1-nav-actions">
            <button
              type="button"
              className={`template1-icon-btn template1-favorite-toggle ${showFavoritesOnly ? 'active' : ''}`}
              aria-label="Favoritos"
              onClick={() => setShowFavoritesOnly((current) => !current)}
            >
              <span>Favoritos</span>
              <strong>{favoriteIds.length}</strong>
            </button>
            <a className="template1-pill-btn" href="#contacto">Contactenos</a>
          </div>
        </div>
      </nav>

      <section id="inicio" className="template1-hero">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcjEBTulGJABC-y3jJphfexdI3NitqWYP-MZN0Y9Z0nF5LFASQlogsMXwQWRQP4qST1rpnXhqkZVFtl2odIKrePC9q5r4_mDYIcSgsodlzJPlu0jGO01DMK-hfUzZKaygzvAUAv80ox6Ng0ppHMqJbzCNErfm9hNLFDPN796MbGcUnpIU9njS9AWTbWTH0smuxes3XdwXye3GCdbv4i8Okn46I-u2aIXdcCxeQ62VTJBdiiuoeHop2rfPugO4E2nZqIAO_B0a1xw"
          alt="Villa de lujo con piscina"
          className="template1-hero-bg"
        />
        <div className="template1-hero-overlay" />

        <div className="template1-hero-content">
          <h1>Descubre la Excelencia</h1>
          <div className="template1-search-bar">
            <label className="template1-search-field">
              <MaterialIcon name="location_on" />
              <input
                value={locationQuery}
                onChange={(event) => setLocationQuery(event.target.value)}
                placeholder="Ubicacion o ciudad"
              />
            </label>

            <label className="template1-search-field">
              <MaterialIcon name="home" />
              <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                <option value="">Tipo de Propiedad</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="mansion">Mansion</option>
              </select>
            </label>

            <label className="template1-search-field">
              <MaterialIcon name="payments" />
              <select value={priceRange} onChange={(event) => setPriceRange(event.target.value)}>
                <option value="">Rango de Precio</option>
                <option value="1m-5m">$1M - $5M</option>
                <option value="5m-10m">$5M - $10M</option>
                <option value="10m+">+$10M</option>
              </select>
            </label>

            <button type="button" className="template1-search-btn">
              <MaterialIcon name="search" />
              <span>Buscar</span>
            </button>
          </div>
        </div>
      </section>

      <section id="propiedades" className="template1-listings-wrap">
        <header className="template1-listings-head">
          <p>
            Mostrando <strong>{visibleProperties.length}</strong> de <strong>{filteredTemplateProperties.length}</strong> propiedades
          </p>
        </header>

        <p className="template1-feedback">Catalogo demo de 15 propiedades ficticias para ajuste visual.</p>

        {visibleProperties.length === 0 ? (
          <p className="template1-feedback">Todavia no hay propiedades para mostrar.</p>
        ) : null}

        {visibleProperties.length > 0 ? (
          <div className="template1-property-grid">
            {visibleProperties.map((property) => {
              return (
                <article
                  key={property.id}
                  className="template1-card template1-card-clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/propiedad/${property.slug}/`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/propiedad/${property.slug}/`)
                    }
                  }}
                >
                  <div className="template1-card-media">
                    <img src={property.photos[0]} alt={property.title} />
                    <button
                      type="button"
                      className={`template1-like-btn ${favoriteIds.includes(property.id) ? 'active' : ''}`}
                      aria-label="Agregar a favoritos"
                      onClick={(event) => {
                        event.stopPropagation()
                        toggleFavorite(property.id)
                      }}
                    >
                      <MaterialIcon name="favorite" />
                    </button>
                  </div>

                  <div className="template1-card-content">
                    <div className="template1-card-price">{formatCurrency(property.price, property.currency || 'USD')}</div>
                    <h3>{property.title}</h3>
                    <p>{property.zone}, {property.city}</p>

                    <ul>
                      <li><MaterialIcon name="bed" /> {property.beds}</li>
                      <li><MaterialIcon name="shower" /> {property.baths}</li>
                      <li><MaterialIcon name="square_foot" /> {property.area}</li>
                    </ul>
                  </div>
                </article>
              )
            })}
          </div>
        ) : null}

        {filteredTemplateProperties.length > 0 ? (
          <div className="template1-pagination" aria-label="Paginacion de propiedades">
            <button type="button" onClick={() => setCurrentPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1}>
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={page === currentPage ? 'active' : ''}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button type="button" onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))} disabled={currentPage === totalPages}>
              Siguiente
            </button>
          </div>
        ) : null}
      </section>

      <footer id="contacto" className="template1-footer">
        <div className="template1-footer-main">
          <div className="template1-agent-card">
            <h4>Agente</h4>
            <p className="template1-agent-name">Valentina Rojas</p>
            <p>
              Especialista en propiedades de lujo en Ciudad de Guatemala, Costa del Sol y mercados premium de Latinoamerica.
            </p>
            <ul>
              <li><strong>Telefono:</strong> +502 5555-0101</li>
              <li><strong>Email:</strong> valentina@estately.gt</li>
              <li><strong>Horario:</strong> Lunes a Sabado, 8:00 - 18:00</li>
            </ul>
          </div>

          <div className="template1-contact-embed">
            <h4>Contacto</h4>
            <p>Pega aqui el embed HTML configurado desde el admin.</p>
            <div className="template1-contact-embed-shell" dangerouslySetInnerHTML={{ __html: contactEmbedHtml }} />
          </div>
        </div>

        <div className="template1-footer-copy">
          Creado con NEXUS.epic.gt - 2026
        </div>
      </footer>
    </main>
  )
}
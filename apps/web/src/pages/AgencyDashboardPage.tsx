import { useNavigate, useOutletContext } from 'react-router-dom'
import { MaterialIcon } from '../components/icons'
import type { AgencyOutletContext } from '../components/AgencyLayout'
import { formatCurrency, statusToLabel, statusToTone } from '../lib/formatters'

export function AgencyDashboardPage() {
  const navigate = useNavigate()
  const { loading, error, metrics, visibleProperties } = useOutletContext<AgencyOutletContext>()

  return (
    <section className="agency-dashboard-overview">
      <section className="hero-section">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general de tu agencia y de la actividad reciente de propiedades.</p>
        </div>
        <button type="button" className="primary-cta" onClick={() => navigate('/agency/nueva-propiedad/')}>+ Agregar propiedad</button>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-card-header">
            <h3>Total propiedades</h3>
            <span className="stat-icon blue"><MaterialIcon name="apartment" /></span>
          </div>
          <p>{metrics.total_properties}</p>
          <small className="trend-positive">+{metrics.recent_properties_30d} vs últimos 30 días</small>
        </article>

        <article className="stat-card">
          <div className="stat-card-header">
            <h3>Propiedades activas</h3>
            <span className="stat-icon amber"><MaterialIcon name="groups" /></span>
          </div>
          <p>{metrics.active_properties}</p>
          <small className="trend-positive">{metrics.published_properties} publicadas</small>
        </article>

        <article className="stat-card stat-card-accent">
          <div className="stat-card-header">
            <h3>Propiedades destacadas</h3>
            <span className="stat-icon green"><MaterialIcon name="star" /></span>
          </div>
          <p>{metrics.featured_properties}</p>
          <small className="trend-neutral">Portafolio priorizado</small>
        </article>
      </section>

      <section className="portfolio-shell">
        <div className="portfolio-header">
          <div>
            <h2>Actividad reciente</h2>
            <span>{visibleProperties.length} items</span>
          </div>
        </div>

        <div className="table-header-row">
          <span>Propiedad</span>
          <span>Precio</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        <ul className="table-body">
          {loading ? <li className="table-feedback">Cargando propiedades...</li> : null}
          {error ? <li className="table-feedback error">{error}</li> : null}
          {!loading && !error && visibleProperties.length === 0 ? (
            <li className="table-feedback">No hay propiedades para mostrar.</li>
          ) : null}

          {!loading && !error
            ? visibleProperties.slice(0, 5).map((property) => (
                <li key={property.id} className="table-row">
                  <div className="property-cell">
                    <div className="property-thumb"><MaterialIcon name="image" className="property-thumb-icon" /></div>
                    <div>
                      <strong>{property.title}</strong>
                      <span>{property.address}, {property.zone}, {property.city}</span>
                    </div>
                  </div>
                  <div className="price-cell">{formatCurrency(property.price, property.currency || 'USD')}</div>
                  <div>
                    <span className={`status-pill ${statusToTone(property.status)}`}>
                      <span className="status-dot" />
                      {statusToLabel(property.status)}
                    </span>
                  </div>
                  <div className="actions-cell">
                    <button type="button" className="ghost-btn" aria-label="Ver propiedad" title="Ver propiedad">
                      <MaterialIcon name="language" />
                    </button>
                    <button type="button" className="ghost-btn" aria-label="Vista previa" title="Vista previa"><MaterialIcon name="visibility" /></button>
                    <button type="button" className="ghost-btn" aria-label="Editar propiedad" title="Editar"><MaterialIcon name="edit" /></button>
                  </div>
                </li>
              ))
            : null}
        </ul>
      </section>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { MaterialIcon } from '../components/icons'
import type { AgencyOutletContext } from '../components/AgencyLayout'
import { formatCompactNumber, formatCurrency, formatDemoAddedDate, statusToLabel, statusToTone } from '../lib/formatters'

export function AgencyPropertiesPage() {
  const navigate = useNavigate()
  const { loading, error, filteredProperties, visibleProperties, metrics } = useOutletContext<AgencyOutletContext>()
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([])
  const totalPropertiesCount = metrics.total_properties || filteredProperties.length
  const propertiesLabel = totalPropertiesCount === 1 ? 'propiedad' : 'propiedades'

  useEffect(() => {
    setSelectedPropertyIds((current) => current.filter((id) => filteredProperties.some((property) => property.id === id)))
  }, [filteredProperties])

  const isAllPropertiesSelected = visibleProperties.length > 0 && selectedPropertyIds.length === visibleProperties.length

  const togglePropertySelection = (propertyId: string) => {
    setSelectedPropertyIds((current) => {
      if (current.includes(propertyId)) {
        return current.filter((id) => id !== propertyId)
      }

      return [...current, propertyId]
    })
  }

  const toggleAllVisibleProperties = () => {
    setSelectedPropertyIds(isAllPropertiesSelected ? [] : visibleProperties.map((property) => property.id))
  }

  return (
    <section className="property-management-view">
      <div className="property-management-header">
        <div>
          <h1>Gestión de propiedades</h1>
          <p>Gestiona y da seguimiento a tu portafolio completo ({formatCompactNumber(totalPropertiesCount)} {propertiesLabel})</p>
        </div>

        <div className="property-management-actions">
          <button type="button" className="glass-action-btn">Exportar</button>
          <button type="button" className="primary-cta property-primary-cta" onClick={() => navigate('/agency/nueva-propiedad/')}>+ Nueva propiedad</button>
        </div>
      </div>

      <div className="property-filter-bar">
        <div className="property-filters-group">
          <div className="property-select-shell">
            <select className="property-select" aria-label="Filtrar por estado">
              <option value="all">Todos los estados</option>
              <option value="active">Disponible</option>
              <option value="pending">Pendiente</option>
              <option value="sold">Vendida</option>
              <option value="draft">Borrador</option>
            </select>
            <MaterialIcon name="expand_more" className="select-chevron" />
          </div>

          <div className="property-select-shell">
            <select className="property-select" aria-label="Filtrar por tipo">
              <option value="all">Todos los tipos</option>
              <option value="house">Casa</option>
              <option value="apartment">Apartamento</option>
              <option value="commercial">Comercial</option>
            </select>
            <MaterialIcon name="expand_more" className="select-chevron" />
          </div>

          <div className="property-select-shell">
            <select className="property-select" aria-label="Filtrar por agente">
              <option value="all">Cualquier agente</option>
              <option value="me">Asignadas a mí</option>
              <option value="team">Equipo A</option>
            </select>
            <MaterialIcon name="expand_more" className="select-chevron" />
          </div>
        </div>

        <div className="property-toolbar-actions">
          <span className="property-selected-count">{selectedPropertyIds.length} seleccionadas</span>
          <button type="button" className="property-icon-btn" disabled={selectedPropertyIds.length === 0} aria-label="Eliminar seleccionadas">
            <MaterialIcon name="delete" />
          </button>

          <div className="property-view-toggle" aria-label="Modo de vista">
            <button type="button" className="active" aria-pressed="true">
              <MaterialIcon name="table_rows" />
            </button>
            <button type="button" aria-pressed="false">
              <MaterialIcon name="grid_view" />
            </button>
          </div>
        </div>
      </div>

      <section className="property-table-shell">
        <div className="property-table-scroll">
          <table className="property-table">
            <thead>
              <tr>
                <th className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={isAllPropertiesSelected}
                    onChange={toggleAllVisibleProperties}
                    aria-label="Seleccionar todas las propiedades visibles"
                  />
                </th>
                <th>Propiedad</th>
                <th>Precio</th>
                <th>Estado</th>
                <th className="center-cell">Vistas</th>
                <th className="center-cell">Consultas</th>
                <th>Agregada</th>
                <th className="actions-header">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? <tr><td colSpan={8} className="property-table-message">Cargando propiedades...</td></tr> : null}
              {error ? <tr><td colSpan={8} className="property-table-message error">{error}</td></tr> : null}
              {!loading && !error && visibleProperties.length === 0 ? (
                <tr><td colSpan={8} className="property-table-message">No hay propiedades para mostrar.</td></tr>
              ) : null}

              {!loading && !error
                ? visibleProperties.map((property, index) => {
                    const normalizedStatus = statusToTone(property.status)
                    const selected = selectedPropertyIds.includes(property.id)

                    return (
                      <tr key={property.id} className="property-table-row">
                        <td className="checkbox-cell">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => togglePropertySelection(property.id)}
                            aria-label={`Seleccionar ${property.title}`}
                          />
                        </td>

                        <td>
                          <div className="property-cell">
                            <div className="property-thumb">
                              <MaterialIcon name="image" className="property-thumb-icon" />
                            </div>
                            <div>
                              <strong>{property.title}</strong>
                              <span>{property.address}, {property.zone}, {property.city}</span>
                            </div>
                          </div>
                        </td>

                        <td className="price-cell">{formatCurrency(property.price, property.currency || 'USD')}</td>

                        <td>
                          <span className={`status-pill ${normalizedStatus}`}>
                            <span className="status-dot" />
                            {statusToLabel(property.status)}
                          </span>
                        </td>

                        <td className="center-cell views-cell">
                          {formatCompactNumber(property.featured ? 1204 + index * 38 : 856 + index * 24)}
                        </td>

                        <td className="center-cell views-cell">
                          <span className="inquiries-badge">{property.featured ? 12 : 3}</span>
                        </td>

                        <td className="added-cell">{formatDemoAddedDate(index)}</td>

                        <td className="actions-cell property-actions-cell">
                          <button type="button" className="ghost-btn" aria-label="Editar propiedad" title="Editar">
                            <MaterialIcon name="edit" />
                          </button>
                          <button type="button" className="ghost-btn" aria-label="Ver propiedad" title="Ver sitio">
                            <MaterialIcon name="visibility" />
                          </button>
                          <button type="button" className="ghost-btn accent" aria-label="Más acciones" title="Más">
                            <MaterialIcon name="more_vert" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                : null}
            </tbody>
          </table>
        </div>

        <footer className="property-table-footer">
          <p>Mostrando 1 a {Math.min(visibleProperties.length, 10)} de {visibleProperties.length.toLocaleString()} registros</p>
          <div className="property-pagination">
            <button type="button">‹</button>
            <button type="button" className="active">1</button>
            <button type="button">2</button>
            <button type="button">›</button>
          </div>
        </footer>
      </section>
    </section>
  )
}

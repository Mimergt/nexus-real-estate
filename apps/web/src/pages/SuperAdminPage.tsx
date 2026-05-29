import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import nexusWordmark from '../assets/nexus-logo-w2.png'
import nexusIcon from '../assets/nexus-logo-ico.png'
import { SearchIcon } from '../components/icons'
import { agenciesSeed } from '../lib/types'

export function SuperAdminPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'agencies' | 'global'>('agencies')
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)
  const avatarMenuRef = useRef<HTMLDivElement | null>(null)

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
                {agency.isDemo ? (
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => navigate('/portal/template-1')}
                  >
                    Ver Home T1
                  </button>
                ) : null}
                {agency.status === 'active' ? (
                  <button
                    type="button"
                    className="ghost-btn accent"
                    onClick={agency.isDemo ? () => navigate('/agency/') : undefined}
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

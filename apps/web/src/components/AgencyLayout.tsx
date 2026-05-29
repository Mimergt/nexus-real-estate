import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import nexusWordmark from '../assets/nexus-logo-w2.png'
import nexusIcon from '../assets/nexus-logo-ico.png'
import { useAgencyData } from '../hooks/useAgencyData'
import { MaterialIcon } from './icons'

export type AgencyOutletContext = ReturnType<typeof useAgencyData>

export function AgencyLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const agencyData = useAgencyData()

  const isDashboard = location.pathname === '/agency' || location.pathname === '/agency/'
  const isProperties = location.pathname.startsWith('/agency/propiedades') || location.pathname.startsWith('/agency/nueva-propiedad')
  const isSettings = location.pathname.startsWith('/agency/configuracion')

  return (
    <main className={`agency-dashboard-screen ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className={`left-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div>
          <div className="brand-row">
            <div
              className="brand-lockup brand-lockup-sidebar"
              onClick={() => navigate('/')}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  navigate('/')
                }
              }}
              role="button"
              tabIndex={0}
            >
              <img src={nexusIcon} alt="Nexus icon" className="brand-icon" />
              <img src={nexusWordmark} alt="Nexus Elite CRM" className="brand-wordmark" />
            </div>

            <button
              type="button"
              className="sidebar-collapse-btn"
              onClick={() => setIsSidebarCollapsed((current) => !current)}
              aria-label={isSidebarCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
            >
              <MaterialIcon name="menu_open" className="sidebar-collapse-icon" />
            </button>
          </div>

          <nav className="sidebar-nav" aria-label="Panel de agencia">
            <button
              type="button"
              className={isDashboard ? 'active' : ''}
              onClick={() => navigate('/agency/')}
              data-tooltip="Dashboard"
            >
              <span className="nav-icon"><MaterialIcon name="dashboard" /></span>
              <span className="nav-label">Dashboard</span>
            </button>
            <button
              type="button"
              className={isProperties ? 'active' : ''}
              onClick={() => navigate('/agency/propiedades/')}
              data-tooltip="Propiedades"
            >
              <span className="nav-icon"><MaterialIcon name="home_work" /></span>
              <span className="nav-label">Propiedades</span>
            </button>
            <button
              type="button"
              className={isSettings ? 'active' : ''}
              onClick={() => navigate('/agency/configuracion/')}
              data-tooltip="Configuracion"
            >
              <span className="nav-icon"><MaterialIcon name="settings" /></span>
              <span className="nav-label">Configuracion</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button type="button" className="primary-side-btn add-property-btn" onClick={() => navigate('/agency/nueva-propiedad/')}><MaterialIcon name="add" /><span className="sidebar-cta-label">Agregar Propiedad</span></button>
          <button type="button" className="text-link-btn" onClick={() => navigate('/')}>Volver a Super Admin</button>
          <button type="button" className="text-link-btn">Soporte</button>
          <button type="button" className="text-link-btn">Cerrar sesion</button>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="search-shell">
            <span className="search-icon icon-shell"><MaterialIcon name="search" /></span>
            <input
              value={agencyData.agencyQuery}
              onChange={(event) => agencyData.setAgencyQuery(event.target.value)}
              placeholder="Buscar propiedades, ciudad, estado"
              aria-label="Buscar"
            />
          </div>

          <div className="topbar-right">
            <button type="button" className="topbar-icon-btn" aria-label="Notificaciones"><MaterialIcon name="notifications" /><span className="notification-dot" /></button>
            <button type="button" className="topbar-icon-btn" aria-label="Aplicaciones"><MaterialIcon name="apps" /></button>
            <button type="button" className="topbar-help-btn">Ayuda</button>
            <div className="mini-avatar">A</div>
          </div>
        </header>

        <Outlet context={agencyData} />
      </section>
    </main>
  )
}

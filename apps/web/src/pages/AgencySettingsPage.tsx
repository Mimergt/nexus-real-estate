import { useState } from 'react'
import { MaterialIcon } from '../components/icons'

const paletteOptions = [
  { id: 'modern', name: 'Modern Elite', colors: ['#adc6ff', '#1d2027', '#ffb95f', '#e1e2ec'] },
  { id: 'nature', name: 'Nature Fresh', colors: ['#10b981', '#064e3b', '#fcd34d', '#f3f4f6'] },
  { id: 'urban', name: 'Urban Bold', colors: ['#ef4444', '#7f1d1d', '#1f2937', '#ffffff'] },
  { id: 'royal', name: 'Luxury Royal', colors: ['#8b5cf6', '#4c1d95', '#fbcfe8', '#111827'] },
]

const themeOptions = [
  { id: 'deep-night', name: 'Noche Profunda', description: 'Interfaz oscura optimizada' },
  { id: 'crystal-light', name: 'Luz Cristalina', description: 'Modo claro de alto contraste' },
  { id: 'dynamic-ai', name: 'Dinámico (IA)', description: 'Adaptación según horario', disabled: true },
]

export function AgencySettingsPage() {
  const [selectedPalette, setSelectedPalette] = useState('nature')
  const [selectedTheme, setSelectedTheme] = useState('deep-night')

  return (
    <section className="agency-settings-view">
      <div className="agency-settings-header">
        <h1>Configuración</h1>
        <p>Personaliza la identidad visual de tu agencia y configura integraciones.</p>
      </div>

      <div className="agency-settings-grid">
        <div className="agency-settings-main-col">
          <section className="new-property-card settings-card">
            <div className="settings-card-head">
              <MaterialIcon name="branding_watermark" />
              <h2>Identidad de Marca</h2>
            </div>

            <div className="settings-two-col">
              <div className="settings-upload-box">
                <MaterialIcon name="cloud_upload" className="settings-upload-icon" />
                <p>Click para subir logo (PNG, SVG)</p>
              </div>

              <label className="settings-field">
                <span>Nombre comercial</span>
                <input className="glass-input" placeholder="Ej: Estately Elite Real Estate" />
                <small>Este nombre aparecerá en comunicaciones externas.</small>
              </label>
            </div>
          </section>

          <section className="new-property-card settings-card">
            <div className="settings-card-head">
              <MaterialIcon name="palette" />
              <h2>Paletas de Colores</h2>
            </div>

            <div className="settings-palette-grid">
              {paletteOptions.map((palette) => (
                <button
                  key={palette.id}
                  type="button"
                  className={`settings-palette-option ${selectedPalette === palette.id ? 'active' : ''}`}
                  onClick={() => setSelectedPalette(palette.id)}
                >
                  <div className="settings-palette-preview">
                    {palette.colors.map((color) => (
                      <span key={color} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <strong>{palette.name}</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="new-property-card settings-card">
            <div className="settings-card-head">
              <MaterialIcon name="contact_support" />
              <h2>Información de Contacto</h2>
            </div>

            <div className="settings-two-col">
              <label className="settings-field">
                <span>Agente responsable</span>
                <input className="glass-input" defaultValue="Adrián Domínguez" />
              </label>

              <label className="settings-field">
                <span>WhatsApp / Teléfono</span>
                <input className="glass-input" defaultValue="+52 55 1234 5678" />
              </label>
            </div>
          </section>
        </div>

        <div className="agency-settings-side-col">
          <section className="new-property-card settings-card">
            <div className="settings-card-head">
              <MaterialIcon name="grid_view" />
              <h2>Selector de Tema</h2>
            </div>

            <div className="settings-theme-list">
              {themeOptions.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={`settings-theme-option ${selectedTheme === theme.id ? 'active' : ''} ${theme.disabled ? 'disabled' : ''}`}
                  onClick={() => {
                    if (!theme.disabled) {
                      setSelectedTheme(theme.id)
                    }
                  }}
                  disabled={theme.disabled}
                >
                  <div>
                    <strong>{theme.name}</strong>
                    <small>{theme.description}</small>
                  </div>
                  {selectedTheme === theme.id ? <MaterialIcon name="check_circle" /> : null}
                </button>
              ))}
            </div>
          </section>

          <section className="new-property-card settings-card settings-card-fill">
            <div className="settings-card-head">
              <MaterialIcon name="code" />
              <h2>Integraciones Personalizadas</h2>
            </div>

            <label className="settings-field">
              <span>Snippet Formulario HTML</span>
              <textarea className="glass-input" rows={5} placeholder="<form action='...'>...</form>" />
            </label>

            <label className="settings-field">
              <span>Snippet Chat Widget</span>
              <textarea className="glass-input" rows={5} placeholder="<script src='...'></script>" />
            </label>
          </section>
        </div>
      </div>

      <div className="settings-actions-row">
        <button type="button" className="glass-action-btn">Cancelar</button>
        <button type="button" className="primary-cta">
          <MaterialIcon name="save" />
          Guardar cambios
        </button>
      </div>
    </section>
  )
}

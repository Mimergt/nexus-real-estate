import { useEffect, useMemo, useState } from 'react'
import {
  Bath,
  BedDouble,
  Car,
  ChevronLeft,
  ChevronRight,
  Copy,
  Cpu,
  Dumbbell,
  Flame,
  Globe,
  Briefcase,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  Share2,
  ShieldCheck,
  Send,
  Waves,
  Wine,
  type LucideIcon,
} from 'lucide-react'
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { useNavigate, useParams } from 'react-router-dom'
import { useAgencyData } from '../hooks/useAgencyData'
import { formatCurrency } from '../lib/formatters'
import { buildTemplate1Catalog } from '../lib/template1Data'

type IconName =
  | 'location'
  | 'share'
  | 'facebook'
  | 'x'
  | 'linkedin'
  | 'copy'
  | 'left'
  | 'right'
  | 'bed'
  | 'bath'
  | 'area'
  | 'car'
  | 'mail'
  | 'phone'
  | 'pool'
  | 'wine'
  | 'smart'
  | 'shield'
  | 'gym'
  | 'sauna'
  | 'whatsapp'

const iconMap: Record<IconName, LucideIcon> = {
  location: MapPin,
  share: Share2,
  facebook: Globe,
  x: Send,
  linkedin: Briefcase,
  copy: Copy,
  left: ChevronLeft,
  right: ChevronRight,
  bed: BedDouble,
  bath: Bath,
  area: Ruler,
  car: Car,
  mail: Mail,
  phone: Phone,
  pool: Waves,
  wine: Wine,
  smart: Cpu,
  shield: ShieldCheck,
  gym: Dumbbell,
  sauna: Flame,
  whatsapp: MessageCircle,
}

function UiIcon({ name, className = '' }: { name: IconName; className?: string }) {
  const Icon = iconMap[name]
  return <Icon className={`template1-ui-icon ${className}`.trim()} strokeWidth={2.2} aria-hidden="true" />
}

export function AgencyTemplate1PropertyProfilePage() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const { filteredProperties } = useAgencyData()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const catalog = useMemo(() => buildTemplate1Catalog(filteredProperties), [filteredProperties])
  const selectedProperty = useMemo(() => {
    if (!catalog.length) {
      return null
    }
    return catalog.find((property) => property.slug === slug) ?? catalog.find((property) => property.id === slug) ?? catalog[0]
  }, [catalog, slug])

  useEffect(() => {
    setActivePhotoIndex(0)
  }, [selectedProperty?.id])

  if (!selectedProperty) {
    return (
      <main className="template1-home-screen">
        <section className="template1-profile-empty">
          <h1>No encontramos la propiedad</h1>
          <button type="button" className="template1-pill-btn" onClick={() => navigate('/portal/template-1')}>
            Volver al Home
          </button>
        </section>
      </main>
    )
  }

  const isFavorite = favoriteIds.includes(selectedProperty.id)
  const sideGalleryItems = selectedProperty.photos.slice(1, 5)
  const amenityItems = [
    { label: 'Piscina climatizada', icon: 'pool' as const },
    { label: 'Bodega de vinos', icon: 'wine' as const },
    { label: 'Domotica integral', icon: 'smart' as const },
    { label: 'Seguridad 24/7', icon: 'shield' as const },
    { label: 'Gimnasio privado', icon: 'gym' as const },
    { label: 'Sauna', icon: 'sauna' as const },
  ]

  const priceEntries = [
    { key: 'rent-gtq', label: 'Renta GTQ', value: selectedProperty.pricing.rentGtq, currency: 'GTQ' as const },
    { key: 'rent-usd', label: 'Renta USD', value: selectedProperty.pricing.rentUsd, currency: 'USD' as const },
    { key: 'sale-gtq', label: 'Venta GTQ', value: selectedProperty.pricing.saleGtq, currency: 'GTQ' as const },
    { key: 'sale-usd', label: 'Venta USD', value: selectedProperty.pricing.saleUsd, currency: 'USD' as const },
  ].filter((item) => typeof item.value === 'number')
  const rentPriceEntries = priceEntries.filter((entry) => entry.key.startsWith('rent'))
  const salePriceEntries = priceEntries.filter((entry) => entry.key.startsWith('sale'))

  const propertyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/propiedad/${selectedProperty.slug}/`
    : `/propiedad/${selectedProperty.slug}/`

  const encodedShareUrl = encodeURIComponent(propertyUrl)
  const encodedTitle = encodeURIComponent(selectedProperty.title)

  const shareTargets = [
    { key: 'facebook', label: 'Facebook', icon: FaFacebookF, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}` },
    { key: 'x', label: 'X', icon: FaXTwitter, href: `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedTitle}` },
    { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedinIn, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}` },
  ]

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="template1-home-screen">
      <nav className="template1-top-nav">
        <div className="template1-top-nav-inner">
          <button type="button" className="template1-brand-button" onClick={() => navigate('/portal/template-1')}>
            Estately
          </button>

          <div className="template1-nav-links" aria-label="Tipo de propiedad">
            <button type="button" onClick={() => navigate('/portal/template-1#renta')}>Renta</button>
            <button type="button" onClick={() => navigate('/portal/template-1#venta')}>Venta</button>
          </div>

          <div className="template1-nav-actions">
            <button
              type="button"
              className={`template1-icon-btn template1-favorite-toggle ${isFavorite ? 'active' : ''}`}
              aria-label="Favoritos"
              onClick={() => {
                setFavoriteIds((current) => {
                  if (current.includes(selectedProperty.id)) {
                    return current.filter((item) => item !== selectedProperty.id)
                  }
                  return [...current, selectedProperty.id]
                })
              }}
            >
              <span>Favoritos</span>
              <strong>{favoriteIds.length}</strong>
            </button>
            <a className="template1-pill-btn" href="#contacto">Contactenos</a>
          </div>
        </div>
      </nav>

      <section className="template1-profile-wrap">
        <button type="button" className="template1-back-link" onClick={() => navigate('/portal/template-1/')}>
          <UiIcon name="left" /> Volver a propiedades
        </button>

        <header className="template1-pp-header">
          <div>
            <h1>{selectedProperty.title}</h1>
            <p><UiIcon name="location" /> {selectedProperty.zone}, {selectedProperty.city}</p>
          </div>
          <div className="template1-pp-header-tags">
            {selectedProperty.forRent ? <span className="template1-pp-status rent">En renta</span> : null}
            {selectedProperty.forSale ? <span className="template1-pp-status sale">En venta</span> : null}
            <div className="template1-share-wrap">
              <button
                type="button"
                className="template1-outline-btn"
                onClick={() => setIsShareOpen((current) => !current)}
              >
                <UiIcon name="share" /> Compartir
              </button>

              {isShareOpen ? (
                <div className="template1-share-menu" role="menu" aria-label="Opciones para compartir">
                  {shareTargets.map((target) => (
                    <a key={target.key} href={target.href} target="_blank" rel="noreferrer" className="template1-share-item" aria-label={target.label}>
                      <target.icon className="template1-social-icon" aria-hidden="true" />
                    </a>
                  ))}
                  <button type="button" className="template1-share-item" onClick={handleCopyLink} aria-label="Copiar enlace">
                    <UiIcon name="copy" />
                  </button>
                  {copied ? <span className="template1-share-copied">Copiado</span> : null}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <section className="template1-pp-gallery-layout">
          <div className="template1-pp-main-image">
            <img src={selectedProperty.photos[activePhotoIndex]} alt={selectedProperty.title} />
            <button
              type="button"
              className="template1-profile-photo-nav prev"
              aria-label="Foto anterior"
              onClick={() => setActivePhotoIndex((current) => (current === 0 ? selectedProperty.photos.length - 1 : current - 1))}
            >
              <UiIcon name="left" />
            </button>
            <button
              type="button"
              className="template1-profile-photo-nav next"
              aria-label="Foto siguiente"
              onClick={() => setActivePhotoIndex((current) => (current === selectedProperty.photos.length - 1 ? 0 : current + 1))}
            >
              <UiIcon name="right" />
            </button>
          </div>

          <div className="template1-pp-side-grid">
            {sideGalleryItems.map((photo, index) => (
              <button
                key={`${selectedProperty.id}-grid-${index}`}
                type="button"
                className="template1-pp-grid-image"
                onClick={() => setActivePhotoIndex(index + 1)}
              >
                <img src={photo} alt={`${selectedProperty.title} detalle ${index + 1}`} />
              </button>
            ))}
          </div>
        </section>

        <section className="template1-pp-price-bar">
          <div className="template1-pp-price-top">
            <h2 className="template1-pp-price-title">Precios</h2>
            <a className="template1-pill-btn template1-pill-btn-visit" href="#contacto">Agendar visita</a>
          </div>

          {rentPriceEntries.length ? (
            <div className="template1-pp-price-group rent">
              <div className="template1-pp-price-group-title">Renta</div>
              <div className="template1-pp-price-grid">
                {rentPriceEntries.map((entry) => (
                  <article key={entry.key}>
                    <span>{entry.currency}</span>
                    <strong>{formatCurrency(entry.value ?? 0, entry.currency)}</strong>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {salePriceEntries.length ? (
            <div className="template1-pp-price-group sale">
              <div className="template1-pp-price-group-title">Venta</div>
              <div className="template1-pp-price-grid">
                {salePriceEntries.map((entry) => (
                  <article key={entry.key}>
                    <span>{entry.currency}</span>
                    <strong>{formatCurrency(entry.value ?? 0, entry.currency)}</strong>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <div className="template1-pp-content-grid">
          <div className="template1-pp-left-col">
            <section className="template1-pp-stat-grid">
              <article><UiIcon name="bed" /><strong>{selectedProperty.beds}</strong><span>Habitaciones</span></article>
              <article><UiIcon name="bath" /><strong>{selectedProperty.baths}</strong><span>Banos</span></article>
              <article><UiIcon name="area" /><strong>{selectedProperty.area}</strong><span>Area</span></article>
              <article><UiIcon name="car" /><strong>{selectedProperty.parking}</strong><span>Parqueos</span></article>
            </section>

            <section className="template1-pp-panel">
              <h2>Descripcion</h2>
              <p>{selectedProperty.description}</p>
              <p>
                Propiedad de perfil alto con acabados de lujo, distribucion funcional y una propuesta arquitectonica que integra
                espacios sociales amplios con zonas privadas confortables.
              </p>
            </section>

            <section className="template1-pp-panel">
              <h2>Amenidades</h2>
              <ul className="template1-pp-amenities">
                {amenityItems.map((item) => (
                  <li key={item.label}><UiIcon name={item.icon} /> {item.label}</li>
                ))}
              </ul>
            </section>

            <section className="template1-pp-panel template1-pp-map-panel">
              <h2>Ubicacion</h2>
              <div className="template1-pp-map-shell">
                <iframe
                  title="Mapa de la propiedad"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${selectedProperty.title}, ${selectedProperty.zone}, ${selectedProperty.city}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          </div>

          <aside className="template1-pp-right-col">
            <section className="template1-pp-advisor-card">
              <div className="template1-pp-advisor-row">
                <img
                  className="template1-pp-avatar-photo"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80"
                  alt="Valentina Rojas"
                />
                <div className="template1-pp-advisor-meta">
                  <strong>Valentina Rojas</strong>
                  <span>Senior Advisor</span>
                </div>
              </div>
              <a href="mailto:valentina@estately.gt"><UiIcon name="mail" /> valentina@estately.gt</a>
              <a href="tel:+50255550101"><UiIcon name="phone" /> +502 5555-0101</a>
              <a className="template1-whatsapp-btn" href="https://wa.me/50255550101" target="_blank" rel="noreferrer"><UiIcon name="whatsapp" /> WhatsApp</a>
              <a className="template1-pill-btn template1-pill-btn-visit template1-pp-advisor-cta" href="#contacto">Agendar visita</a>
            </section>

            <section className="template1-pp-panel template1-pp-details-card">
              <h3>Detalle tecnico</h3>
              <dl>
                <div><dt>Tipo</dt><dd>{selectedProperty.type}</dd></div>
                <div><dt>Ano</dt><dd>{selectedProperty.yearBuilt}</dd></div>
                <div><dt>Moneda</dt><dd>{selectedProperty.currency}</dd></div>
                <div><dt>ID</dt><dd>{selectedProperty.id}</dd></div>
              </dl>
            </section>

            <section id="contacto" className="template1-pp-panel template1-pp-contact-form">
              <h3>Solicitar informacion</h3>
              <form>
                <label>
                  <span>Nombre</span>
                  <input type="text" placeholder="Tu nombre" />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" placeholder="tucorreo@email.com" />
                </label>
                <label>
                  <span>Mensaje</span>
                  <textarea rows={4} placeholder="Quiero mas informacion de esta propiedad..." />
                </label>
                <button type="button" className="template1-pill-btn template1-pill-btn-visit">Enviar solicitud</button>
              </form>
            </section>
          </aside>
        </div>
      </section>

      <footer className="template1-footer template1-footer-minimal">
        <div className="template1-footer-copy">
          Creado con NEXUS.epic.gt - 2026
        </div>
      </footer>
    </main>
  )
}

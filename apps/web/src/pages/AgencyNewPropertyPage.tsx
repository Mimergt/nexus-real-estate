import { useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { MaterialIcon, SearchIcon } from '../components/icons'
import type { NewPropertyDraft, PropertyOfferType } from '../lib/types'
import {
  Armchair,
  Bath,
  Bike,
  Building2,
  Camera,
  CarFront,
  Clapperboard,
  Dumbbell,
  Fan,
  FerrisWheel,
  Flame,
  Flower2,
  Home,
  Laptop,
  LayoutGrid,
  LocateFixed,
  MapPinned,
  Mountain,
  PawPrint,
  ParkingSquare,
  Shield,
  Sparkles,
  Sprout,
  Sofa,
  SunMedium,
  Trees,
  Tv2,
  Waves,
  Wifi,
  Wine,
  ChefHat,
} from 'lucide-react'

type AmenityOption = {
  id: string
  label: string
  icon: string
}

const baseAmenityOptions: AmenityOption[] = [
  { id: 'pool', label: 'Piscina infinita', icon: 'pool' },
  { id: 'gym', label: 'Gimnasio privado', icon: 'fitness_center' },
  { id: 'security', label: 'Seguridad 24/7', icon: 'shield' },
  { id: 'garage', label: 'Garaje (3 vehículos)', icon: 'garage' },
  { id: 'terrace', label: 'Terraza solárium', icon: 'deck' },
  { id: 'wine', label: 'Cava de vinos', icon: 'wine_bar' },
  { id: 'bbq', label: 'Área de barbacoa', icon: 'outdoor_grill' },
  { id: 'cinema', label: 'Sala de cine', icon: 'movie' },
  { id: 'spa', label: 'Spa', icon: 'spa' },
]

const amenityIconOptions = [
  { key: 'waves', label: 'Piscina' },
  { key: 'dumbbell', label: 'Gimnasio' },
  { key: 'shield', label: 'Seguridad' },
  { key: 'garage', label: 'Garaje' },
  { key: 'sun', label: 'Terraza' },
  { key: 'wine', label: 'Vinos' },
  { key: 'flame', label: 'Barbacoa' },
  { key: 'film', label: 'Cine' },
  { key: 'bath', label: 'Spa' },
  { key: 'paw', label: 'Mascotas' },
  { key: 'parking', label: 'Parqueo' },
  { key: 'trees', label: 'Jardín' },
  { key: 'wifi', label: 'Wi‑Fi' },
  { key: 'tv', label: 'TV' },
  { key: 'camera', label: 'Cámaras' },
  { key: 'air', label: 'Aire' },
  { key: 'bike', label: 'Bici' },
  { key: 'sprout', label: 'Área verde' },
  { key: 'chef', label: 'Chef' },
  { key: 'mountain', label: 'Vista' },
  { key: 'sofa', label: 'Sala' },
  { key: 'home', label: 'Hogar' },
  { key: 'apartment', label: 'Apartamento' },
  { key: 'building', label: 'Edificio' },
  { key: 'map', label: 'Ubicación' },
  { key: 'sparkles', label: 'Premium' },
  { key: 'layout', label: 'Layout' },
  { key: 'armchair', label: 'Confort' },
  { key: 'laptop', label: 'Home office' },
  { key: 'flower', label: 'Patio' },
  { key: 'ferris', label: 'Especial' },
]

function RemoveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M18 6.41 17.59 6 12 11.59 6.41 6 6 6.41 11.59 12 6 17.59 6.41 18 12 12.41 17.59 18 18 17.59 12.41 12 18 6.41Z" />
    </svg>
  )
}

function AmenityIcon({ name }: { name: string }) {
  const iconMap: Record<string, ReactNode> = {
    waves: <Waves />,
    dumbbell: <Dumbbell />,
    shield: <Shield />,
    garage: <CarFront />,
    sun: <SunMedium />,
    wine: <Wine />,
    flame: <Flame />,
    film: <Clapperboard />,
    bath: <Bath />,
    paw: <PawPrint />,
    parking: <ParkingSquare />,
    trees: <Trees />,
    wifi: <Wifi />,
    tv: <Tv2 />,
    camera: <Camera />,
    air: <Fan />,
    bike: <Bike />,
    sprout: <Sprout />,
    chef: <ChefHat />,
    mountain: <Mountain />,
    sofa: <Sofa />,
    home: <Home />,
    apartment: <Building2 />,
    building: <Building2 />,
    map: <MapPinned />,
    sparkles: <Sparkles />,
    layout: <LayoutGrid />,
    armchair: <Armchair />,
    laptop: <Laptop />,
    flower: <Flower2 />,
    ferris: <FerrisWheel />,
  }

  return iconMap[name] ?? <LocateFixed />
}

const guatemalaDepartments = [
  'Guatemala',
  'El Progreso',
  'Sacatepéquez',
  'Chimaltenango',
  'Escuintla',
  'Santa Rosa',
  'Sololá',
  'Totonicapán',
  'Quetzaltenango',
  'Suchitepéquez',
  'Retalhuleu',
  'San Marcos',
  'Huehuetenango',
  'Quiché',
  'Baja Verapaz',
  'Alta Verapaz',
  'Petén',
  'Izabal',
  'Zacapa',
  'Chiquimula',
  'Jalapa',
  'Jutiapa',
]

const municipalitiesByDepartment: Record<string, string[]> = {
  Guatemala: [
    'Guatemala',
    'Santa Catarina Pinula',
    'San José Pinula',
    'San José del Golfo',
    'Palencia',
    'Chinautla',
    'San Pedro Ayampuc',
    'Mixco',
    'San Pedro Sacatepéquez',
    'San Juan Sacatepéquez',
    'San Raymundo',
    'Chuarrancho',
    'Fraijanes',
    'Amatitlán',
    'Villa Nueva',
    'Villa Canales',
    'San Miguel Petapa',
  ],
  Sacatepéquez: [
    'Antigua Guatemala',
    'Jocotenango',
    'Pastores',
    'Sumpango',
    'Santiago Sacatepéquez',
    'San Bartolomé Milpas Altas',
    'San Lucas Sacatepéquez',
    'Santa Lucía Milpas Altas',
    'Magdalena Milpas Altas',
    'Santa María de Jesús',
    'Ciudad Vieja',
    'San Miguel Dueñas',
    'Alotenango',
    'San Antonio Aguas Calientes',
    'Santa Catarina Barahona',
  ],
  Escuintla: [
    'Escuintla',
    'Santa Lucía Cotzumalguapa',
    'La Democracia',
    'Siquinalá',
    'Masagua',
    'Tiquisate',
    'La Gomera',
    'Guanagazapa',
    'San José',
    'Iztapa',
    'Palín',
    'San Vicente Pacaya',
    'Nueva Concepción',
  ],
}

const initialDraft: NewPropertyDraft = {
  title: '',
  description: '',
  tags: ['Lujo', 'Vista al mar'],
  offerType: 'venta',
  salePriceUsd: null,
  salePriceGtq: 325000,
  rentPriceUsd: null,
  rentPriceGtq: null,
  department: 'Guatemala',
  municipality: 'Guatemala',
  addressLine: '',
  googleMapsUrl: '',
  latitude: '',
  longitude: '',
  amenities: ['pool', 'security'],
  mediaUrls: [],
  customFormEnabled: false,
  customFormHtml: '',
}

export function AgencyNewPropertyPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [draft, setDraft] = useState<NewPropertyDraft>(initialDraft)
  const [newTag, setNewTag] = useState('')
  const [amenityCatalog, setAmenityCatalog] = useState<AmenityOption[]>(baseAmenityOptions)
  const [amenitySearch, setAmenitySearch] = useState('')
  const [isAmenityCreatorOpen, setIsAmenityCreatorOpen] = useState(false)
  const [newAmenityName, setNewAmenityName] = useState('')
  const [newAmenityIcon, setNewAmenityIcon] = useState('waves')
  const [publishErrors, setPublishErrors] = useState<string[]>([])
  const [publishMessage, setPublishMessage] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const municipalityOptions = municipalitiesByDepartment[draft.department] ?? []

  const hasValidPricing =
    (draft.offerType === 'venta' && ((draft.salePriceUsd ?? 0) > 0 || (draft.salePriceGtq ?? 0) > 0)) ||
    (draft.offerType === 'renta' && ((draft.rentPriceUsd ?? 0) > 0 || (draft.rentPriceGtq ?? 0) > 0)) ||
    (draft.offerType === 'ambos' &&
      ((draft.salePriceUsd ?? 0) > 0 || (draft.salePriceGtq ?? 0) > 0) &&
      ((draft.rentPriceUsd ?? 0) > 0 || (draft.rentPriceGtq ?? 0) > 0))

  const hasMedia = draft.mediaUrls.length > 0

  const formatPrice = (price: number | null, currencyLabel: string) => {
    if (!price) {
      return 'No definido'
    }

    return `${currencyLabel}${price.toLocaleString()}`
  }

  const visibleAmenities = useMemo(() => {
    const normalized = amenitySearch.trim().toLowerCase()
    if (!normalized) {
      return amenityCatalog
    }

    return amenityCatalog.filter((amenity) => amenity.label.toLowerCase().includes(normalized))
  }, [amenityCatalog, amenitySearch])

  const handlePublish = () => {
    const errors: string[] = []

    if (!draft.title.trim()) {
      errors.push('El título es obligatorio para publicar.')
    }

    if (!hasValidPricing) {
      errors.push('Debes completar los precios requeridos según el tipo de oferta.')
    }

    if (!hasMedia) {
      errors.push('Debes agregar al menos una imagen antes de publicar.')
    }

    if (errors.length > 0) {
      setPublishErrors(errors)
      setPublishMessage('')
      return
    }

    setPublishErrors([])
    setPublishMessage('Propiedad validada correctamente. Lista para publicación en backend.')
  }

  const addAmenity = () => {
    const normalizedName = newAmenityName.trim()
    if (!normalizedName) {
      return
    }

    const amenityId = normalizedName.toLowerCase().replace(/\s+/g, '-')
    if (amenityCatalog.some((amenity) => amenity.id === amenityId)) {
      return
    }

    const nextAmenity: AmenityOption = {
      id: amenityId,
      label: normalizedName,
      icon: newAmenityIcon,
    }

    setAmenityCatalog((current) => [nextAmenity, ...current])
    setDraft((current) => ({ ...current, amenities: [amenityId, ...current.amenities] }))
    setNewAmenityName('')
    setIsAmenityCreatorOpen(false)
  }

  const addLocalImage = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return
    }

    const nextUrls = Array.from(files)
      .slice(0, 20)
      .map((file) => URL.createObjectURL(file))

    setDraft((current) => ({
      ...current,
      mediaUrls: [...current.mediaUrls, ...nextUrls].slice(0, 20),
    }))
  }

  const removeImage = (imageUrl: string) => {
    setDraft((current) => ({
      ...current,
      mediaUrls: current.mediaUrls.filter((item) => item !== imageUrl),
    }))
  }

  const toggleAmenity = (amenityId: string) => {
    setDraft((current) => {
      if (current.amenities.includes(amenityId)) {
        return { ...current, amenities: current.amenities.filter((id) => id !== amenityId) }
      }

      return { ...current, amenities: [...current.amenities, amenityId] }
    })
  }

  const removeTag = (tag: string) => {
    setDraft((current) => ({ ...current, tags: current.tags.filter((item) => item !== tag) }))
  }

  const addTag = () => {
    const normalized = newTag.trim()
    if (!normalized) {
      return
    }

    setDraft((current) => {
      if (current.tags.includes(normalized)) {
        return current
      }

      return { ...current, tags: [...current.tags, normalized] }
    })
    setNewTag('')
  }

  const setOfferType = (offerType: PropertyOfferType) => {
    setDraft((current) => ({ ...current, offerType }))
  }

  return (
    <section className="new-property-view">
      <div className="new-property-header">
        <div>
          <h1>Nueva propiedad</h1>
          <p>Completa la información para publicar una propiedad en el catálogo de tu agencia.</p>
        </div>

        <div className="new-property-header-actions">
          <button type="button" className="glass-action-btn" onClick={() => setIsPreviewOpen(true)}>Vista previa</button>
          <button type="button" className="glass-action-btn" onClick={() => navigate('/agency/propiedades/')}>Guardar borrador</button>
          <button type="button" className="primary-cta new-property-primary" onClick={handlePublish}>Publicar propiedad</button>
        </div>
      </div>

      {publishErrors.length > 0 ? (
        <div className="publish-errors-card" role="alert">
          <strong>Faltan datos para publicar:</strong>
          <ul>
            {publishErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {publishMessage ? <div className="publish-success-card">{publishMessage}</div> : null}

      <div className="new-property-grid">
        <div className="new-property-main-col">
          <section className="new-property-card">
            <div className="new-property-card-title">
              <span className="icon-pill"><MaterialIcon name="description" /></span>
              <h2>Información principal</h2>
            </div>

            <div className="new-property-form-grid">
              <label>
                <span>Título de la propiedad</span>
                <input
                  className="glass-input"
                  placeholder="Ej: Villa lujosa frente al mar"
                  value={draft.title}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                />
              </label>

              <label>
                <span>Descripción detallada</span>
                <textarea
                  className="glass-input"
                  rows={4}
                  placeholder="Describe acabados, distribución y puntos clave del inmueble"
                  value={draft.description}
                  onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                />
              </label>

              <label>
                <span>Etiquetas</span>
                <div className="tag-editor glass-input">
                  {draft.tags.map((tag) => (
                    <button key={tag} type="button" className="tag-pill" onClick={() => removeTag(tag)}>
                      {tag}
                      <RemoveIcon />
                    </button>
                  ))}
                  <input
                    value={newTag}
                    onChange={(event) => setNewTag(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder="Añadir..."
                  />
                  <button type="button" className="tag-add-btn" onClick={addTag}>Agregar</button>
                </div>
              </label>
            </div>
          </section>

          <section className="new-property-card">
            <div className="new-property-card-title">
              <span className="icon-pill"><MaterialIcon name="sell" /></span>
              <h2>Oferta y precios</h2>
            </div>

            <div className="offer-type-grid">
              {(['venta', 'renta', 'ambos'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`offer-type-btn ${draft.offerType === type ? 'active' : ''}`}
                  onClick={() => setOfferType(type)}
                >
                  {type === 'venta' ? 'Venta' : type === 'renta' ? 'Renta' : 'Ambos'}
                </button>
              ))}
            </div>

            <div className="new-property-two-col">
              <label className="price-block">
                <span>Precio de venta</span>
                <div className="price-stack">
                  <label className="price-field">
                    <span>Dólares</span>
                    <input
                      className="glass-input"
                      type="number"
                      placeholder="$ 0.00"
                      value={draft.salePriceUsd ?? ''}
                      onChange={(event) => setDraft((current) => ({
                        ...current,
                        salePriceUsd: event.target.value ? Number(event.target.value) : null,
                      }))}
                    />
                  </label>
                  <label className="price-field">
                    <span>Quetzales</span>
                    <input
                      className="glass-input"
                      type="number"
                      placeholder="Q 0.00"
                      value={draft.salePriceGtq ?? ''}
                      onChange={(event) => setDraft((current) => ({
                        ...current,
                        salePriceGtq: event.target.value ? Number(event.target.value) : null,
                      }))}
                    />
                  </label>
                </div>
              </label>

              <label className="price-block">
                <span>Precio de renta</span>
                <div className="price-stack">
                  <label className="price-field">
                    <span>Dólares</span>
                    <input
                      className="glass-input"
                      type="number"
                      placeholder="$ 0.00"
                      value={draft.rentPriceUsd ?? ''}
                      onChange={(event) => setDraft((current) => ({
                        ...current,
                        rentPriceUsd: event.target.value ? Number(event.target.value) : null,
                      }))}
                    />
                  </label>
                  <label className="price-field">
                    <span>Quetzales</span>
                    <input
                      className="glass-input"
                      type="number"
                      placeholder="Q 0.00"
                      value={draft.rentPriceGtq ?? ''}
                      onChange={(event) => setDraft((current) => ({
                        ...current,
                        rentPriceGtq: event.target.value ? Number(event.target.value) : null,
                      }))}
                    />
                  </label>
                </div>
              </label>
            </div>
          </section>

          <section className="new-property-card">
            <div className="new-property-card-title">
              <span className="icon-pill"><MaterialIcon name="photo_library" /></span>
              <h2>Multimedia</h2>
            </div>

            <div className="upload-dropzone">
              <MaterialIcon name="cloud_upload" className="upload-icon" />
              <p>Arrastra imágenes aquí o haz clic para seleccionar</p>
              <small>Máx. 20 fotos (20MB)</small>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden-file-input"
                onChange={(event) => addLocalImage(event.target.files)}
              />
              <button type="button" className="glass-action-btn" onClick={() => fileInputRef.current?.click()}>Subir archivos</button>
            </div>

            <div className="uploaded-images-grid">
              {draft.mediaUrls.map((mediaUrl, index) => (
                <div key={mediaUrl} className="uploaded-image-card">
                  <img src={mediaUrl} alt={`Imagen ${index + 1}`} />
                  <button type="button" onClick={() => removeImage(mediaUrl)}>
                    <RemoveIcon />
                  </button>
                </div>
              ))}

              {draft.mediaUrls.length === 0 ? (
                <div className="uploaded-image-empty">No hay imágenes cargadas</div>
              ) : null}
            </div>
          </section>
        </div>

        <div className="new-property-side-col">
          <section className="new-property-card">
            <div className="new-property-card-title">
              <span className="icon-pill"><MaterialIcon name="location_on" /></span>
              <h2>Ubicación</h2>
            </div>

            <div className="new-property-form-grid">
              <div className="new-property-two-col">
                <label>
                  <span>Departamento</span>
                  <select
                    className="glass-input select-input"
                    value={draft.department}
                    onChange={(event) => {
                      const department = event.target.value
                      const nextMunicipality = municipalitiesByDepartment[department]?.[0] ?? ''
                      setDraft((current) => ({ ...current, department, municipality: nextMunicipality }))
                    }}
                  >
                    {guatemalaDepartments.map((department) => (
                      <option key={department} value={department}>{department}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Municipio</span>
                  <select
                    className="glass-input select-input"
                    value={draft.municipality}
                    onChange={(event) => setDraft((current) => ({ ...current, municipality: event.target.value }))}
                    disabled={municipalityOptions.length === 0}
                  >
                    {municipalityOptions.length > 0 ? (
                      municipalityOptions.map((municipality) => (
                        <option key={municipality} value={municipality}>{municipality}</option>
                      ))
                    ) : (
                      <option value="">Selecciona un departamento primero</option>
                    )}
                  </select>
                </label>
              </div>

              <label>
                <span>Dirección en texto plano</span>
                <input
                  className="glass-input"
                  placeholder="Zona, calle, número, referencia"
                  value={draft.addressLine}
                  onChange={(event) => setDraft((current) => ({ ...current, addressLine: event.target.value }))}
                />
              </label>

              <label>
                <span>Enlace de Google Maps</span>
                <input
                  className="glass-input"
                  placeholder="https://maps.google.com/..."
                  value={draft.googleMapsUrl}
                  onChange={(event) => setDraft((current) => ({ ...current, googleMapsUrl: event.target.value }))}
                />
              </label>

              <div className="new-property-two-col">
                <label>
                  <span>Latitud</span>
                  <input
                    className="glass-input"
                    placeholder="14.6349"
                    value={draft.latitude}
                    onChange={(event) => setDraft((current) => ({ ...current, latitude: event.target.value }))}
                  />
                </label>

                <label>
                  <span>Longitud</span>
                  <input
                    className="glass-input"
                    placeholder="-90.5069"
                    value={draft.longitude}
                    onChange={(event) => setDraft((current) => ({ ...current, longitude: event.target.value }))}
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="new-property-card">
            <div className="new-property-card-title">
              <span className="icon-pill"><MaterialIcon name="hotel_class" /></span>
              <h2>Amenidades</h2>
            </div>

            <label className="amenity-search-label">
              <span>Buscar amenidad</span>
              <span className="amenity-search-shell">
                <SearchIcon />
                <input
                  className="amenity-search-input"
                  placeholder="Buscar..."
                  value={amenitySearch}
                  onChange={(event) => setAmenitySearch(event.target.value)}
                />
              </span>
            </label>

            <div className="amenities-list">
              {visibleAmenities.map((amenity) => (
                <label key={amenity.id} className="amenity-item">
                  <input
                    type="checkbox"
                    checked={draft.amenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                  />
                  <AmenityIcon name={amenity.icon} />
                  <span>{amenity.label}</span>
                </label>
              ))}
            </div>

            <button type="button" className="glass-action-btn amenity-add-toggle" onClick={() => setIsAmenityCreatorOpen((current) => !current)}>
              <MaterialIcon name="add" />
              Añadir amenidad
            </button>

            {isAmenityCreatorOpen ? (
              <div className="amenity-creator">
                <label>
                  <span>Selecciona un ícono</span>
                  <div className="amenity-icon-picker amenity-icon-picker-scroll">
                    {amenityIconOptions.map((iconOption) => (
                      <button
                        key={iconOption.key}
                        type="button"
                        className={`amenity-icon-option ${newAmenityIcon === iconOption.key ? 'active' : ''}`}
                        onClick={() => setNewAmenityIcon(iconOption.key)}
                        aria-pressed={newAmenityIcon === iconOption.key}
                        aria-label={iconOption.label}
                        title={iconOption.label}
                      >
                        <AmenityIcon name={iconOption.key} />
                      </button>
                    ))}
                  </div>
                </label>

                <label>
                  <span>Nombre de amenidad</span>
                  <input
                    className="glass-input"
                    placeholder="Ej: Sala de juegos"
                    value={newAmenityName}
                    onChange={(event) => setNewAmenityName(event.target.value)}
                  />
                </label>

                <button type="button" className="primary-cta amenity-save-btn" onClick={addAmenity}>Guardar amenidad</button>
              </div>
            ) : null}
          </section>

          <section className="new-property-card">
            <div className="new-property-card-title">
              <span className="icon-pill"><MaterialIcon name="dynamic_form" /></span>
              <h2>Formulario</h2>
            </div>

            <label className="form-toggle-row">
              <input
                type="checkbox"
                checked={draft.customFormEnabled}
                onChange={(event) => setDraft((current) => ({ ...current, customFormEnabled: event.target.checked }))}
              />
              <span>Formulario personalizado</span>
            </label>

            {draft.customFormEnabled ? (
              <label className="custom-form-editor">
                <span>Pegar HTML del formulario</span>
                <textarea
                  className="glass-input"
                  rows={5}
                  placeholder="<form>...</form>"
                  value={draft.customFormHtml}
                  onChange={(event) => setDraft((current) => ({ ...current, customFormHtml: event.target.value }))}
                />
              </label>
            ) : null}
          </section>

        </div>
      </div>

      {isPreviewOpen ? (
        <div className="preview-modal-backdrop" role="dialog" aria-modal="true">
          <div className="preview-modal">
            <div className="preview-modal-head">
              <h3>Vista previa de propiedad</h3>
              <button type="button" onClick={() => setIsPreviewOpen(false)}>
                <RemoveIcon />
              </button>
            </div>

            <div className="preview-modal-content">
              <h4>{draft.title.trim() || 'Sin título'}</h4>
              <p>{draft.description.trim() || 'Sin descripción aún.'}</p>
              <p><strong>Departamento:</strong> {draft.department || 'No definido'}</p>
              <p><strong>Municipio:</strong> {draft.municipality || 'No definido'}</p>
              <p><strong>Dirección:</strong> {draft.addressLine || 'No definida'}</p>
              <p><strong>Oferta:</strong> {draft.offerType}</p>
              <p><strong>Venta USD:</strong> {formatPrice(draft.salePriceUsd, '$ ')}</p>
              <p><strong>Venta Q:</strong> {formatPrice(draft.salePriceGtq, 'Q ')}</p>
              <p><strong>Renta USD:</strong> {formatPrice(draft.rentPriceUsd, '$ ')}</p>
              <p><strong>Renta Q:</strong> {formatPrice(draft.rentPriceGtq, 'Q ')}</p>
              <p><strong>Imágenes:</strong> {draft.mediaUrls.length}</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

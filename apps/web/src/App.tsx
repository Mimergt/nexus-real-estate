import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { DragEvent } from 'react'
import './App.css'

type InformationalAgent = {
  id: string
  agency_id: string
  name: string
  phone: string | null
  email: string | null
  photo: string | null
  bio: string | null
}

type Property = {
  id: string
  agency_id: string
  agent_id: string | null
  title: string
  slug: string
  listing_type: string
  property_type: string
  city: string
  zone: string
  currency: string
  price: number
  featured: boolean
  published: boolean
}

type PropertyImage = {
  id: string
  property_id: string
  agency_id: string
  object_key: string
  image_url: string
  content_type: string | null
  file_size_bytes: number | null
  is_primary: boolean
  sort_order: number
}

const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787'
const demoAgencyId = '11111111-1111-4111-8111-111111111111'

const request = async <T,>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      'x-agency-id': demoAgencyId,
      ...(options?.headers ?? {}),
    },
  })

  const json = await response.json()

  if (!response.ok || json?.ok === false) {
    const errorMessage = json?.error ?? `request_failed_${response.status}`
    throw new Error(errorMessage)
  }

  return json as T
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      resolve(result)
    }

    reader.onerror = () => reject(new Error('file_read_error'))
    reader.readAsDataURL(file)
  })

function App() {
  const [agents, setAgents] = useState<InformationalAgent[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([])
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [status, setStatus] = useState('Panel listo')
  const [loading, setLoading] = useState(false)
  const [dragImageId, setDragImageId] = useState<string | null>(null)
  const [dragOverImageId, setDragOverImageId] = useState<string | null>(null)

  const [agentName, setAgentName] = useState('')
  const [agentPhone, setAgentPhone] = useState('')
  const [agentEmail, setAgentEmail] = useState('')

  const selectedProperty = useMemo(
    () => properties.find((item) => item.id === selectedPropertyId) ?? null,
    [properties, selectedPropertyId],
  )

  const loadAgents = async () => {
    const data = await request<{ ok: true; items: InformationalAgent[] }>('/v1/informational-agents')
    setAgents(data.items)
  }

  const loadProperties = async () => {
    const data = await request<{ ok: true; items: Property[] }>('/v1/properties')
    setProperties(data.items)

    if (!selectedPropertyId && data.items.length > 0) {
      setSelectedPropertyId(data.items[0].id)
    }
  }

  const loadImages = async (propertyId: string) => {
    if (!propertyId) {
      setPropertyImages([])
      return
    }

    const data = await request<{ ok: true; items: PropertyImage[] }>(`/v1/properties/${propertyId}/images`)
    setPropertyImages(data.items)
  }

  const refreshAll = async () => {
    setLoading(true)

    try {
      await Promise.all([loadAgents(), loadProperties()])
      setStatus('Datos sincronizados')
    } catch (error) {
      setStatus(`Error de carga: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refreshAll()
  }, [])

  useEffect(() => {
    void loadImages(selectedPropertyId)
  }, [selectedPropertyId])

  const onCreateAgent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!agentName.trim()) {
      setStatus('Nombre de agente requerido')
      return
    }

    setLoading(true)

    try {
      await request('/v1/informational-agents', {
        method: 'POST',
        body: JSON.stringify({
          name: agentName.trim(),
          phone: agentPhone.trim() || null,
          email: agentEmail.trim() || null,
          photo: null,
          bio: null,
        }),
      })

      setAgentName('')
      setAgentPhone('')
      setAgentEmail('')
      await loadAgents()
      setStatus('Agente creado')
    } catch (error) {
      setStatus(`Error creando agente: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const onAttachAgentToProperty = async (agentId: string) => {
    if (!selectedPropertyId) {
      setStatus('Selecciona una propiedad')
      return
    }

    setLoading(true)

    try {
      await request(`/v1/properties/${selectedPropertyId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          agent_id: agentId || null,
        }),
      })

      await loadProperties()
      setStatus('Agente asignado a propiedad')
    } catch (error) {
      setStatus(`Error asignando agente: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const onUploadImage = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedPropertyId) {
      return
    }

    setLoading(true)

    try {
      const filesArray = Array.from(files)

      for (const [index, file] of filesArray.entries()) {
        const base64 = await toBase64(file)

        await request(`/v1/properties/${selectedPropertyId}/images`, {
          method: 'POST',
          body: JSON.stringify({
            filename: file.name,
            content_type: file.type || 'application/octet-stream',
            data_base64: base64,
            is_primary: propertyImages.length === 0 && index === 0,
          }),
        })
      }

      await loadImages(selectedPropertyId)
      setStatus('Imagenes cargadas en R2')
    } catch (error) {
      setStatus(`Error subiendo imagenes: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const onSetPrimaryImage = async (imageId: string) => {
    if (!selectedPropertyId) {
      return
    }

    setLoading(true)

    try {
      await request(`/v1/properties/${selectedPropertyId}/images/${imageId}/primary`, {
        method: 'PATCH',
      })

      await loadImages(selectedPropertyId)
      setStatus('Imagen principal actualizada')
    } catch (error) {
      setStatus(`Error marcando principal: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const onDeleteImage = async (imageId: string) => {
    if (!selectedPropertyId) {
      return
    }

    setLoading(true)

    try {
      await request(`/v1/properties/${selectedPropertyId}/images/${imageId}`, {
        method: 'DELETE',
      })

      await loadImages(selectedPropertyId)
      setStatus('Imagen eliminada')
    } catch (error) {
      setStatus(`Error eliminando imagen: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const onMoveImage = async (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction

    if (nextIndex < 0 || nextIndex >= propertyImages.length || !selectedPropertyId) {
      return
    }

    const reordered = [...propertyImages]
    const temp = reordered[index]
    reordered[index] = reordered[nextIndex]
    reordered[nextIndex] = temp

    setLoading(true)

    try {
      await request(`/v1/properties/${selectedPropertyId}/images/reorder`, {
        method: 'PATCH',
        body: JSON.stringify({
          image_ids: reordered.map((item) => item.id),
        }),
      })

      await loadImages(selectedPropertyId)
      setStatus('Galeria reordenada')
    } catch (error) {
      setStatus(`Error reordenando: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const onReorderImages = async (orderedImageIds: string[]) => {
    if (!selectedPropertyId) {
      return
    }

    setLoading(true)

    try {
      await request(`/v1/properties/${selectedPropertyId}/images/reorder`, {
        method: 'PATCH',
        body: JSON.stringify({
          image_ids: orderedImageIds,
        }),
      })

      await loadImages(selectedPropertyId)
      setStatus('Galeria reordenada')
    } catch (error) {
      setStatus(`Error reordenando: ${(error as Error).message}`)
    } finally {
      setLoading(false)
      setDragImageId(null)
      setDragOverImageId(null)
    }
  }

  const onDragStartImage = (imageId: string) => {
    setDragImageId(imageId)
  }

  const onDragOverImage = (event: DragEvent<HTMLElement>, imageId: string) => {
    event.preventDefault()
    if (dragImageId && dragImageId !== imageId) {
      setDragOverImageId(imageId)
    }
  }

  const onDropImage = async (imageId: string) => {
    if (!dragImageId || dragImageId === imageId) {
      setDragImageId(null)
      setDragOverImageId(null)
      return
    }

    const fromIndex = propertyImages.findIndex((item) => item.id === dragImageId)
    const toIndex = propertyImages.findIndex((item) => item.id === imageId)

    if (fromIndex < 0 || toIndex < 0) {
      setDragImageId(null)
      setDragOverImageId(null)
      return
    }

    const reordered = [...propertyImages]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)

    await onReorderImages(reordered.map((item) => item.id))
  }

  const onDragEndImage = () => {
    setDragImageId(null)
    setDragOverImageId(null)
  }

  return (
    <main className="panel-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">NEXUS RE</p>
          <h1>Panel Operativo MVP</h1>
        </div>
        <button type="button" onClick={() => void refreshAll()} disabled={loading}>
          {loading ? 'Sincronizando...' : 'Refrescar'}
        </button>
      </header>

      <section className="status-row">
        <p>{status}</p>
      </section>

      <section className="grid-layout">
        <article className="card">
          <h2>Agentes Informativos</h2>

          <form className="stack" onSubmit={onCreateAgent}>
            <input
              placeholder="Nombre"
              value={agentName}
              onChange={(event) => setAgentName(event.target.value)}
            />
            <input
              placeholder="Telefono"
              value={agentPhone}
              onChange={(event) => setAgentPhone(event.target.value)}
            />
            <input
              placeholder="Email"
              value={agentEmail}
              onChange={(event) => setAgentEmail(event.target.value)}
            />
            <button type="submit" disabled={loading}>Crear agente</button>
          </form>

          <ul className="list">
            {agents.map((agent) => (
              <li key={agent.id}>
                <div>
                  <strong>{agent.name}</strong>
                  <small>{agent.email ?? 'Sin email'}</small>
                </div>
                <button
                  type="button"
                  onClick={() => void onAttachAgentToProperty(agent.id)}
                  disabled={!selectedPropertyId || loading}
                >
                  Asignar
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Propiedades</h2>

          <label className="stack">
            <span>Selecciona propiedad</span>
            <select
              value={selectedPropertyId}
              onChange={(event) => setSelectedPropertyId(event.target.value)}
            >
              <option value="">Selecciona...</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </select>
          </label>

          {selectedProperty ? (
            <div className="property-meta">
              <p>
                <strong>Ubicacion:</strong> {selectedProperty.city}, {selectedProperty.zone}
              </p>
              <p>
                <strong>Precio:</strong> {selectedProperty.currency} {selectedProperty.price}
              </p>
              <p>
                <strong>Agente:</strong>{' '}
                {agents.find((item) => item.id === selectedProperty.agent_id)?.name ?? 'Sin asignar'}
              </p>
            </div>
          ) : null}
        </article>
      </section>

      <section className="card">
        <h2>Galeria de Propiedad</h2>
        <p className="drag-help">Arrastra y suelta tarjetas para reordenar la galeria.</p>

        <label className="upload-zone">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => void onUploadImage(event.target.files)}
            disabled={!selectedPropertyId || loading}
          />
          <span>Subir imagenes (multiple)</span>
        </label>

        <ul className="image-grid">
          {propertyImages.map((image, index) => (
            <li
              key={image.id}
              className={`image-card${dragImageId === image.id ? ' dragging' : ''}${
                dragOverImageId === image.id ? ' drag-over' : ''
              }`}
              draggable={!loading}
              onDragStart={() => onDragStartImage(image.id)}
              onDragOver={(event) => onDragOverImage(event, image.id)}
              onDrop={() => void onDropImage(image.id)}
              onDragEnd={onDragEndImage}
            >
              <img src={image.image_url} alt="Preview" />
              <div className="image-info">
                <small>{image.object_key.split('/').pop()}</small>
                <small>{image.file_size_bytes ?? 0} bytes</small>
              </div>
              <div className="image-actions">
                <button
                  type="button"
                  onClick={() => void onMoveImage(index, -1)}
                  disabled={index === 0 || loading}
                >
                  Subir
                </button>
                <button
                  type="button"
                  onClick={() => void onMoveImage(index, 1)}
                  disabled={index === propertyImages.length - 1 || loading}
                >
                  Bajar
                </button>
                <button
                  type="button"
                  onClick={() => void onSetPrimaryImage(image.id)}
                  disabled={image.is_primary || loading}
                >
                  {image.is_primary ? 'Principal' : 'Marcar principal'}
                </button>
                <button type="button" onClick={() => void onDeleteImage(image.id)} disabled={loading}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App

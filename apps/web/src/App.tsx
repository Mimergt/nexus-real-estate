import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AgencyLayout } from './components/AgencyLayout'
import { AgencyDashboardPage } from './pages/AgencyDashboardPage'
import { AgencyNewPropertyPage } from './pages/AgencyNewPropertyPage'
import { AgencyPropertiesPage } from './pages/AgencyPropertiesPage'
import { AgencySettingsPage } from './pages/AgencySettingsPage'
import { AgencyTemplate1HomePage } from './pages/AgencyTemplate1HomePage'
import { AgencyTemplate1PropertyProfilePage } from './pages/AgencyTemplate1PropertyProfilePage'
import { SuperAdminPage } from './pages/SuperAdminPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SuperAdminPage />} />
      <Route path="/portal/template-1" element={<AgencyTemplate1HomePage />} />
      <Route path="/propiedad/:slug" element={<AgencyTemplate1PropertyProfilePage />} />
      <Route path="/agency" element={<AgencyLayout />}>
        <Route index element={<AgencyDashboardPage />} />
        <Route path="propiedades" element={<AgencyPropertiesPage />} />
        <Route path="nueva-propiedad" element={<AgencyNewPropertyPage />} />
        <Route path="configuracion" element={<AgencySettingsPage />} />
        <Route path="*" element={<Navigate to="/agency/" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'

// Layouts
import PatientLayout from './components/PatientLayout'
import ProLayout from './components/ProLayout'

// Auth pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Patient pages
import PatientHome from './pages/patient/PatientHome'
import SwipeScreen from './pages/patient/SwipeScreen'
import MatchesList from './pages/patient/MatchesList'
import ProfessionalProfile from './pages/patient/ProfessionalProfile'
import SchedulingPage from './pages/patient/SchedulingPage'
import VideoRoomPatient from './pages/patient/VideoRoomPatient'
import NotificationsPage from './pages/patient/NotificationsPage'
import PatientProfile from './pages/patient/PatientProfile'

// Professional pages
import ProDashboard from './pages/professional/ProDashboard'
import ProPatients from './pages/professional/ProPatients'
import ProPatientDetail from './pages/professional/ProPatientDetail'
import ProAgenda from './pages/professional/ProAgenda'
import VideoRoomPro from './pages/professional/VideoRoomPro'
import ProSettings from './pages/professional/ProSettings'
import ProReports from './pages/professional/ProReports'

// Style Guide
import StyleGuide from './pages/StyleGuide'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/style-guide" element={<StyleGuide />} />

          {/* Patient */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<Navigate to="/patient/home" replace />} />
            <Route path="home" element={<PatientHome />} />
            <Route path="swipe" element={<SwipeScreen />} />
            <Route path="matches" element={<MatchesList />} />
            <Route path="pro/:id" element={<ProfessionalProfile />} />
            <Route path="schedule/:id" element={<SchedulingPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<PatientProfile />} />
          </Route>
          <Route path="/patient/video" element={<VideoRoomPatient />} />

          {/* Professional */}
          <Route path="/pro" element={<ProLayout />}>
            <Route index element={<Navigate to="/pro/dashboard" replace />} />
            <Route path="dashboard" element={<ProDashboard />} />
            <Route path="patients" element={<ProPatients />} />
            <Route path="patients/:id" element={<ProPatientDetail />} />
            <Route path="agenda" element={<ProAgenda />} />
            <Route path="reports" element={<ProReports />} />
            <Route path="settings" element={<ProSettings />} />
          </Route>
          <Route path="/pro/video" element={<VideoRoomPro />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

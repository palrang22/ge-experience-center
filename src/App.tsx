import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import ArchitecturePage from '@/pages/ArchitecturePage'
import ExperiencePage from '@/pages/ExperiencePage'
import HomePage from '@/pages/HomePage'
import PlaygroundPage from '@/pages/PlaygroundPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="architecture" element={<ArchitecturePage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="playground/:domainId" element={<PlaygroundPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App

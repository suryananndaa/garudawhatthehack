import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './LoginPage'

export default function AuthApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}
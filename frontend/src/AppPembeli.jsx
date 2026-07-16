import { Outlet } from 'react-router-dom'
import SidebarPembeli from './components/layout/SidebarPembeli.jsx'
import './App.css'

export default function AppPembeli() {
  return (
    <div className="app">
      <SidebarPembeli />
      <main className="app__content">
        <Outlet />
      </main>
    </div>
  )
}

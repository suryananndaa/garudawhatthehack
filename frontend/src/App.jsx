import { Outlet } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar.jsx'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="app__content">
        <Outlet />
      </main>
    </div>
  )
}

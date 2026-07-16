import './SettingsNav.css'

export default function SettingsNav({ items, activeKey, onChange }) {
  return (
    <nav className="settings-nav" aria-label="Navigasi pengaturan">
      {items.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          className={`settings-nav__item ${activeKey === key ? 'settings-nav__item--active' : ''}`}
          onClick={() => onChange(key)}
        >
          <Icon size={18} strokeWidth={2} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

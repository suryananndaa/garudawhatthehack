import './Tabs.css'

export default function Tabs({ tabs, active, onChange, ariaLabel = 'Filter' }) {
  return (
    <div className="tabs" role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={active === tab.key}
          className={`tabs__item ${active === tab.key ? 'tabs__item--active' : ''}`}
          onClick={() => onChange?.(tab.key)}
        >
          {tab.label}
          {tab.count !== undefined && <span className="tabs__count">{tab.count}</span>}
        </button>
      ))}
    </div>
  )
}

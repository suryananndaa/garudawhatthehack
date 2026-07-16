import './ProdukTabs.css'

export default function ProdukTabs({ tabs, active, onChange }) {
  return (
    <div className="produk-tabs" role="tablist" aria-label="Filter status produk">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={active === tab.key}
          className={`produk-tabs__item ${active === tab.key ? 'produk-tabs__item--active' : ''}`}
          onClick={() => onChange?.(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

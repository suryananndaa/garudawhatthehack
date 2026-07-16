import './SettingsCard.css'

export default function SettingsCard({ title, subtitle, children, footer }) {
  return (
    <section className="settings-card">
      {(title || subtitle) && (
        <div className="settings-card__head">
          {title && <h3 className="settings-card__title">{title}</h3>}
          {subtitle && <p className="settings-card__subtitle">{subtitle}</p>}
        </div>
      )}

      <div className="settings-card__body">{children}</div>

      {footer && <div className="settings-card__footer">{footer}</div>}
    </section>
  )
}

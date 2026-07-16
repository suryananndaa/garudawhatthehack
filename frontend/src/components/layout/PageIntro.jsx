import './PageIntro.css'

export default function PageIntro({ title, subtitle }) {
  return (
    <header className="page-intro">
      <h2 className="page-intro__title">{title}</h2>
      {subtitle && <p className="page-intro__subtitle">{subtitle}</p>}
    </header>
  )
}

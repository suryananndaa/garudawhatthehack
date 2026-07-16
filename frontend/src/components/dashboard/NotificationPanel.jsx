import './NotificationPanel.css'

export default function NotificationPanel({ notifications = [] }) {
  return (
    <section className="notification-panel">
      <h3 className="notification-panel__title">Notifikasi</h3>

      {notifications.length === 0 ? (
        <p className="notification-panel__empty">Belum ada notifikasi baru.</p>
      ) : (
        <ul className="notification-panel__list">
          {notifications.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

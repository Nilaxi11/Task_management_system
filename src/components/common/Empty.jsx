export default function Empty({ icon = 'bi-inbox', title = 'leave', body = '' }) {
  return (
    <div className="tf-empty">
      <i className={`bi ${icon}`}></i>
      <h6>{title}</h6>{body && <p style={{ fontSize: '.85rem' }}>{body}</p>}
    </div>);
}

import { Link } from 'react-router-dom';
export default function PageHeader({ title, subtitle, crumbs=[], actions }) {
  return (
    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
      <div>
        {crumbs.length>0 && (
          <div className="tf-breadcrumb">
            {crumbs.map((c,i)=>(
              <span key={i}>
                {c.to ? <Link to={c.to}>{c.label}</Link> : c.label}
                {i<crumbs.length-1 && <span className="mx-2">/</span>}
              </span>
            ))}
          </div>
        )}
        <h1 className="tf-page-title">{title}</h1>
        {subtitle && <div className="tf-page-sub">{subtitle}</div>}
      </div>
      {actions && <div className="d-flex gap-2">{actions}</div>}
    </div>
  );
}

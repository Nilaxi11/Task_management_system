import { createContext, useContext, useState, useCallback } from 'react';

const ToastCtx = createContext(null);
let externalPush = null;

export function ToastContainer() {
  const [items, setItems] = useState([]);
  externalPush = (t) => {
    const id = Math.random().toString(36).slice(2);
    setItems((s) => [...s, { id, ...t }]);
    setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), t.duration || 3000);
  };
  return (
    <div className="tf-toasts">
      {items.map((t) => (
        <div key={t.id} className={`tf-toast ${t.type||''}`}>
          <strong className="d-block" style={{fontSize:'.85rem'}}>{t.title}</strong>
          {t.body && <span style={{fontSize:'.78rem',color:'var(--tf-muted)'}}>{t.body}</span>}
        </div>
      ))}
    </div>
  );
}

export const toast = {
  success: (title, body) => externalPush?.({ type:'success', title, body }),
  error:   (title, body) => externalPush?.({ type:'error', title, body }),
  info:    (title, body) => externalPush?.({ type:'info', title, body }),
};

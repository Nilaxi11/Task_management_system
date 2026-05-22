export const initials = (name = '') => name.split(' ').map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
export const fmtDate = (d) => { if (!d) return '—'; const dt = new Date(d); return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); };
export const relTime = (ts) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
};
export const statusClass = (s) => ({ Todo: 'todo', 'In Progress': 'progress', Review: 'review', Done: 'done' }[s] || 'todo');
export const priorityClass = (p) => ({ High: 'high', Medium: 'medium', Low: 'low' }[p] || 'medium');

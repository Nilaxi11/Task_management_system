import { initials } from '../../utils/helpers';
export default function Avatar({ user, size='', className='' }) {
  if (!user) return null;
  return (
    <span className={`tf-avatar ${size} ${className}`} style={{ background: user.avatarColor || '#1677ff' }} title={user.name}>
      {initials(user.name)}
    </span>
  );
}

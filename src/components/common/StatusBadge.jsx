import { statusClass, priorityClass } from '../../utils/helpers';
export const StatusBadge = ({ status }) => <span className={`tf-badge ${statusClass(status)}`}>{status}</span>;
export const PriorityBadge = ({ priority }) => <span className={`tf-badge ${priorityClass(priority)}`}>{priority}</span>;

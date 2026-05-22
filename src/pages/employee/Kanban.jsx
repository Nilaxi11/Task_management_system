import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useSelector, useDispatch } from 'react-redux';
import PageHeader from '../../components/common/PageHeader';
import Avatar from '../../components/common/Avatar';
import { PriorityBadge } from '../../components/common/StatusBadge';
import { setStatus } from '../../redux/slices/taskSlice';
import { useAuth } from '../../hooks/useAuth';
import { fmtDate } from '../../utils/helpers';
import { toast } from '../../components/common/Toast';

const columns = ['Todo', 'In Progress', 'Review', 'Done'];

export default function Kanban() {
  const me = useAuth();
  const dispatch = useDispatch();

  const tasks = useSelector(s => s.tasks.list).filter(t => t.assigneeId === me.id);
  const users = useSelector(s => s.users.list);

  const grouped = Object.fromEntries(columns.map(c => [c, tasks.filter(t => t.status === c)]));

  const onDragEnd = (res) => {
    if (!res.destination) return;
    if (res.source.droppableId === res.destination.droppableId) return;
    dispatch(setStatus({ id: res.draggableId, status: res.destination.droppableId }));
    toast.success('Moved to ' + res.destination.droppableId);
  };

  return (
    <>
      {/* page header start */}
      <PageHeader title="Kanban" subtitle="Drag and drop tasks across stages" crumbs={[{ label: 'Employee' }, { label: 'Kanban' }]} />
      {/* page header end */}
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="tf-kanban">
          {columns.map(col => (
            <Droppable droppableId={col} key={col}>
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="tf-kcol" style={{ background: snapshot.isDraggingOver ? 'var(--tf-primary-soft)' : undefined, transition: 'background .15s' }}>
                  <h6>{col} <span className="count">{grouped[col].length}</span></h6>
                  {grouped[col].map((t, i) => {
                    const u = users.find(x => x.id === t.assigneeId);
                    return (
                      <Draggable draggableId={t.id} index={i} key={t.id}>
                        {(p, snap) => (
                          <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className="tf-kcard" style={{ ...p.draggableProps.style, boxShadow: snap.isDragging ? '0 10px 30px rgba(0,0,0,.15)' : undefined }}>
                            <h6>{t.title}</h6>
                            {t.tags.length > 0 && <div className="tags">{t.tags.map(tg => <span key={tg}>{tg}</span>)}</div>}
                            <div className="meta">
                              <span><i className="bi bi-calendar-event me-1"></i>{fmtDate(t.dueDate)}</span>
                              <PriorityBadge priority={t.priority} />
                            </div>
                            <div className="d-flex justify-content-end mt-2"><Avatar user={u} size="sm" /></div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
}

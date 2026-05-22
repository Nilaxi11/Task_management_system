import { useState } from 'react';
import { useSelector } from 'react-redux';

import PageHeader from '../../components/common/PageHeader';

export default function Calendar() {
  const tasks = useSelector(
    (state) => state.tasks.list
  );

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const firstDayIndex = firstDay.getDay();

  const totalDays = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const today =
    new Date().toISOString().split('T')[0];

  const days = [];

  // Empty spaces before month starts
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }

  //  days
  for (let day = 1; day <= totalDays; day++) {
    days.push(day);
  }

  const monthTitle =
    currentDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

  const getTasksForDay = (day) => {
    const date = new Date(
      year,
      month,
      day
    )
      .toISOString()
      .split('T')[0];

    return tasks.filter(
      (task) => task.dueDate === date
    );
  };

  return (
    <>
    {/* page header start */}
      <PageHeader
        title="Calendar"
        subtitle="View task deadlines"
        crumbs={[
          { label: 'Manager' },
          { label: 'Calendar' },
        ]}
        actions={
          <div className="d-flex gap-2">

            <button
              className="btn btn-light"
              onClick={() =>
                setCurrentDate(
                  new Date(year, month - 1, 1)
                )
              }
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            <button
              className="btn btn-light"
              onClick={() =>
                setCurrentDate(new Date())
              }
            >
              Today
            </button>

            <button
              className="btn btn-light"
              onClick={() =>
                setCurrentDate(
                  new Date(year, month + 1, 1)
                )
              }
            >
              <i className="bi bi-chevron-right"></i>
            </button>

          </div>
        }
      />
      {/* page header end */}

      {/* Calendar Header */}
      <h5 className="mb-3">
        {monthTitle}
      </h5>

      <div className="tf-cal">

        {/* Week Days */}
        {[
          'Sun',
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
        ].map((day) => (
          <div
            key={day}
            className="dow"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => {
          if (!day) {
            return (
              <div
                key={index}
                className="day muted"
              ></div>
            );
          }

          const dateString = new Date(
            year,
            month,
            day
          )
            .toISOString()
            .split('T')[0];

          const dayTasks =
            getTasksForDay(day);

          return (
            <div
              key={index}
              className={`day ${dateString === today
                  ? 'today'
                  : ''
                }`}
            >
              <div className="num">
                {day}
              </div>

              {dayTasks
                .slice(0, 3)
                .map((task) => (
                  <div
                    key={task.id}
                    className="pill"
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}

              {dayTasks.length > 3 && (
                <small className="text-muted">
                  +{dayTasks.length - 3} more
                </small>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
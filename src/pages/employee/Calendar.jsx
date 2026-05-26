import { useState } from 'react';
import { useSelector } from 'react-redux';

import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../hooks/useAuth';

export default function EmployeeCalendar() {

  const me = useAuth();

  // ONLY EMPLOYEE ASSIGNED TASKS
  const tasks = useSelector(
    state =>
      state.tasks.list.filter(
        task => task.assigneeId === me.id
      )
  );

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();

  const firstDay = new Date(
    year,
    month,
    1
  );

  const firstDayIndex =
    firstDay.getDay();

  const totalDays = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const today =
    new Date()
      .toISOString()
      .split('T')[0];

  const days = [];

  // EMPTY SPACES
  for (
    let i = 0;
    i < firstDayIndex;
    i++
  ) {
    days.push(null);
  }

  // DAYS
  for (
    let day = 1;
    day <= totalDays;
    day++
  ) {
    days.push(day);
  }

  const monthTitle =
    currentDate.toLocaleString(
      'default',
      {
        month: 'long',
        year: 'numeric'
      }
    );

  // GET TASKS FOR DAY
  const getTasksForDay = day => {

    const date = new Date(
      year,
      month,
      day
    )
      .toISOString()
      .split('T')[0];

    return tasks.filter(
      task => task.dueDate === date
    );
  };

  return (
    <>
      {/* PAGE HEADER */}
      <PageHeader
        title="My Calendar"
        subtitle="View your task deadlines"
        crumbs={[
          { label: 'Employee' },
          { label: 'Calendar' }
        ]}
        actions={
          <div className="d-flex gap-2">

            {/* PREV */}
            <button
              className="btn btn-light"
              onClick={() =>
                setCurrentDate(
                  new Date(
                    year,
                    month - 1,
                    1
                  )
                )
              }
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            {/* TODAY */}
            <button
              className="btn btn-light"
              onClick={() =>
                setCurrentDate(
                  new Date()
                )
              }
            >
              Today
            </button>

            {/* NEXT */}
            <button
              className="btn btn-light"
              onClick={() =>
                setCurrentDate(
                  new Date(
                    year,
                    month + 1,
                    1
                  )
                )
              }
            >
              <i className="bi bi-chevron-right"></i>
            </button>

          </div>
        }
      />

      {/* MONTH */}
      <h5 className="mb-3">
        {monthTitle}
      </h5>

      {/* CALENDAR */}
      <div className="tf-cal">

        {/* WEEK DAYS */}
        {[
          'Sun',
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat'
        ].map(day => (

          <div
            key={day}
            className="dow"
          >
            {day}
          </div>

        ))}

        {/* DAYS */}
        {days.map((day, index) => {

          if (!day) {

            return (
              <div
                key={index}
                className="day muted"
              ></div>
            );
          }

          const dateString =
            new Date(
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
              className={`day ${
                dateString === today
                  ? 'today'
                  : ''
              }`}
            >

              {/* DAY NUMBER */}
              <div className="num">
                {day}
              </div>

              {/* TASKS */}
              {dayTasks
                .slice(0, 3)
                .map(task => (

                  <div
                    key={task.id}
                    className="pill"
                    title={task.title}
                  >
                    {task.title}
                  </div>

                ))}

              {/* MORE */}
              {dayTasks.length > 3 && (

                <small className="text-muted">
                  +
                  {dayTasks.length - 3}{' '}
                  more
                </small>

              )}

            </div>
          );
        })}

      </div>
    </>
  );
}
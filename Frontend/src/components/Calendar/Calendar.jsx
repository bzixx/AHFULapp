import { useMemo } from "react";
import useCalendar from "./useCalendar";
import { AnimatePresence, motion } from "framer-motion";
import "./calendar.css";

export function Calendar({ locale }) {
  // Default to the user's browser locale if none is provided
  locale = locale || navigator.language;

  const { year, month, weekdays, cells, isToday, startOfMonth, goNext, goPrevious } =
    useCalendar(new Date(), locale);

  const monthFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
  }, [locale]);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="calendar-button" onClick={goPrevious}>
          ← Prev
        </button>
        <div className="calendar-title">
          {monthFormatter.format(new Date(year, month, 1))}
        </div>

        <button className="calendar-button" onClick={goNext}>
          Next →
        </button>
      </div>
      <div className="calendar-weekdays">
        {weekdays.map((dayName) => (
          <div key={dayName} className="calendar-weekday">
            {dayName}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${startOfMonth.getFullYear()}-${startOfMonth.getMonth()}`} 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="calendar-grid"
        >
          {cells.map(({ date, currentMonth }) => {
            const todayCell = isToday(date);

            let cellClass = "calendar-cell";
            cellClass += currentMonth ? " current" : " other"; // Current month or leading/trailing day
            if (todayCell) cellClass += " today"; // Highlight today's date

            return (
              <div
                key={date.toISOString()}
                className={cellClass}
                title={date.toDateString()}
              >
                <span className={todayCell ? "calendar-day-today" : ""}>{date.getDate()}</span>
                {todayCell && <span className="calendar-today-badge">today</span>}
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
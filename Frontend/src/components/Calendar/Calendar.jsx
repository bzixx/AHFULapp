import { useMemo } from "react";
import UseCalendar from "./UseCalendar";
import { useSelector, useDispatch } from "react-redux";
/*Need to look over framer motion again between sprints, hardly understand it and 
there might be a clearner way to do the calendar animations without it.*/
import { AnimatePresence, motion } from "framer-motion";
import "./calendar.css";
import { setSelectedDate, clearSelectedDate } from "./CalendarSlicer"; 

export function Calendar({ locale }) {
  locale = locale || navigator.language;

  const { 
    year, 
    month, 
    weekdays, 
    cells, 
    isToday, 
    startOfMonth, 
    goNext, 
    goPrevious 
  } = UseCalendar(new Date(), locale);

  const dispatch = useDispatch();
  
  // Read selected date from Redux (single source of truth)
  const selectedDate = useSelector((state) => state.calendar.selectedDate);
  
  const selectedDateStr = selectedDate ? new Date(selectedDate).toISOString().slice(0, 10) : null;

  const monthFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
  }, [locale]);

  const handleDateClick = (date) => {
    if (!date || isNaN(date.getTime())) return;
    
    const dateStr = date.toISOString();
    dispatch(setSelectedDate(dateStr));
  };

  const clearSelection = () => {
    dispatch(clearSelectedDate());
  };
  //will use later

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
          {cells.map(({ date, currentMonth }, index) => {
            // Guard against invalid date objects
            if (!(date instanceof Date) || isNaN(date.getTime())) {
              return (
                <div 
                  key={`invalid-${index}`} 
                  className="calendar-cell other"
                >
                  —
                </div>
              );
            }

            const todayCell = isToday(date);
            const dateStr = date.toISOString().slice(0, 10);
            const isSelected = selectedDateStr === dateStr;

            let cellClass = "calendar-cell";
            if (currentMonth) {
              cellClass += " current";
            } else {
              cellClass += " other";
            }
            if (todayCell) cellClass += " today";
            if (isSelected) cellClass += " selected";

            return (
              <div
                key={date.toISOString()}
                className={cellClass}
                title={date.toLocaleDateString()}
                onClick={() => handleDateClick(date)}
              >
                <span className={todayCell ? "calendar-day-today" : ""}>
                  {date.getDate()}
                </span>
                {todayCell && <span className="calendar-today-badge">today</span>}
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
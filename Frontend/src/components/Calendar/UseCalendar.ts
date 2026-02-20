import { useState,useCallback, useMemo } from "react";
//hook file for calendar component, contains logic for calculating the days of the month and navigating between months
function detectLocaleFirstDayOfWeek(locale: string) {
    try{
        const loc = new Intl.Locale(locale);
        if (loc.weekInfo?.firstDay){
            const index = loc.weekInfo.firstDay % 7;
            return index;
        }
    }catch(error){

    }
    return 0;
}

function UseCalendar(date: Date, locale: string) {
    const [startOfMonth, setStartOfMonth] = useState(
        new Date(date.getFullYear(), date.getMonth(), 1)
    )
    const goNext = useCallback(() => {
        setStartOfMonth((date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))
    }, [])
    const goPrevious = useCallback(() => {
        setStartOfMonth((date: Date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))
    }, [])
    
    const data = useMemo(() => {
        const now = new Date();
        const year = startOfMonth.getFullYear();
        const month = startOfMonth.getMonth();

        const endOfMonth = new Date(year, month + 1, 0).getDate();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const weekDayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
        let weekdays = Array.from({ length: 7 }, (_, i) => {
            const baseDate = new Date (2021, 7, 1 + i);
            return weekDayFormatter.format(baseDate);
        })
        const startIndex = detectLocaleFirstDayOfWeek(locale);
        weekdays = weekdays.slice(startIndex).concat(weekdays.slice(0, startIndex));

        //prev month days
        const firstDayIndex = startOfMonth.getDay();
        const leading = (firstDayIndex - startIndex + 7) % 7;
        const totalCells = leading + daysInMonth;
        const trailing = (7 - (totalCells % 7)) % 7;
        const cells = [];
        for (let i = leading; i > 0; i--){
            cells.push({
                date: new Date(year, month, 1 - i),
                currentMonth: false,
            });
        }
        //days of current month
        for (let j = 1; j <= daysInMonth; j++){
            cells.push({
                date: new Date(year, month, j),
                currentMonth: true,
            });
        }
        //days of next month
        for (let i = 1; i <= trailing; i++) {
            const lastDate = cells[cells.length - 1].date;
            const next = new Date(lastDate);
            next.setDate(lastDate.getDate() + 1);
            cells.push({ date: next, currentMonth: false });
        }
        const isToday = (date: Date) => {
            return(
                date.getFullYear() === now.getFullYear() &&
                date.getMonth() === now.getMonth() &&
                date.getDate() === now.getDate()
            );
        }

        return {
            year,
            month,
            weekdays,
            cells,
            isToday,
        };

    }, [startOfMonth, locale])

    return {startOfMonth, goNext, goPrevious, ...data};
}

export default UseCalendar;
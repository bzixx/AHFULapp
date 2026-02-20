import { useState, useCallback, useMemo } from "react";

// Function to detect the first day of the week for a given locale
// Returns 0 for Sunday, 1 for Monday, etc.
function detectLocaleFirstDayOfWeek(locale: string) {
    try {
        const loc = new Intl.Locale(locale); // Create Intl.Locale instance
        if (loc.weekInfo?.firstDay) {
            const index = loc.weekInfo.firstDay % 7; // Ensure index is in 0-6
            return index;
        }
    } catch (error) {
        // If the locale is invalid or Intl.Locale not supported, fallback to Sunday
    }
    return 0;
}
function UseCalendar(date: Date, locale: string) {
    // State to track the first day of the currently displayed month
    const [startOfMonth, setStartOfMonth] = useState(
        new Date(date.getFullYear(), date.getMonth(), 1) // Set to the first day of the input month
    );

    // Function to go to the next month
    const goNext = useCallback(() => {
        setStartOfMonth((date: Date) => 
            new Date(date.getFullYear(), date.getMonth() + 1, 1)
        );
    }, []);

    // Function to go to the previous month
    const goPrevious = useCallback(() => {
        setStartOfMonth((date: Date) => 
            new Date(date.getFullYear(), date.getMonth() - 1, 1)
        );
    }, []);

    // Memoized calculation of calendar data whenever startOfMonth or locale changes
    const data = useMemo(() => {
        const now = new Date();
        const year = startOfMonth.getFullYear();
        const month = startOfMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Format weekdays according to location
        const weekDayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
        let weekdays = Array.from({ length: 7 }, (_, i) => {
            const baseDate = new Date(2021, 7, 1 + i);
            return weekDayFormatter.format(baseDate);
        });

        // Reorder weekdays based on locale's first day of the week
        const startIndex = detectLocaleFirstDayOfWeek(locale);
        weekdays = weekdays.slice(startIndex).concat(weekdays.slice(0, startIndex));

        const firstDayIndex = startOfMonth.getDay();
        const leading = (firstDayIndex - startIndex + 7) % 7;

        const totalCells = leading + daysInMonth;

        // Calculate number of trailing days
        const trailing = (7 - (totalCells % 7)) % 7;
        const cells = [];

        // Add previous month's trailing days
        for (let i = leading; i > 0; i--) {
            cells.push({
                date: new Date(year, month, 1 - i),
                currentMonth: false,
            });
        }

        // Add current month's days
        for (let j = 1; j <= daysInMonth; j++) {
            cells.push({
                date: new Date(year, month, j),
                currentMonth: true,
            });
        }

        // Add next month's leading days
        for (let i = 1; i <= trailing; i++) {
            const lastDate = cells[cells.length - 1].date;
            const next = new Date(lastDate);
            next.setDate(lastDate.getDate() + 1);
            cells.push({ date: next, currentMonth: false });
        }

        // Helper function to check if a date is today
        const isToday = (date: Date) => {
            return (
                date.getFullYear() === now.getFullYear() &&
                date.getMonth() === now.getMonth() &&
                date.getDate() === now.getDate()
            );
        };

        return {
            year,
            month,
            weekdays,
            cells,
            isToday,
        };

    }, [startOfMonth, locale]);

    // Return calendar state and helper functions
    return { startOfMonth, goNext, goPrevious, ...data };
}

export default UseCalendar;
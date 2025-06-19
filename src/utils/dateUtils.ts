
import { format, isSameDay, addMonths, subMonths, parseISO, addDays, startOfWeek, endOfMonth, startOfMonth, getDay, isToday, parse } from 'date-fns';

// Safe date parsing that avoids timezone issues
export const parseEventDate = (dateString: string | Date): Date => {
  if (dateString instanceof Date) {
    return dateString;
  }
  
  // If it's a YYYY-MM-DD format (HTML date input), parse it as local date
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  }
  
  // For other formats, use parseISO
  return parseISO(dateString);
};

// Generate week view dates
export const generateWeekDays = (selectedDate: Date) => {
  const startDay = startOfWeek(selectedDate || new Date());
  return Array.from({ length: 7 }, (_, i) => addDays(startDay, i));
};

// Generate calendar grid for month view
export const generateCalendarDays = (viewDate: Date) => {
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const startDate = startOfWeek(monthStart);
  
  const days = [];
  let day = startDate;
  
  // Create array of dates (6 weeks including days from prev/next months)
  for (let i = 0; i < 42; i++) {
    days.push(day);
    day = addDays(day, 1);
    if (day > monthEnd && days.length >= 35) break; // Stop after 5 or 6 weeks
  }
  
  return days;
};

import { useMemo } from 'react';

interface CalendarPreviewProps {
  year: number;
  month: number;
  weeklyOffs: Date[];
  holidays: Date[];
}

export function CalendarPreview({ year, month, weeklyOffs, holidays }: CalendarPreviewProps) {
  const daysInMonth = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return { firstDay, lastDay, days };
  }, [year, month]);

  const isWeeklyOff = (date: Date) => {
    return weeklyOffs.some(
      (off) =>
        off.getDate() === date.getDate() &&
        off.getMonth() === date.getMonth() &&
        off.getFullYear() === date.getFullYear()
    );
  };

  const isHoliday = (date: Date) => {
    return holidays.some(
      (holiday) =>
        holiday.getDate() === date.getDate() &&
        holiday.getMonth() === date.getMonth() &&
        holiday.getFullYear() === date.getFullYear()
    );
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Add empty cells for days before the first day of the month
  const startDay = daysInMonth.firstDay.getDay();
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {daysInMonth.days.map((date) => {
          const isOff = isWeeklyOff(date);
          const isHol = isHoliday(date);

          return (
            <div
              key={date.toISOString()}
              className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                isHol
                  ? 'bg-red-100 text-red-700 font-medium'
                  : isOff
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded"></div>
          <span className="text-gray-600">Holiday</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <span className="text-gray-600">Weekly Off</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
          <span className="text-gray-600">Working Day</span>
        </div>
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import { WeeklyOffRule } from './AdvancedRuleBuilder';

interface RuleBasedCalendarProps {
  year: number;
  month: number;
  rules: WeeklyOffRule[];
  holidays: Date[];
}

export function RuleBasedCalendar({ year, month, rules, holidays }: RuleBasedCalendarProps) {
  const weeklyOffDates = useMemo(() => {
    const dates: Date[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayMap: Record<string, number> = {
      SUN: 0,
      MON: 1,
      TUE: 2,
      WED: 3,
      THU: 4,
      FRI: 5,
      SAT: 6,
    };

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);

      for (const rule of rules) {
        if (rule.type === 'DAY_OF_WEEK' && rule.dayOfWeek && rule.weekOfMonth) {
          const targetDay = dayMap[rule.dayOfWeek];
          
          if (date.getDay() === targetDay) {
            if (rule.weekOfMonth === 'ALL') {
              dates.push(date);
              break;
            } else {
              // Calculate which week of the month this date falls in
              const weekOfMonth = Math.ceil(day / 7);
              if (weekOfMonth === rule.weekOfMonth) {
                dates.push(date);
                break;
              }
            }
          }
        } else if (rule.type === 'DAY_OF_MONTH' && rule.dayOfMonth === day) {
          dates.push(date);
          break;
        }
      }
    }

    return dates;
  }, [year, month, rules]);

  const isWeeklyOff = (date: Date) => {
    return weeklyOffDates.some(
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

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const emptyDays = Array.from({ length: startDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

  // Calculate statistics
  const workingDays = days.filter((date) => !isWeeklyOff(date) && !isHoliday(date)).length;
  const weeklyOffCount = weeklyOffDates.length;
  const holidayCount = holidays.filter(
    (h) => h.getMonth() === month && h.getFullYear() === year
  ).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h3>
        <p className="text-xs text-gray-500 mt-1">Live preview based on rules</p>
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

        {days.map((date) => {
          const isOff = isWeeklyOff(date);
          const isHol = isHoliday(date);

          return (
            <div
              key={date.toISOString()}
              className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors relative group ${
                isHol
                  ? 'bg-red-100 text-red-700 font-medium'
                  : isOff
                  ? 'bg-gray-200 text-gray-600 font-medium'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              {date.getDate()}
              {(isOff || isHol) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-current"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded"></div>
          <span className="text-gray-600">Holiday</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span className="text-gray-600">Weekly Off</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
          <span className="text-gray-600">Working</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-3 gap-2 bg-gray-50 rounded-lg p-3">
        <div className="text-center">
          <p className="text-xs text-gray-600">Working</p>
          <p className="text-lg font-semibold text-green-600">{workingDays}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Weekly Off</p>
          <p className="text-lg font-semibold text-gray-600">{weeklyOffCount}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Holidays</p>
          <p className="text-lg font-semibold text-red-600">{holidayCount}</p>
        </div>
      </div>
    </div>
  );
}

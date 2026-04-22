import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeeklyOffSettingsProps {
  value: {
    type: 'none' | 'fixed' | 'alternate' | 'custom';
    fixedDays?: number[];
    alternateDays?: { day: number; weeks: number[] };
    customDates?: Date[];
  };
  onChange: (value: any) => void;
}

export function WeeklyOffSettings({ value, onChange }: WeeklyOffSettingsProps) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeks = ['1st', '2nd', '3rd', '4th', '5th'];
  
  // Custom date picker state
  const [pickerMonth, setPickerMonth] = useState(new Date().getMonth());
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());

  const handleTypeChange = (type: 'none' | 'fixed' | 'alternate' | 'custom') => {
    onChange({ type, fixedDays: [], alternateDays: { day: 0, weeks: [] }, customDates: [] });
  };

  const toggleFixedDay = (dayIndex: number) => {
    const currentDays = value.fixedDays || [];
    const newDays = currentDays.includes(dayIndex)
      ? currentDays.filter((d) => d !== dayIndex)
      : [...currentDays, dayIndex];
    onChange({ ...value, fixedDays: newDays });
  };

  const toggleAlternateWeek = (weekIndex: number) => {
    const currentWeeks = value.alternateDays?.weeks || [];
    const newWeeks = currentWeeks.includes(weekIndex)
      ? currentWeeks.filter((w) => w !== weekIndex)
      : [...currentWeeks, weekIndex];
    onChange({
      ...value,
      alternateDays: { ...value.alternateDays, day: value.alternateDays?.day || 0, weeks: newWeeks },
    });
  };

  // Custom date picker functions
  const toggleCustomDate = (date: Date) => {
    const currentDates = value.customDates || [];
    const dateExists = currentDates.some(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
    );

    const newDates = dateExists
      ? currentDates.filter(
          (d) =>
            !(
              d.getDate() === date.getDate() &&
              d.getMonth() === date.getMonth() &&
              d.getFullYear() === date.getFullYear()
            )
        )
      : [...currentDates, date];

    onChange({ ...value, customDates: newDates });
  };

  const isDateSelected = (date: Date) => {
    return (value.customDates || []).some(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
    );
  };

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysArray: Date[] = [];

    for (let d = 1; d <= lastDay.getDate(); d++) {
      daysArray.push(new Date(year, month, d));
    }

    return { firstDay, lastDay, days: daysArray };
  };

  const monthData = getDaysInMonth(pickerYear, pickerMonth);
  const startDay = monthData.firstDay.getDay();
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);

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

  const previousMonth = () => {
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear(pickerYear - 1);
    } else {
      setPickerMonth(pickerMonth - 1);
    }
  };

  const nextMonth = () => {
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear(pickerYear + 1);
    } else {
      setPickerMonth(pickerMonth + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            checked={value.type === 'none'}
            onChange={() => handleTypeChange('none')}
            className="w-4 h-4 text-[#6C5DD3]"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">No Weekly Off</div>
            <div className="text-xs text-gray-500">All days are working days</div>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            checked={value.type === 'fixed'}
            onChange={() => handleTypeChange('fixed')}
            className="w-4 h-4 text-[#6C5DD3]"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">Fixed Weekly Off</div>
            <div className="text-xs text-gray-500">Same day(s) every week</div>
          </div>
        </label>

        {value.type === 'fixed' && (
          <div className="ml-7 pl-4 border-l-2 border-gray-200">
            <p className="text-xs text-gray-600 mb-2">Select day(s):</p>
            <div className="flex flex-wrap gap-2">
              {days.map((day, index) => (
                <button
                  key={day}
                  onClick={() => toggleFixedDay(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    value.fixedDays?.includes(index)
                      ? 'bg-[#6C5DD3] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            checked={value.type === 'alternate'}
            onChange={() => handleTypeChange('alternate')}
            className="w-4 h-4 text-[#6C5DD3]"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">Alternate Weekly Off</div>
            <div className="text-xs text-gray-500">Specific week(s) of the month</div>
          </div>
        </label>

        {value.type === 'alternate' && (
          <div className="ml-7 pl-4 border-l-2 border-gray-200 space-y-3">
            <div>
              <p className="text-xs text-gray-600 mb-2">Select day:</p>
              <div className="flex flex-wrap gap-2">
                {days.map((day, index) => (
                  <button
                    key={day}
                    onClick={() =>
                      onChange({
                        ...value,
                        alternateDays: { ...value.alternateDays, day: index, weeks: value.alternateDays?.weeks || [] },
                      })
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      value.alternateDays?.day === index
                        ? 'bg-[#6C5DD3] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-2">Select week(s):</p>
              <div className="flex flex-wrap gap-2">
                {weeks.map((week, index) => (
                  <button
                    key={week}
                    onClick={() => toggleAlternateWeek(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      value.alternateDays?.weeks?.includes(index)
                        ? 'bg-[#6C5DD3] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {week}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            checked={value.type === 'custom'}
            onChange={() => handleTypeChange('custom')}
            className="w-4 h-4 text-[#6C5DD3]"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">Custom Weekly Off</div>
            <div className="text-xs text-gray-500">Select specific dates</div>
          </div>
        </label>

        {value.type === 'custom' && (
          <div className="ml-7 pl-4 border-l-2 border-gray-200">
            <p className="text-xs text-gray-600 mb-3">Select custom dates:</p>
            <div className="bg-white border border-gray-300 rounded-lg p-4 max-w-sm">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={previousMonth}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="text-sm font-semibold text-gray-900">
                  {monthNames[pickerMonth]} {pickerYear}
                </div>
                <button
                  onClick={nextMonth}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div
                    key={`day-${index}`}
                    className="text-center text-xs font-medium text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}

                {emptyDays.map((i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {monthData.days.map((date) => {
                  const isSelected = isDateSelected(date);

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => toggleCustomDate(date)}
                      className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-[#6C5DD3] text-white font-medium'
                          : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* Selected Dates Summary */}
              {value.customDates && value.customDates.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">
                    Selected dates ({value.customDates.length}):
                  </p>
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                    {value.customDates
                      .sort((a, b) => a.getTime() - b.getTime())
                      .map((date, index) => (
                        <span
                          key={index}
                          className="text-xs bg-[#6C5DD3] text-white px-2 py-1 rounded"
                        >
                          {date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
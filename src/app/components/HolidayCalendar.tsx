import { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';

interface Holiday {
  id: string;
  name: string;
  date: Date;
  departments?: string[];
  scope: 'organization' | 'department';
}

interface HolidayCalendarProps {
  holidays: Holiday[];
  onAddHoliday: (holiday: Holiday) => void;
  onRemoveHoliday: (id: string) => void;
  departments?: string[];
  showDepartmentScope?: boolean;
}

export function HolidayCalendar({
  holidays,
  onAddHoliday,
  onRemoveHoliday,
  departments = [],
  showDepartmentScope = false,
}: HolidayCalendarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: '',
    scope: 'organization' as 'organization' | 'department',
    departments: [] as string[],
  });

  const handleAddHoliday = () => {
    if (newHoliday.name && newHoliday.date) {
      onAddHoliday({
        id: Date.now().toString(),
        name: newHoliday.name,
        date: new Date(newHoliday.date),
        scope: newHoliday.scope,
        departments: newHoliday.scope === 'department' ? newHoliday.departments : undefined,
      });
      setNewHoliday({ name: '', date: '', scope: 'organization', departments: [] });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload CSV
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#6C5DD3] text-white rounded-lg text-sm font-medium hover:bg-[#5B4CC4] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Holiday
        </button>
      </div>

      {/* Holiday List */}
      {holidays.length > 0 && (
        <div className="space-y-2">
          {holidays.map((holiday) => (
            <div
              key={holiday.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{holiday.name}</p>
                <p className="text-xs text-gray-500">
                  {holiday.date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {holiday.scope === 'department' && holiday.departments && (
                    <span className="ml-2 text-blue-600">
                      ({holiday.departments.join(', ')})
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => onRemoveHoliday(holiday.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Holiday Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Add Holiday</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Holiday Name
                </label>
                <input
                  type="text"
                  value={newHoliday.name}
                  onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                  placeholder="e.g., Independence Day"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                />
              </div>

              {showDepartmentScope && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Applicable Scope
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={newHoliday.scope === 'organization'}
                          onChange={() =>
                            setNewHoliday({ ...newHoliday, scope: 'organization', departments: [] })
                          }
                          className="w-4 h-4 text-[#6C5DD3]"
                        />
                        <span className="text-sm text-gray-700">Organization-wide</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={newHoliday.scope === 'department'}
                          onChange={() => setNewHoliday({ ...newHoliday, scope: 'department' })}
                          className="w-4 h-4 text-[#6C5DD3]"
                        />
                        <span className="text-sm text-gray-700">Specific Departments</span>
                      </label>
                    </div>
                  </div>

                  {newHoliday.scope === 'department' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Departments
                      </label>
                      <select
                        multiple
                        value={newHoliday.departments}
                        onChange={(e) =>
                          setNewHoliday({
                            ...newHoliday,
                            departments: Array.from(e.target.selectedOptions, (option) => option.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                        size={4}
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHoliday}
                className="flex-1 px-4 py-2 bg-[#6C5DD3] text-white rounded-lg text-sm font-medium hover:bg-[#5B4CC4] transition-colors"
              >
                Add Holiday
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

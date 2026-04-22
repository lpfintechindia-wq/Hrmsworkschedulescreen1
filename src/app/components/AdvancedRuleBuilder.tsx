import { Plus, Trash2, AlertCircle, CheckSquare, Square } from 'lucide-react';
import { useState } from 'react';

export interface WeeklyOffRule {
  id: string;
  type: 'DAY_OF_WEEK' | 'DAY_OF_MONTH';
  dayOfWeek?: 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  weekOfMonth?: 1 | 2 | 3 | 4 | 5 | 'ALL';
  dayOfMonth?: number;
}

interface AdvancedRuleBuilderProps {
  rules: WeeklyOffRule[];
  onChange: (rules: WeeklyOffRule[]) => void;
}

export function AdvancedRuleBuilder({ rules, onChange }: AdvancedRuleBuilderProps) {
  const [selectedRules, setSelectedRules] = useState<Set<string>>(new Set());

  const daysOfWeek = [
    { value: 'SUN', label: 'Sunday' },
    { value: 'MON', label: 'Monday' },
    { value: 'TUE', label: 'Tuesday' },
    { value: 'WED', label: 'Wednesday' },
    { value: 'THU', label: 'Thursday' },
    { value: 'FRI', label: 'Friday' },
    { value: 'SAT', label: 'Saturday' },
  ];

  const weeksOfMonth = [
    { value: 'ALL', label: 'All' },
    { value: 1, label: '1st' },
    { value: 2, label: '2nd' },
    { value: 3, label: '3rd' },
    { value: 4, label: '4th' },
    { value: 5, label: '5th' },
  ];

  const addRule = () => {
    const newRule: WeeklyOffRule = {
      id: Date.now().toString(),
      type: 'DAY_OF_WEEK',
      dayOfWeek: 'SUN',
      weekOfMonth: 'ALL',
    };
    onChange([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    onChange(rules.filter((r) => r.id !== id));
  };

  const updateRule = (id: string, updates: Partial<WeeklyOffRule>) => {
    onChange(
      rules.map((r) => {
        if (r.id === id) {
          const updated = { ...r, ...updates };
          // Clean up fields based on type
          if (updated.type === 'DAY_OF_WEEK') {
            delete updated.dayOfMonth;
          } else {
            delete updated.dayOfWeek;
            delete updated.weekOfMonth;
          }
          return updated;
        }
        return r;
      })
    );
  };

  // Multi-select functions
  const toggleSelectAll = () => {
    if (selectedRules.size === rules.length) {
      setSelectedRules(new Set());
    } else {
      setSelectedRules(new Set(rules.map(r => r.id)));
    }
  };

  const toggleSelectRule = (id: string) => {
    const newSelected = new Set(selectedRules);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRules(newSelected);
  };

  const deleteSelectedRules = () => {
    onChange(rules.filter(r => !selectedRules.has(r.id)));
    setSelectedRules(new Set());
  };

  const isAllSelected = rules.length > 0 && selectedRules.size === rules.length;
  const isSomeSelected = selectedRules.size > 0 && selectedRules.size < rules.length;

  // Validation: Check for duplicate rules
  const getDuplicateWarnings = () => {
    const warnings: string[] = [];
    const seen = new Set<string>();

    rules.forEach((rule) => {
      let key = '';
      if (rule.type === 'DAY_OF_WEEK') {
        key = `${rule.dayOfWeek}-${rule.weekOfMonth}`;
      } else {
        key = `DAY-${rule.dayOfMonth}`;
      }

      if (seen.has(key)) {
        warnings.push(key);
      }
      seen.add(key);
    });

    return warnings;
  };

  const duplicateWarnings = getDuplicateWarnings();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Rule Builder</h3>
          <p className="text-sm text-gray-500">Define custom weekly off patterns using rules</p>
        </div>
        <button
          onClick={addRule}
          className="px-4 py-2 bg-[#6C5DD3] text-white rounded-lg text-sm font-medium hover:bg-[#5B4CC4] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Rule
        </button>
      </div>

      {/* Bulk Actions Bar */}
      {selectedRules.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {selectedRules.size} rule{selectedRules.size > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={deleteSelectedRules}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedRules(new Set())}
              className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {duplicateWarnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Duplicate Rules Detected</p>
            <p className="text-xs text-amber-700 mt-1">
              Some rules are duplicated. Please review your configuration.
            </p>
          </div>
        </div>
      )}

      {rules.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-3">No rules defined yet</p>
          <button
            onClick={addRule}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Add Your First Rule
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-12">
                    <button
                      onClick={toggleSelectAll}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-5 h-5 text-[#6C5DD3]" />
                      ) : isSomeSelected ? (
                        <div className="w-5 h-5 border-2 border-[#6C5DD3] rounded bg-[#6C5DD3]/20 flex items-center justify-center">
                          <div className="w-2 h-0.5 bg-[#6C5DD3]" />
                        </div>
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Rule Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Day of Week
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Week of Month
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Day of Month
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rules.map((rule) => (
                  <tr 
                    key={rule.id} 
                    className={`transition-all duration-200 ${ 
                      selectedRules.has(rule.id) 
                        ? 'bg-blue-50 hover:bg-blue-100 ring-2 ring-inset ring-[#6C5DD3] shadow-sm' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleSelectRule(rule.id)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {selectedRules.has(rule.id) ? (
                          <CheckSquare className="w-5 h-5 text-[#6C5DD3]" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={rule.type}
                        onChange={(e) =>
                          updateRule(rule.id, {
                            type: e.target.value as 'DAY_OF_WEEK' | 'DAY_OF_MONTH',
                          })
                        }
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                      >
                        <option value="DAY_OF_WEEK">Day of Week</option>
                        <option value="DAY_OF_MONTH">Day of Month</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {rule.type === 'DAY_OF_WEEK' ? (
                        <select
                          value={rule.dayOfWeek}
                          onChange={(e) => updateRule(rule.id, { dayOfWeek: e.target.value as any })}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                        >
                          {daysOfWeek.map((day) => (
                            <option key={day.value} value={day.value}>
                              {day.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="px-3 py-1.5 text-sm text-gray-400">—</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {rule.type === 'DAY_OF_WEEK' ? (
                        <select
                          value={rule.weekOfMonth}
                          onChange={(e) =>
                            updateRule(rule.id, {
                              weekOfMonth: e.target.value === 'ALL' ? 'ALL' : Number(e.target.value) as any,
                            })
                          }
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                        >
                          {weeksOfMonth.map((week) => (
                            <option key={week.value} value={week.value}>
                              {week.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="px-3 py-1.5 text-sm text-gray-400">—</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {rule.type === 'DAY_OF_MONTH' ? (
                        <input
                          type="number"
                          min="1"
                          max="31"
                          value={rule.dayOfMonth || ''}
                          onChange={(e) =>
                            updateRule(rule.id, { dayOfMonth: Number(e.target.value) })
                          }
                          className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                          placeholder="1-31"
                        />
                      ) : (
                        <div className="px-3 py-1.5 text-sm text-gray-400">—</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeRule(rule.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
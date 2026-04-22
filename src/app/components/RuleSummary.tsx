import { WeeklyOffRule } from './AdvancedRuleBuilder';

interface RuleSummaryProps {
  rules: WeeklyOffRule[];
}

export function RuleSummary({ rules }: RuleSummaryProps) {
  const generateHumanReadable = (rules: WeeklyOffRule[]): string => {
    if (rules.length === 0) return 'No weekly off configured';

    const dayNames: Record<string, string> = {
      SUN: 'Sunday',
      MON: 'Monday',
      TUE: 'Tuesday',
      WED: 'Wednesday',
      THU: 'Thursday',
      FRI: 'Friday',
      SAT: 'Saturday',
    };

    const weekNames: Record<number | 'ALL', string> = {
      ALL: 'All',
      1: '1st',
      2: '2nd',
      3: '3rd',
      4: '4th',
      5: '5th',
    };

    const parts: string[] = [];

    // Group by type
    const dayOfWeekRules = rules.filter((r) => r.type === 'DAY_OF_WEEK');
    const dayOfMonthRules = rules.filter((r) => r.type === 'DAY_OF_MONTH');

    // Process DAY_OF_WEEK rules
    const dayGroups: Record<string, (number | 'ALL')[]> = {};
    dayOfWeekRules.forEach((rule) => {
      if (!rule.dayOfWeek || !rule.weekOfMonth) return;
      if (!dayGroups[rule.dayOfWeek]) {
        dayGroups[rule.dayOfWeek] = [];
      }
      dayGroups[rule.dayOfWeek].push(rule.weekOfMonth);
    });

    Object.entries(dayGroups).forEach(([day, weeks]) => {
      if (weeks.includes('ALL')) {
        parts.push(`All ${dayNames[day]}s`);
      } else {
        const weekStr = weeks.map((w) => weekNames[w]).join(' & ');
        parts.push(`${weekStr} ${dayNames[day]}`);
      }
    });

    // Process DAY_OF_MONTH rules
    if (dayOfMonthRules.length > 0) {
      const dates = dayOfMonthRules
        .map((r) => r.dayOfMonth)
        .filter((d) => d !== undefined)
        .sort((a, b) => (a || 0) - (b || 0));
      if (dates.length > 0) {
        const dateStr = dates.map((d) => `${d}${getOrdinalSuffix(d!)}`).join(', ');
        parts.push(dateStr);
      }
    }

    return parts.join(' + ') + ' OFF';
  };

  const getOrdinalSuffix = (num: number): string => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

  const getRuleChips = (rules: WeeklyOffRule[]) => {
    const dayNames: Record<string, string> = {
      SUN: 'Sun',
      MON: 'Mon',
      TUE: 'Tue',
      WED: 'Wed',
      THU: 'Thu',
      FRI: 'Fri',
      SAT: 'Sat',
    };

    const weekNames: Record<number | 'ALL', string> = {
      ALL: 'All',
      1: '1st',
      2: '2nd',
      3: '3rd',
      4: '4th',
      5: '5th',
    };

    return rules.map((rule) => {
      if (rule.type === 'DAY_OF_WEEK' && rule.dayOfWeek && rule.weekOfMonth) {
        const week = weekNames[rule.weekOfMonth];
        const day = dayNames[rule.dayOfWeek];
        return {
          id: rule.id,
          text: week === 'All' ? `${day} OFF` : `${week} ${day} OFF`,
          color: 'blue',
        };
      } else if (rule.type === 'DAY_OF_MONTH' && rule.dayOfMonth) {
        return {
          id: rule.id,
          text: `${rule.dayOfMonth}${getOrdinalSuffix(rule.dayOfMonth)} OFF`,
          color: 'green',
        };
      }
      return { id: rule.id, text: 'Invalid Rule', color: 'red' };
    });
  };

  const chips = getRuleChips(rules);
  const summary = generateHumanReadable(rules);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Summary</h3>
        <p className="text-sm text-gray-600">Human-readable interpretation of your rules</p>
      </div>

      {/* Human Readable Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm font-medium text-purple-900 mb-1">Applied Policy:</p>
        <p className="text-lg font-semibold text-purple-900">{summary}</p>
      </div>

      {/* Rule Chips */}
      {chips.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">Active Rules ({chips.length})</p>
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip.id}
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  chip.color === 'blue'
                    ? 'bg-blue-100 text-blue-700'
                    : chip.color === 'green'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {chip.text}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-600">Total Rules</p>
          <p className="text-2xl font-semibold text-gray-900">{rules.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Rule Types</p>
          <p className="text-2xl font-semibold text-gray-900">
            {new Set(rules.map((r) => r.type)).size}
          </p>
        </div>
      </div>
    </div>
  );
}

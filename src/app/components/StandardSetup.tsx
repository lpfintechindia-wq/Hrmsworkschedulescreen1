import { useState } from 'react';
import { Check } from 'lucide-react';
import { WeeklyOffRule } from './AdvancedRuleBuilder';

interface StandardSetupProps {
  onApplyTemplate: (rules: WeeklyOffRule[]) => void;
}

export function StandardSetup({ onApplyTemplate }: StandardSetupProps) {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [customConfig, setCustomConfig] = useState({
    fixedDays: [] as string[],
  });

  const predefinedCases = [
    {
      id: 1,
      title: 'No Weekly Off',
      description: 'All days are working days',
      icon: '📅',
      color: 'blue',
      rules: [] as WeeklyOffRule[],
    },
    {
      id: 2,
      title: 'Fixed Weekly Off',
      description: 'Same day(s) every week',
      icon: '📌',
      color: 'green',
      configurable: true,
    },
  ];

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const daysLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleFixedDay = (day: string) => {
    setCustomConfig((prev) => ({
      ...prev,
      fixedDays: prev.fixedDays.includes(day)
        ? prev.fixedDays.filter((d) => d !== day)
        : [...prev.fixedDays, day],
    }));
  };

  const applyConfiguration = () => {
    let rules: WeeklyOffRule[] = [];

    if (selectedCase === 1) {
      rules = [];
    } else if (selectedCase === 2) {
      // Fixed days - all weeks
      rules = customConfig.fixedDays.map((day) => ({
        id: `${day}-ALL`,
        type: 'DAY_OF_WEEK' as const,
        dayOfWeek: day as any,
        weekOfMonth: 'ALL' as const,
      }));
    }

    onApplyTemplate(rules);
  };

  const getColorClasses = (color: string, selected: boolean) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      blue: {
        bg: selected ? 'bg-blue-50' : 'bg-white',
        border: selected ? 'border-blue-500' : 'border-gray-200',
        text: 'text-blue-600',
      },
      green: {
        bg: selected ? 'bg-green-50' : 'bg-white',
        border: selected ? 'border-green-500' : 'border-gray-200',
        text: 'text-green-600',
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Setup</h3>
        <p className="text-sm text-gray-500">Choose a predefined template and customize</p>
      </div>

      {/* Predefined Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predefinedCases.map((caseItem) => {
          const isSelected = selectedCase === caseItem.id;
          const colorClasses = getColorClasses(caseItem.color, isSelected);

          return (
            <button
              key={caseItem.id}
              onClick={() => setSelectedCase(caseItem.id)}
              className={`relative p-4 border-2 rounded-xl text-left transition-all hover:shadow-md ${colorClasses.bg} ${colorClasses.border}`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-[#6C5DD3] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="text-3xl">{caseItem.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{caseItem.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{caseItem.description}</p>
                  {caseItem.example && (
                    <p className="text-xs text-gray-500 italic">e.g., {caseItem.example}</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Configuration UI based on selection */}
      {selectedCase === 2 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Select Fixed Day(s)</h4>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day, index) => (
              <button
                key={day}
                onClick={() => toggleFixedDay(day)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  customConfig.fixedDays.includes(day)
                    ? 'bg-[#6C5DD3] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {daysLabels[index]}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedCase && (
        <div className="flex justify-end">
          <button
            onClick={applyConfiguration}
            className="px-6 py-2.5 bg-[#6C5DD3] text-white rounded-lg text-sm font-medium hover:bg-[#5B4CC4] transition-colors"
          >
            Apply Template
          </button>
        </div>
      )}
    </div>
  );
}
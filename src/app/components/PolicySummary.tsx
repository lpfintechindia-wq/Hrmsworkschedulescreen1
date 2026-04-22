interface PolicySummaryProps {
  weeklyOffType: string;
  fixedOffDays?: string[];
  totalHolidays: number;
}

export function PolicySummary({ weeklyOffType, fixedOffDays = [], totalHolidays }: PolicySummaryProps) {
  const getWeeklyOffText = () => {
    if (weeklyOffType === 'none') return 'No Weekly Off';
    if (weeklyOffType === 'fixed' && fixedOffDays.length > 0) {
      return fixedOffDays.join(', ');
    }
    if (weeklyOffType === 'alternate') return 'Alternate Weekly Off';
    if (weeklyOffType === 'custom') return 'Custom Weekly Off';
    return 'Not Configured';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Summary</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-sm text-gray-600">Weekly Off Type</span>
          <span className="text-sm font-medium text-gray-900">{weeklyOffType || 'Not Set'}</span>
        </div>
        
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <span className="text-sm text-gray-600">Fixed Off Days</span>
          <span className="text-sm font-medium text-gray-900">{getWeeklyOffText()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Holidays</span>
          <span className="text-sm font-medium text-gray-900">{totalHolidays}</span>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AdvancedRuleBuilder, WeeklyOffRule } from './components/AdvancedRuleBuilder';
import { StandardSetup } from './components/StandardSetup';
import { RuleSummary } from './components/RuleSummary';
import { RuleBasedCalendar } from './components/RuleBasedCalendar';
import { TemplateManager } from './components/TemplateManager';
import { HolidayCalendar } from './components/HolidayCalendar';
import { Toast } from './components/Toast';
import { ChevronLeft, Filter, Save, Plus, Calendar, Clock, FileText, Trash2 } from 'lucide-react';

interface Holiday {
  id: string;
  name: string;
  date: Date;
  scope: 'organization';
}

interface SavedTemplate {
  id: string;
  name: string;
  rules: WeeklyOffRule[];
  rulesCount: number;
  createdAt: Date;
}

export default function App() {
  const [showTemplateSelection, setShowTemplateSelection] = useState(true);
  const [templateName, setTemplateName] = useState('');
  const [activeTab, setActiveTab] = useState<'standard' | 'advanced'>('standard');
  const [selectedYear] = useState(2026);
  const [previewMonth, setPreviewMonth] = useState(3); // April
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);

  // Organization configuration
  const [rules, setRules] = useState<WeeklyOffRule[]>([
    {
      id: 'SUN-ALL',
      type: 'DAY_OF_WEEK',
      dayOfWeek: 'SUN',
      weekOfMonth: 'ALL',
    },
  ]);

  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      id: '1',
      name: 'Independence Day',
      date: new Date(2026, 7, 15),
      scope: 'organization',
    },
    {
      id: '2',
      name: 'Republic Day',
      date: new Date(2026, 0, 26),
      scope: 'organization',
    },
  ]);

  const applyTemplate = (templateRules: WeeklyOffRule[]) => {
    setRules(templateRules);
    setToast({ message: `✨ Template applied! ${templateRules.length} rules configured for organization`, type: 'success' });

    // Trigger pulse animation
    setPulseAnimation(true);
    setTimeout(() => setPulseAnimation(false), 1500);

    // Switch to advanced tab to show rules
    setActiveTab('advanced');
  };

  const addHoliday = (holiday: Holiday) => {
    setHolidays([...holidays, holiday]);
  };

  const removeHoliday = (id: string) => {
    setHolidays(holidays.filter((h) => h.id !== id));
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="flex h-screen bg-[#fafafa]">
      <Sidebar activeItem="settings" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Settings" />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1600px] mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <button className="hover:text-gray-900 transition-colors">Settings</button>
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <span className="text-gray-900">Work Week Policies</span>
            </div>

            {/* Page Title & Actions */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Work Week Policies
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Configure rule-based weekly off patterns and holiday calendars
                </p>
              </div>
              {!showTemplateSelection && (
                <div className="flex gap-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <option>Year: 2026</option>
                    <option>Year: 2025</option>
                    <option>Year: 2027</option>
                  </select>
                </div>
              )}
            </div>

            {showTemplateSelection ? (
              // Template Selection Screen
              <div className="space-y-6">
                {/* Create Template Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Create Work Schedule Template</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Define your organization's weekly off patterns and holiday calendar
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowTemplateSelection(false);
                        setTemplateName('');
                        setRules([
                          {
                            id: 'SUN-ALL',
                            type: 'DAY_OF_WEEK',
                            dayOfWeek: 'SUN',
                            weekOfMonth: 'ALL',
                          },
                        ]);
                      }}
                      className="px-6 py-3 bg-[#6C5DD3] text-white rounded-lg text-sm font-medium hover:bg-[#5B4CC4] transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Create Template
                    </button>
                  </div>
                </div>

                {/* Existing Templates */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Templates</h3>
                  {savedTemplates.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm">No templates created yet</p>
                      <p className="text-xs mt-1">Create your first work schedule template to get started</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedTemplates.map((template) => (
                        <div
                          key={template.id}
                          className="p-4 border-2 border-gray-200 rounded-xl hover:border-[#6C5DD3] transition-colors group relative"
                        >
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setRules(template.rules);
                              setTemplateName(template.name);
                              setShowTemplateSelection(false);
                              setToast({ message: `📋 Template "${template.name}" loaded`, type: 'info' });
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-[#6C5DD3]" />
                              </div>
                              <span className="text-xs text-gray-500">
                                {template.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2 truncate">{template.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                {template.rulesCount} {template.rulesCount === 1 ? 'Rule' : 'Rules'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSavedTemplates(savedTemplates.filter(t => t.id !== template.id));
                              setToast({ message: `🗑️ Template "${template.name}" deleted`, type: 'info' });
                            }}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-50 hover:bg-red-100 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Work Schedule Configuration Screen
              <>
                {/* Template Name Input */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name (e.g., 'Standard 5-Day Week', 'Retail Schedule')"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent"
                  />
                </div>

                {/* Tab System */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('standard')}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === 'standard'
                        ? 'text-[#6C5DD3] border-b-2 border-[#6C5DD3]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Standard Setup
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                      Easy
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('advanced')}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === 'advanced'
                        ? 'text-[#6C5DD3] border-b-2 border-[#6C5DD3]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Advanced Rule Builder
                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                      Power
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Left Column - Main Configuration (2/3 width) */}
                  <div className="xl:col-span-2 space-y-6">
                    {/* Tab Content */}
                    {activeTab === 'standard' ? (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <StandardSetup onApplyTemplate={applyTemplate} />
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <AdvancedRuleBuilder
                          rules={rules}
                          onChange={setRules}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column - Summary & Preview (1/3 width) */}
                  <div className="space-y-6">
                    {/* Rule Summary */}
                    <RuleSummary rules={rules} />

                    {/* Live Calendar Preview */}
                    <RuleBasedCalendar
                      year={selectedYear}
                      month={previewMonth}
                      rules={rules}
                      holidays={holidays.map((h) => h.date)}
                    />
                  </div>
                </div>

                {/* Sticky Save Button */}
                <div className="sticky bottom-0 mt-8 py-4 bg-gradient-to-t from-[#fafafa] to-transparent">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowTemplateSelection(true);
                        setTemplateName('');
                        setRules([
                          {
                            id: 'SUN-ALL',
                            type: 'DAY_OF_WEEK',
                            dayOfWeek: 'SUN',
                            weekOfMonth: 'ALL',
                          },
                        ]);
                      }}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!templateName.trim()) {
                          setToast({ message: '⚠️ Please enter a template name', type: 'error' });
                          return;
                        }

                        // Save the template
                        const newTemplate: SavedTemplate = {
                          id: Date.now().toString(),
                          name: templateName,
                          rules: rules,
                          rulesCount: rules.length,
                          createdAt: new Date(),
                        };

                        setSavedTemplates([...savedTemplates, newTemplate]);
                        setToast({ message: `✅ Template "${templateName}" saved successfully!`, type: 'success' });
                        setShowTemplateSelection(true);
                        setTemplateName('');
                        setRules([
                          {
                            id: 'SUN-ALL',
                            type: 'DAY_OF_WEEK',
                            dayOfWeek: 'SUN',
                            weekOfMonth: 'ALL',
                          },
                        ]);
                      }}
                      className="px-6 py-2.5 bg-[#6C5DD3] text-white rounded-lg text-sm font-medium hover:bg-[#5B4CC4] transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Template
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
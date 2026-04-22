import { useState } from 'react';
import { Save, FolderOpen, Copy, Trash2 } from 'lucide-react';
import { WeeklyOffRule } from './AdvancedRuleBuilder';

interface Template {
  id: string;
  name: string;
  description: string;
  rules: WeeklyOffRule[];
  createdAt: Date;
}

interface TemplateManagerProps {
  currentRules: WeeklyOffRule[];
  onLoadTemplate: (rules: WeeklyOffRule[]) => void;
}

export function TemplateManager({ currentRules, onLoadTemplate }: TemplateManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Standard 5-Day Week',
      description: 'Saturday & Sunday off',
      rules: [
        { id: 'SAT-ALL', type: 'DAY_OF_WEEK', dayOfWeek: 'SAT', weekOfMonth: 'ALL' },
        { id: 'SUN-ALL', type: 'DAY_OF_WEEK', dayOfWeek: 'SUN', weekOfMonth: 'ALL' },
      ],
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Alternate Saturday',
      description: '2nd & 4th Saturday + All Sundays',
      rules: [
        { id: 'SAT-2', type: 'DAY_OF_WEEK', dayOfWeek: 'SAT', weekOfMonth: 2 },
        { id: 'SAT-4', type: 'DAY_OF_WEEK', dayOfWeek: 'SAT', weekOfMonth: 4 },
        { id: 'SUN-ALL', type: 'DAY_OF_WEEK', dayOfWeek: 'SUN', weekOfMonth: 'ALL' },
      ],
      createdAt: new Date(),
    },
  ]);

  const [savingTemplate, setSavingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');

  const saveAsTemplate = () => {
    if (newTemplateName.trim() && currentRules.length > 0) {
      const newTemplate: Template = {
        id: Date.now().toString(),
        name: newTemplateName.trim(),
        description: newTemplateDesc.trim() || 'Custom template',
        rules: currentRules,
        createdAt: new Date(),
      };
      setTemplates([...templates, newTemplate]);
      setNewTemplateName('');
      setNewTemplateDesc('');
      setSavingTemplate(false);
    }
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  return (
    <div>
      <div className="flex gap-2">
        <button
          onClick={() => setSavingTemplate(true)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save as Template
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <FolderOpen className="w-4 h-4" />
          Load Template
        </button>
      </div>

      {/* Save Template Modal */}
      {savingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Save as Template</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                  placeholder="e.g., Retail Store Schedule"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                  rows={2}
                  placeholder="Brief description of this template"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">This template will save:</p>
                <p className="text-sm font-medium text-gray-900">{currentRules.length} rules</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSavingTemplate(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveAsTemplate}
                className="flex-1 px-4 py-2 bg-[#6C5DD3] text-white rounded-lg text-sm font-medium hover:bg-[#5B4CC4] transition-colors"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Template Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Load Template</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#6C5DD3] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {template.rules.length} rules configured
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onLoadTemplate(template.rules);
                          setIsOpen(false);
                        }}
                        className="p-2 text-[#6C5DD3] hover:bg-purple-50 rounded transition-colors"
                        title="Load Template"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Template"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

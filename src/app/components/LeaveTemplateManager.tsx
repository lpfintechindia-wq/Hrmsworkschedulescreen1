import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Users, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export interface LeaveType {
  id: string;
  name: string;
  days: number;
  carryForward: boolean;
  color: string;
}

export interface LeaveTemplate {
  id: string;
  name: string;
  description: string;
  leaveTypes: LeaveType[];
  assignedDepartments: string[];
  isDefault: boolean;
}

interface LeaveTemplateManagerProps {
  departments: string[];
  onTemplateChange?: (templates: LeaveTemplate[]) => void;
}

const PREDEFINED_TEMPLATES: Omit<LeaveTemplate, 'id' | 'assignedDepartments'>[] = [
  {
    name: 'Standard Policy',
    description: 'Balanced leave policy for most departments',
    isDefault: true,
    leaveTypes: [
      { id: '1', name: 'Annual Leave', days: 15, carryForward: true, color: 'bg-blue-500' },
      { id: '2', name: 'Sick Leave', days: 10, carryForward: false, color: 'bg-red-500' },
      { id: '3', name: 'Casual Leave', days: 7, carryForward: false, color: 'bg-green-500' },
      { id: '4', name: 'Maternity Leave', days: 90, carryForward: false, color: 'bg-pink-500' },
      { id: '5', name: 'Paternity Leave', days: 7, carryForward: false, color: 'bg-purple-500' },
    ],
  },
  {
    name: 'Generous Policy',
    description: 'Enhanced benefits for senior positions',
    isDefault: false,
    leaveTypes: [
      { id: '1', name: 'Annual Leave', days: 25, carryForward: true, color: 'bg-blue-500' },
      { id: '2', name: 'Sick Leave', days: 15, carryForward: true, color: 'bg-red-500' },
      { id: '3', name: 'Casual Leave', days: 12, carryForward: false, color: 'bg-green-500' },
      { id: '4', name: 'Maternity Leave', days: 120, carryForward: false, color: 'bg-pink-500' },
      { id: '5', name: 'Paternity Leave', days: 14, carryForward: false, color: 'bg-purple-500' },
      { id: '6', name: 'Study Leave', days: 10, carryForward: false, color: 'bg-orange-500' },
    ],
  },
  {
    name: 'Minimal Policy',
    description: 'Basic leave allocation for contractual staff',
    isDefault: false,
    leaveTypes: [
      { id: '1', name: 'Annual Leave', days: 10, carryForward: false, color: 'bg-blue-500' },
      { id: '2', name: 'Sick Leave', days: 7, carryForward: false, color: 'bg-red-500' },
      { id: '3', name: 'Casual Leave', days: 5, carryForward: false, color: 'bg-green-500' },
    ],
  },
];

export function LeaveTemplateManager({ departments, onTemplateChange }: LeaveTemplateManagerProps) {
  const [templates, setTemplates] = useState<LeaveTemplate[]>(
    PREDEFINED_TEMPLATES.map((template, index) => ({
      ...template,
      id: `template-${index}`,
      assignedDepartments: index === 0 ? departments : [], // Assign standard to all by default
    }))
  );

  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<LeaveTemplate>>({
    name: '',
    description: '',
    leaveTypes: [],
    assignedDepartments: [],
    isDefault: false,
  });

  const [showDepartmentAssignment, setShowDepartmentAssignment] = useState<string | null>(null);

  const createTemplate = () => {
    if (!newTemplate.name) return;

    const template: LeaveTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description || '',
      leaveTypes: newTemplate.leaveTypes || [],
      assignedDepartments: newTemplate.assignedDepartments || [],
      isDefault: false,
    };

    const updatedTemplates = [...templates, template];
    setTemplates(updatedTemplates);
    onTemplateChange?.(updatedTemplates);
    setIsCreating(false);
    setNewTemplate({
      name: '',
      description: '',
      leaveTypes: [],
      assignedDepartments: [],
      isDefault: false,
    });
  };

  const deleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter((t) => t.id !== id);
    setTemplates(updatedTemplates);
    onTemplateChange?.(updatedTemplates);
  };

  const toggleDepartmentAssignment = (templateId: string, department: string) => {
    const updatedTemplates = templates.map((template) => {
      if (template.id === templateId) {
        const isAssigned = template.assignedDepartments.includes(department);
        return {
          ...template,
          assignedDepartments: isAssigned
            ? template.assignedDepartments.filter((d) => d !== department)
            : [...template.assignedDepartments, department],
        };
      }
      return template;
    });
    setTemplates(updatedTemplates);
    onTemplateChange?.(updatedTemplates);
  };

  const addLeaveType = (templateId: string, leaveType: LeaveType) => {
    const updatedTemplates = templates.map((template) => {
      if (template.id === templateId) {
        return {
          ...template,
          leaveTypes: [...template.leaveTypes, leaveType],
        };
      }
      return template;
    });
    setTemplates(updatedTemplates);
    onTemplateChange?.(updatedTemplates);
  };

  const removeLeaveType = (templateId: string, leaveTypeId: string) => {
    const updatedTemplates = templates.map((template) => {
      if (template.id === templateId) {
        return {
          ...template,
          leaveTypes: template.leaveTypes.filter((lt) => lt.id !== leaveTypeId),
        };
      }
      return template;
    });
    setTemplates(updatedTemplates);
    onTemplateChange?.(updatedTemplates);
  };

  const getTotalDays = (template: LeaveTemplate) => {
    return template.leaveTypes.reduce((sum, lt) => sum + lt.days, 0);
  };

  const getDepartmentCoverage = () => {
    const coverage: Record<string, string[]> = {};
    departments.forEach((dept) => {
      coverage[dept] = templates
        .filter((t) => t.assignedDepartments.includes(dept))
        .map((t) => t.name);
    });
    return coverage;
  };

  const departmentCoverage = getDepartmentCoverage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Leave Templates</h3>
          <p className="text-sm text-gray-500">Create and assign leave policies to departments</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-[#6C5DD3] text-white rounded-lg text-sm font-medium hover:bg-[#5B4CC4] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Template
        </button>
      </div>

      {/* Department Coverage Overview */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-blue-600" />
          <h4 className="text-sm font-semibold text-gray-900">Department Coverage</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {departments.map((dept) => (
            <div
              key={dept}
              className="bg-white rounded-lg p-3 border border-gray-200"
            >
              <p className="text-xs font-medium text-gray-900 mb-1">{dept}</p>
              {departmentCoverage[dept].length > 0 ? (
                <p className="text-xs text-blue-600 font-medium">
                  {departmentCoverage[dept][0]}
                </p>
              ) : (
                <p className="text-xs text-red-500 italic">No template</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create New Template Form */}
      {isCreating && (
        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Create New Template</h4>
            <button
              onClick={() => setIsCreating(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name
              </label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                placeholder="e.g., Executive Policy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                rows={2}
                placeholder="Describe this leave policy..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={createTemplate}
                className="px-4 py-2 bg-[#6C5DD3] text-white rounded-lg text-sm font-medium hover:bg-[#5B4CC4] transition-colors"
              >
                Create Template
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates List */}
      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
          >
            {/* Template Header */}
            <div className="p-5 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-semibold text-gray-900">{template.name}</h4>
                    {template.isDefault && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>
                      <FileText className="w-3 h-3 inline mr-1" />
                      {template.leaveTypes.length} leave types
                    </span>
                    <span>
                      <Users className="w-3 h-3 inline mr-1" />
                      {template.assignedDepartments.length} departments
                    </span>
                    <span className="font-medium text-[#6C5DD3]">
                      Total: {getTotalDays(template)} days/year
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedTemplate(expandedTemplate === template.id ? null : template.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {expandedTemplate === template.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  {!template.isDefault && (
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedTemplate === template.id && (
              <div className="p-5 border-t border-gray-200 space-y-4">
                {/* Leave Types */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">Leave Types</h5>
                  <div className="space-y-2">
                    {template.leaveTypes.map((leaveType) => (
                      <div
                        key={leaveType.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${leaveType.color}`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{leaveType.name}</p>
                            <p className="text-xs text-gray-500">
                              {leaveType.carryForward ? 'Carry forward allowed' : 'No carry forward'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-[#6C5DD3]">
                            {leaveType.days}
                          </span>
                          <span className="text-xs text-gray-500">days</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Department Assignment */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-semibold text-gray-900">Department Assignment</h5>
                    <button
                      onClick={() => setShowDepartmentAssignment(
                        showDepartmentAssignment === template.id ? null : template.id
                      )}
                      className="text-xs text-[#6C5DD3] hover:text-[#5B4CC4] font-medium"
                    >
                      {showDepartmentAssignment === template.id ? 'Hide' : 'Manage'}
                    </button>
                  </div>

                  {showDepartmentAssignment === template.id ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {departments.map((dept) => {
                        const isAssigned = template.assignedDepartments.includes(dept);
                        return (
                          <button
                            key={dept}
                            onClick={() => toggleDepartmentAssignment(template.id, dept)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              isAssigned
                                ? 'bg-[#6C5DD3] text-white ring-2 ring-[#6C5DD3] ring-offset-2'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {isAssigned && <Check className="w-3 h-3 inline mr-1" />}
                            {dept}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {template.assignedDepartments.length > 0 ? (
                        template.assignedDepartments.map((dept) => (
                          <span
                            key={dept}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {dept}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic">No departments assigned</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {templates.length === 0 && !isCreating && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-3">No leave templates created yet</p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Create Your First Template
          </button>
        </div>
      )}
    </div>
  );
}

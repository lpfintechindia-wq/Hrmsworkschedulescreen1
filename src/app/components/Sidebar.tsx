import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarDays, 
  Plane, 
  Target, 
  Video, 
  FileText, 
  Megaphone, 
  Settings,
  ChevronRight 
} from 'lucide-react';
import svgPaths from "../../imports/svg-qprp63o8x9";

interface SidebarProps {
  activeItem?: string;
}

function IdfcLogo() {
  return (
    <div className="h-[47px] overflow-clip relative shrink-0 w-[134px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 134 47">
        <g>
          <path clipRule="evenodd" d="M0 47H134V0H0V47Z" fill="#9D1D27" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p11855300} fill="#FEFEFE" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p198ee000} fill="#FEFEFE" fillRule="evenodd" />
          <g>
            <mask height="47" id="mask0_1_1306" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }} width="134" x="0" y="0">
              <g>
                <path d="M0 47H134V0H0V47Z" fill="white" />
              </g>
            </mask>
            <g mask="url(#mask0_1_1306)">
              <path clipRule="evenodd" d={svgPaths.p9760800} fill="#FEFEFE" fillRule="evenodd" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

export function Sidebar({ activeItem = 'settings' }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, hasSubmenu: false },
    { id: 'employees', label: 'Employees', icon: Users, hasSubmenu: true },
    { id: 'attendance', label: 'Attendance', icon: Clock, hasSubmenu: true, expanded: false },
    { id: 'leaves', label: 'Leaves', icon: Plane, hasSubmenu: true },
    { id: 'targets', label: 'Targets', icon: Target, hasSubmenu: true },
    { id: 'meetings', label: 'Meetings', icon: Video, hasSubmenu: true },
    { id: 'reports', label: 'Reports', icon: FileText, hasSubmenu: true },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, hasSubmenu: true },
    { id: 'settings', label: 'Settings', icon: Settings, hasSubmenu: false },
  ];

  return (
    <div className="w-[240px] h-full bg-[#fafafa] border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="flex flex-col gap-1 items-center justify-center py-3 px-4">
        <IdfcLogo />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeItem;

          return (
            <div key={item.id}>
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-[#deb7ff] text-black font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="flex-1 text-left font-['Montserrat',sans-serif]">{item.label}</span>
                {item.hasSubmenu && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

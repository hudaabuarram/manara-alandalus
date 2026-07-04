import React from 'react';
import { 
  LayoutDashboard, Users, UserSquare2, School, BookOpen, Calendar, 
  CheckSquare, FileText, PenTool, Award, CreditCard, Library, 
  Bus, MessageSquare, BarChart3, Settings, Shield, ChevronRight, ChevronLeft
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

export const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, roles: ['admin', 'supervisor', 'teacher', 'student', 'parent'] },
  { id: 'students', label: 'شؤون الطلاب', icon: Users, roles: ['admin', 'supervisor', 'teacher', 'parent'] },
  { id: 'teachers', label: 'شؤون المعلمين', icon: UserSquare2, roles: ['admin', 'supervisor'] },
  { id: 'classes', label: 'الصفوف والشعب', icon: School, roles: ['admin', 'supervisor'] },
  { id: 'subjects', label: 'المواد الدراسية', icon: BookOpen, roles: ['admin', 'supervisor'] },
  { id: 'schedule', label: 'الجدول الدراسي', icon: Calendar, roles: ['admin', 'supervisor', 'teacher', 'student'] },
  { id: 'attendance', label: 'رصد الحضور والغياب', icon: CheckSquare, roles: ['admin', 'supervisor', 'teacher', 'student', 'parent'] },
  { id: 'assignments', label: 'الواجبات المدرسية', icon: FileText, roles: ['admin', 'teacher', 'student'] },
  { id: 'exams', label: 'الامتحانات والاختبارات', icon: PenTool, roles: ['admin', 'teacher', 'student'] },
  { id: 'grades', label: 'كشف الدرجات والنتائج', icon: Award, roles: ['admin', 'supervisor', 'teacher', 'student', 'parent'] },
  { id: 'finance', label: 'الرسوم والفواتير', icon: CreditCard, roles: ['admin', 'student', 'parent'] },
  { id: 'library', label: 'المكتبة المدرسية', icon: Library, roles: ['admin', 'student'] },
  { id: 'transport', label: 'النقل المدرسي', icon: Bus, roles: ['admin', 'student'] },
  { id: 'messages', label: 'الرسائل والإشعارات', icon: MessageSquare, roles: ['admin', 'supervisor', 'teacher', 'student', 'parent'] },
  { id: 'reports', label: 'التقارير والإحصائيات', icon: BarChart3, roles: ['admin', 'supervisor'] },
  { id: 'settings', label: 'إعدادات النظام', icon: Settings, roles: ['admin'] }
];

export default function Sidebar({ 
  currentRole, 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed 
}: SidebarProps) {
  
  // Filter menu items by user role
  const allowedMenuItems = menuItems.filter(item => item.roles.includes(currentRole));

  // Get Role Name in Arabic
  const getRoleNameArabic = (role: UserRole) => {
    switch(role) {
      case 'admin': return 'مدير النظام';
      case 'supervisor': return 'المشرف العام';
      case 'teacher': return 'المعلم';
      case 'student': return 'الطالب';
      case 'parent': return 'ولي الأمر';
      default: return '';
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch(role) {
      case 'admin': return 'bg-red-50 text-red-600 border border-red-200';
      case 'supervisor': return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'teacher': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'student': return 'bg-green-50 text-green-600 border border-green-200';
      case 'parent': return 'bg-purple-50 text-purple-600 border border-purple-200';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <aside 
      className={`bg-white border-l border-gray-200 min-h-screen transition-all duration-300 flex flex-col z-20 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      id="main-sidebar"
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <span className="text-3xl" id="sidebar-logo">🏫</span>
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-tight">منارة الأندلس</h1>
              <p className="text-xs text-gray-500 font-medium">النظام التعليمي المتكامل</p>
            </div>
          </div>
        )}
        {collapsed && (
          <span className="text-3xl mx-auto" id="sidebar-logo-collapsed">🏫</span>
        )}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors hidden md:block"
          title={collapsed ? "توسيع القائمة" : "طي القائمة"}
          id="toggle-sidebar-btn"
        >
          {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {allowedMenuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-l-md rounded-r-none text-right transition-all duration-150 relative border-r-3 ${
                isActive 
                  ? 'bg-blue-50/90 text-blue-600 border-blue-600 font-semibold' 
                  : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-blue-600'
              }`}
              title={collapsed ? item.label : undefined}
              id={`sidebar-item-${item.id}`}
            >
              <IconComponent className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}`} size={20} />
              
              {!collapsed && (
                <span className="text-sm truncate">{item.label}</span>
              )}

              {isActive && !collapsed && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Session Role Indicator */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        {!collapsed ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-gray-500" />
              <span className="text-xs text-gray-500 font-medium">المرونة الحالية</span>
            </div>
            <div className={`px-2.5 py-1.5 rounded-lg text-center text-xs font-bold ${getRoleBadgeColor(currentRole)}`} id="active-role-badge">
              {getRoleNameArabic(currentRole)}
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title={getRoleNameArabic(currentRole)}>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-200">
              {currentRole[0].toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

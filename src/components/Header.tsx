import { useState } from 'react';
import { 
  Search, Bell, Mail, Users, Key, LogOut, ChevronDown, 
  Settings, UserCheck, ShieldAlert, BookOpen, Clock
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  userEmail: string;
  activeNotificationsCount: number;
  unreadMessagesCount: number;
  onLogout?: () => void;
}

export default function Header({ 
  currentRole, 
  setCurrentRole, 
  userEmail,
  activeNotificationsCount,
  unreadMessagesCount,
  onLogout
}: HeaderProps) {
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Quick Switch Roles Configuration
  const rolesList: Array<{ id: UserRole; name: string; desc: string; icon: string }> = [
    { id: 'admin', name: 'المدير العام', desc: 'صلاحيات كاملة لإدارة النظام والمالية', icon: '👑' },
    { id: 'supervisor', name: 'المشرف الأكاديمي', desc: 'متابعة المعلمين والطلاب وتنسيق الجداول', icon: '🕵️‍♂️' },
    { id: 'teacher', name: 'المعلم (أ. ياسر)', desc: 'تسجيل الحضور، إدخال الدرجات والواجبات', icon: '👨‍🏫' },
    { id: 'student', name: 'الطالب (محمد السديري)', desc: 'عرض الجدول الدراسي، الواجبات والدرجات', icon: '👨‍🎓' },
    { id: 'parent', name: 'ولي الأمر (عبدالرحمن)', desc: 'متابعة الأبناء، الحضور والرسوم المالية', icon: '👨‍👩‍👦' }
  ];

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-50 text-red-700 border-red-200';
      case 'supervisor': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'teacher': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'student': return 'bg-green-50 text-green-700 border-green-200';
      case 'parent': return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  const getActiveRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'المدير العام';
      case 'supervisor': return 'المشرف';
      case 'teacher': return 'المعلم';
      case 'student': return 'الطالب';
      case 'parent': return 'ولي الأمر';
    }
  };

  // Static mock notifications for the bell icon
  const notifications = [
    { id: 1, title: "تم تحديث جدول الصف الأول الثانوي", time: "منذ ٥ دقائق", type: "schedule" },
    { id: 2, title: "سجل الطالب فيصل السعدون تأخراً اليوم", time: "منذ ساعة", type: "attendance" },
    { id: 3, title: "قسط دراسي مستحق السداد خلال ٣ أيام", time: "منذ ساعتين", type: "finance" },
    { id: 4, title: "تم إضافة كتاب جديد في قسم الرياضيات بالمكتبة", time: "منذ يوم", type: "library" }
  ];

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-30" id="main-header">
      {/* Search Input Container */}
      <div className="flex items-center w-80 relative hidden md:flex" id="global-search-container">
        <Search className="absolute right-3 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="البحث في النظام (الطلاب، المعلمين، الفواتير...)" 
          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 pr-10 pl-4 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
          id="global-search-input"
        />
      </div>

      {/* Title block for small screens */}
      <div className="md:hidden flex items-center gap-2" id="small-brand-header">
        <span className="text-2xl">🏫</span>
        <span className="font-bold text-gray-900 text-sm">منارة الأندلس</span>
      </div>

      {/* Action Controls & Switchers */}
      <div className="flex items-center gap-4" id="header-action-controls">
        
        {/* Quick Role Switcher Button */}
        <div className="relative">
          <button 
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-150 shadow-xs hover:shadow-sm ${getRoleBadgeStyle(currentRole)}`}
            id="role-dropdown-trigger"
          >
            <UserCheck size={14} />
            <span>عرض بصفتي: {getActiveRoleLabel(currentRole)}</span>
            <ChevronDown size={14} className={`transition-transform ${showRoleSwitcher ? 'rotate-180' : ''}`} />
          </button>

          {showRoleSwitcher && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 text-right animate-in fade-in slide-in-from-top-1 duration-150" id="role-switcher-dropdown">
              <div className="px-4 py-2 border-b border-gray-100">
                <span className="font-bold text-xs text-gray-800 block">تبديل حساب الصلاحية للمعاينة</span>
                <span className="text-[10px] text-gray-400">انقر للتبديل الفوري بين أدوار النظام</span>
              </div>
              <div className="max-h-80 overflow-y-auto p-1.5 space-y-1">
                {rolesList.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setCurrentRole(r.id);
                      setShowRoleSwitcher(false);
                    }}
                    className={`w-full flex items-start gap-3 p-2 rounded-lg text-right hover:bg-gray-50 transition-colors ${
                      currentRole === r.id ? 'bg-blue-50/70 border border-blue-100' : 'border border-transparent'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{r.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">{r.name}</span>
                        {currentRole === r.id && (
                          <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-sm font-semibold">نشط</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 leading-normal mt-0.5">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Messaging Quick Status Icon */}
        <div className="relative" id="messages-header-icon">
          <button 
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative"
            title="صندوق الرسائل"
          >
            <Mail size={18} />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1 left-1.5 bg-blue-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                {unreadMessagesCount}
              </span>
            )}
          </button>
        </div>

        {/* Notifications Popover */}
        <div className="relative" id="notifications-header-icon">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative"
            title="الإشعارات المدرسية"
          >
            <Bell size={18} />
            {activeNotificationsCount > 0 && (
              <span className="absolute top-1 left-1.5 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                {activeNotificationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 text-right animate-in fade-in slide-in-from-top-1 duration-150" id="notifications-dropdown">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-xs text-gray-800">التنبيهات المدرسية الأخيرة</span>
                <span className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer">تحديد كمقروء</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <p className="text-xs text-gray-700 font-medium leading-relaxed">{notif.title}</p>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                      <Clock size={10} />
                      {notif.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account Details */}
        <div className="flex items-center gap-3 border-r border-gray-200 pr-4" id="header-user-profile-details">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-gray-800 block">أ. هدى سليمان</span>
            <span className="text-[10px] text-gray-400 font-medium truncate max-w-28 block">{userEmail}</span>
          </div>
          <div className="w-9.5 h-9.5 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
            HS
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="تسجيل الخروج"
              id="header-logout-btn"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

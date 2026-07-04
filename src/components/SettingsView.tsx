import React, { useState } from 'react';
import { Save, School, Calendar, MessageSquare, ShieldAlert, Download, RefreshCw, Eye } from 'lucide-react';
import { SystemSettings } from '../types';
import { transData } from '../lib/translateHelper';

interface SettingsViewProps {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  lang?: 'ar' | 'en';
}

export default function SettingsView({
  settings,
  setSettings,
  lang = 'ar'
}: SettingsViewProps) {
  const [form, setForm] = useState<SystemSettings>({ ...settings });
  const [saving, setSaving] = useState(false);

  const trans = (ar: string, en: string) => lang === 'ar' ? ar : en;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSettings(form);
      setSaving(false);
      alert(trans("تم حفظ إعدادات النظام المدرسي وتحديث القواعد الفورية بنجاح!", "School settings and active system rules saved successfully!"));
    }, 1500);
  };

  const triggerBackup = () => {
    alert(trans("تم تهيئة وتوليد نسخة احتياطية لقواعد البيانات بصيغة .SQL بنجاح! جاري تنزيل الملف...", "Encrypted SQL database backup generated successfully! Downloading file..."));
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-200 ${lang === 'ar' ? 'text-right' : 'text-left'}`} id="settings-view-container">
      
      {/* View Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">{trans("تخصيص وإعدادات النظام المدرسي الشامل", "System Configuration & Global Settings")}</h2>
        <p className="text-xs text-gray-500">{trans("إدارة تفاصيل الترخيص الحكومي، الإشعارات الآلية لأولياء الأمور، وجدولة النُسخ الاحتياطية للأمان العام", "Manage ministerial licensing parameters, active SMS gateways, backup cron jobs, and custom security rules")}</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main forms (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: School Identity */}
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <School size={16} className="text-blue-600" />
              <span>{trans("هوية وبيانات المنشأة التعليمية", "Educational Institution Identity")}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-gray-700">
              <div className="space-y-1">
                <label className="block mb-1">{trans("اسم المدرسة المعتمد بالترخيص *", "Licensed School Name *")}</label>
                <input 
                  type="text" 
                  required
                  value={form.schoolName}
                  onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block mb-1">{trans("الرقم الموحد للترخيص (الوزاري) *", "Unified Ministerial License ID *")}</label>
                <input 
                  type="text" 
                  required
                  value="LIC-RYD-2026-9043"
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2 text-gray-500 cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="space-y-1">
                <label className="block mb-1">{trans("اسم مدير المدرسة المكلف *", "Assigned School Principal Name *")}</label>
                <input 
                  type="text" 
                  required
                  value={form.principalName || trans("أ. عبدالرحمن بن سليمان آل سعود", "Mr. Abdulrahman Al Saud")}
                  onChange={(e) => setForm({ ...form, principalName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block mb-1">{trans("البريد الإلكتروني للإدارة العامة *", "Principal Administration Email *")}</label>
                <input 
                  type="email" 
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Controls */}
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Calendar size={16} className="text-blue-600" />
              <span>{trans("المتغيرات الأكاديمية ونظام التقويم", "Academic Variables & Year System")}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-gray-700">
              <div className="space-y-1">
                <label className="block mb-1">{trans("العام الدراسي الحالي", "Active School Year")}</label>
                <select 
                  value={form.academicYear}
                  onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 focus:outline-none"
                >
                  <option value="١٤٤٧-١٤٤٨هـ (٢٠٢٦-٢٠٢٧م)">{trans("١٤٤٧-١٤٤٨هـ (٢٠٢٦-٢٠٢٧م)", "1447-1448H (2026-2027)")}</option>
                  <option value="١٤٤٦-١٤٤٧هـ (٢٠٢٥-٢٠٢٦م)">{trans("١٤٤٦-١٤٤٧هـ (٢٠٢٥-٢٠٢٦م)", "1446-1447H (2025-2026)")}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block mb-1">{trans("الفصل الدراسي النشط للرصد", "Active Grading Semester")}</label>
                <select 
                  value={form.activeSemester}
                  onChange={(e) => setForm({ ...form, activeSemester: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 focus:outline-none"
                >
                  <option value="الفصل الدراسي الأول">{trans("الفصل الدراسي الأول", "First Semester")}</option>
                  <option value="الفصل الدراسي الثاني">{trans("الفصل الدراسي الثاني", "Second Semester")}</option>
                  <option value="الفصل الدراسي الثالث">{trans("الفصل الدراسي الثالث", "Third Semester")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: SMS and Integrations */}
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-600" />
              <span>{trans("الإشعارات والرسائل النصية وتكامل الأنظمة", "Notifications & SMS Gateway Configuration")}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2.5 font-bold text-gray-700 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={form.smsNotificationEnabled}
                  onChange={(e) => setForm({ ...form, smsNotificationEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>{trans("تفعيل الإرسال التلقائي لرسائل الغياب الفورية لجوال ولي الأمر", "Enable real-time SMS alerts to parents upon absence logging")}</span>
              </label>

              <label className="flex items-center gap-2.5 font-bold text-gray-700 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={form.weeklyReportAutoSent}
                  onChange={(e) => setForm({ ...form, weeklyReportAutoSent: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>{trans("إرسال تقرير الأداء الإسبوعي لدرجات الطلاب إلكترونياً", "Automatically email weekly performance logs to guardians")}</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right sidebars/actions (1 column) */}
        <div className="space-y-6">
          
          {/* Action trigger card */}
          <div className="bg-white border border-gray-150 rounded-xl p-6 shadow-xs space-y-4">
            <button 
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-blue-700 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? trans("جاري الحفظ...", "Saving Settings...") : trans("حفظ وتحديث الإعدادات", "Save All Configurations")}</span>
            </button>
            <p className="text-[10px] text-gray-400 text-center">{trans("حفظ المتغيرات سيعيد تشغيل إعدادات الخادم لتحديث الترخيص وجدول الحصص", "Changes take effect instantly across all terminal dashboards")}</p>
          </div>

          {/* System Security & Backup */}
          <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <ShieldAlert size={15} className="text-red-500" />
              <span>{trans("الأمان والنسخ الاحتياطي لقواعد البيانات", "Security & System Backups")}</span>
            </h3>

            <p className="text-[11px] text-gray-500 leading-relaxed">{trans("تأمين الملفات وقاعدة البيانات ببروتوكولات التشفير، يمكنك سحب نسخة مدمجة من جميع الطلاب والمعلمين والدرجات في ملف SQL موثق للأنظمة الوزارية.", "Download localized SQL backups of student credentials, invoice books, and timetables to external servers.")}</p>

            <button
              type="button"
              onClick={triggerBackup}
              className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-250 text-gray-700 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Download size={15} className="text-blue-600" />
              <span>{trans("تصدير نسخة احتياطية .SQL", "Download Encrypted Backup")}</span>
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}

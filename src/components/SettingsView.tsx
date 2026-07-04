import React, { useState } from 'react';
import { Save, School, Calendar, MessageSquare, ShieldAlert, Download, RefreshCw, Eye } from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsViewProps {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
}

export default function SettingsView({
  settings,
  setSettings
}: SettingsViewProps) {
  const [form, setForm] = useState<SystemSettings>({ ...settings });
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSettings(form);
      setSaving(false);
      alert("تم حفظ إعدادات النظام المدرسي وتحديث القواعد الفورية بنجاح!");
    }, 1500);
  };

  const triggerBackup = () => {
    alert("تم تهيئة وتوليد نسخة احتياطية مشفرة لقواعد البيانات بصيغة .SQL بنجاح! جاري تنزيل الملف...");
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" id="settings-view-container">
      
      {/* View Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 font-sans">تخصيص وإعدادات النظام المدرسي الشامل</h2>
        <p className="text-xs text-gray-500">إدارة تفاصيل الترخيص الحكومي، الإشعارات الآلية لأولياء الأمور، وجدولة النُسخ الاحتياطية للأمان العام</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main forms (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: School Identity */}
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <School size={16} className="text-blue-600" />
              <span>هوية وبيانات المنشأة التعليمية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-gray-700">
              <div className="space-y-1">
                <label className="block mb-1">اسم المدرسة المعتمد بالترخيص *</label>
                <input 
                  type="text" 
                  required
                  value={form.schoolName}
                  onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="block mb-1">الرقم الموحد للترخيص (الوزاري) *</label>
                <input 
                  type="text" 
                  required
                  value="LIC-RYD-2026-9043"
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2 text-gray-500 cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="space-y-1">
                <label className="block mb-1">اسم مدير المدرسة المكلف *</label>
                <input 
                  type="text" 
                  required
                  value="أ. عبدالرحمن بن سليمان آل سعود"
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="block mb-1">البريد الإلكتروني للإدارة العامة *</label>
                <input 
                  type="email" 
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Controls */}
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Calendar size={16} className="text-indigo-600" />
              <span>المتطلبات الزمنية والفصول الدراسية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-gray-700">
              <div className="space-y-1">
                <label className="block mb-1">العام الأكاديمي النشط</label>
                <select 
                  value={form.academicYear}
                  onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs"
                >
                  <option value="2026/2027">العام الدراسي 2026/2027 م</option>
                  <option value="2025/2026">العام الدراسي 2025/2026 م</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block mb-1">الفصل الدراسي الحالي</label>
                <select 
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs"
                >
                  <option value="الفصل الدراسي الأول">الفصل الدراسي الأول</option>
                  <option value="الفصل الدراسي الثاني">الفصل الدراسي الثاني</option>
                  <option value="الفصل الدراسي الثالث">الفصل الدراسي الثالث (مسارات)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Right backup & notify rules column */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Section 3: Automatic Parental Notifications */}
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <MessageSquare size={16} className="text-amber-500" />
              <span>بوابة الإشعارات والربط الآلي</span>
            </h3>

            <div className="space-y-3.5 text-xs text-gray-700">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.enableSmsAlerts}
                  onChange={(e) => setForm({ ...form, enableSmsAlerts: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" 
                />
                <span className="font-bold">إرسال رسائل SMS فورية عند غياب الطالب</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.enableEmailAlerts}
                  onChange={(e) => setForm({ ...form, enableEmailAlerts: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" 
                />
                <span className="font-bold">إشعار ولي الأمر دورياً بالدرجات الشهرية</span>
              </label>
            </div>
          </div>

          {/* Section 4: Security and Backups */}
          <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <ShieldAlert size={16} className="text-red-600" />
              <span>النسخ الاحتياطي والأمن العام</span>
            </h3>

            <p className="text-[10px] text-gray-500 leading-normal">
              لحماية سجلات الطلاب والمالية، نوصي بتحميل نسخة احتياطية كاملة لقواعد البيانات بشكل أسبوعي.
            </p>

            <button 
              type="button"
              onClick={triggerBackup}
              className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Download size={14} className="text-blue-600" />
              <span>تصدير نسخة كاملة SQL</span>
            </button>
          </div>

          {/* Global Submit */}
          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white rounded-lg py-3 text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="animate-spin" size={14} />
                <span>جاري الحفظ والمطابقة...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>حفظ التعديلات والتثبيت</span>
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  );
}

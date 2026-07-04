import React, { useState } from 'react';
import { 
  Search, Plus, Edit2, Trash2, ShieldAlert, Award, 
  Phone, Mail, CheckCircle, User, BookOpen, School, DollarSign, X
} from 'lucide-react';
import { Teacher, GradeClass, Subject } from '../types';

interface TeachersViewProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  classes: GradeClass[];
  setClasses: React.Dispatch<React.SetStateAction<GradeClass[]>>;
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  activeSubTab?: 'teachers' | 'classes' | 'subjects';
}

export default function TeachersView({
  teachers,
  setTeachers,
  classes,
  setClasses,
  subjects,
  setSubjects,
  activeSubTab = 'teachers'
}: TeachersViewProps) {
  const [currentTab, setCurrentTab] = useState<'teachers' | 'classes' | 'subjects'>(activeSubTab);
  const [search, setSearch] = useState('');
  
  // Modals trigger
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);

  // New form states
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: '', specialization: '', qualification: '', salary: 10000,
    phone: '', email: '', status: 'نشط', attendanceRate: 100, performanceScore: 90,
    subjects: [], grades: []
  });

  const [newClass, setNewClass] = useState<Partial<GradeClass>>({
    name: '', stage: 'ثانوي', divisions: ['أ', 'ب'], capacity: 25, supervisorId: teachers[0]?.id || ''
  });

  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    name: '', code: '', grade: 'الصف الأول الثانوي', periodsPerWeek: 4, teacherId: teachers[0]?.id || ''
  });

  // Filters calculation
  const filteredTeachers = teachers.filter(t => t.name.includes(search) || t.specialization.includes(search));
  const filteredClasses = classes.filter(c => c.name.includes(search));
  const filteredSubjects = subjects.filter(s => s.name.includes(search) || s.code.includes(search));

  // Handler submissions
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.specialization) return;
    const t: Teacher = {
      id: `t${Date.now()}`,
      name: newTeacher.name,
      specialization: newTeacher.specialization,
      qualification: newTeacher.qualification || 'بكالوريوس',
      salary: Number(newTeacher.salary) || 10000,
      phone: newTeacher.phone || '0500000000',
      email: newTeacher.email || 'teacher@school.edu',
      status: 'نشط',
      attendanceRate: 100,
      performanceScore: 92,
      subjects: newTeacher.subjects || [],
      grades: newTeacher.grades || [],
      scheduleIds: []
    };
    setTeachers([t, ...teachers]);
    setShowTeacherModal(false);
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.name) return;
    const c: GradeClass = {
      id: `c${Date.now()}`,
      name: newClass.name,
      stage: newClass.stage as any || 'ثانوي',
      divisions: newClass.divisions || ['أ'],
      capacity: Number(newClass.capacity) || 25,
      supervisorId: newClass.supervisorId || teachers[0]?.id || ''
    };
    setClasses([...classes, c]);
    setShowClassModal(false);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.code) return;
    const s: Subject = {
      id: `sub${Date.now()}`,
      name: newSubject.name,
      code: newSubject.code,
      grade: newSubject.grade || 'الصف الأول الثانوي',
      periodsPerWeek: Number(newSubject.periodsPerWeek) || 4,
      teacherId: newSubject.teacherId || teachers[0]?.id || ''
    };
    setSubjects([...subjects, s]);
    setShowSubjectModal(false);
  };

  const getSupervisorName = (id: string) => {
    return teachers.find(t => t.id === id)?.name || 'غير معين';
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" id="teachers-classes-subjects-panel">
      
      {/* Tab Selectors */}
      <div className="flex border-b border-gray-200 bg-white p-1 rounded-xl shadow-xs" id="teachers-section-tabs">
        {[
          { id: 'teachers', label: 'شؤون المعلمين والمعلمات', icon: User },
          { id: 'classes', label: 'إدارة الصفوف والشعب الدراسية', icon: School },
          { id: 'subjects', label: 'المواد والمناهج المقررة', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isAct = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentTab(tab.id as any);
                setSearch('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-lg transition-all ${
                isAct 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Control panel & Action Triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder={
              currentTab === 'teachers' ? "البحث باسم المعلم أو التخصص..." :
              currentTab === 'classes' ? "البحث باسم الصف أو الشعبة..." : "البحث باسم المادة أو الكود الدراسي..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-250 rounded-lg pr-10 pl-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            id="teachers-panel-search-input"
          />
        </div>

        {currentTab === 'teachers' && (
          <button 
            onClick={() => setShowTeacherModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
            id="add-teacher-trigger"
          >
            <Plus size={16} />
            <span>تسجيل معلم جديد</span>
          </button>
        )}

        {currentTab === 'classes' && (
          <button 
            onClick={() => setShowClassModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
            id="add-class-trigger"
          >
            <Plus size={16} />
            <span>إضافة صف دراسي</span>
          </button>
        )}

        {currentTab === 'subjects' && (
          <button 
            onClick={() => setShowSubjectModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
            id="add-subject-trigger"
          >
            <Plus size={16} />
            <span>إضافة مادة مقررة</span>
          </button>
        )}
      </div>

      {/* Dynamic Content Table based on Active Sub-Tab */}
      <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
        
        {/* TAB 1: TEACHERS DIRECTORY */}
        {currentTab === 'teachers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-bold">اسم المعلم</th>
                  <th className="px-4 py-3 font-bold">التخصص والمؤهل</th>
                  <th className="px-4 py-3 font-bold">الراتب الشهري</th>
                  <th className="px-4 py-3 font-bold text-center">أداء المعلم</th>
                  <th className="px-4 py-3 font-bold">رقم الجوال</th>
                  <th className="px-4 py-3 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                          👨‍🏫
                        </div>
                        <div>
                          <span>{t.name}</span>
                          <span className="block text-[10px] text-gray-400 font-medium">{t.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs">
                      <span className="text-gray-900 font-bold block">{t.specialization}</span>
                      <span className="text-[10px] text-gray-400 font-bold">{t.qualification}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-bold text-gray-800 font-mono">
                      {t.salary.toLocaleString()} ر.س
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                        <Award size={13} />
                        <span>{t.performanceScore} / 100</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-gray-600">{t.phone}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'نشط' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: CLASSES & SEATS */}
        {currentTab === 'classes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-bold">المرحلة والصف</th>
                  <th className="px-4 py-3 font-bold">الشعب المتوفرة</th>
                  <th className="px-4 py-3 font-bold text-center">الطاقة الاستيعابية للمقاعد</th>
                  <th className="px-4 py-3 font-bold">المشرف التربوي المعتمد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredClasses.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-gray-900 flex items-center gap-3">
                      <span className="text-lg">🏫</span>
                      <div>
                        <span>{c.name}</span>
                        <span className="block text-[10px] text-gray-400 font-medium">مرحلة {c.stage}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5 flex-wrap">
                        {c.divisions.map((div, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">شعبة {div}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center text-xs font-bold text-gray-800 font-mono">
                      {c.capacity} مقعد للغرفة
                    </td>
                    <td className="px-4 py-3.5 text-xs text-blue-700 font-bold">
                      {getSupervisorName(c.supervisorId)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: SUBJECTS DIRECTORY */}
        {currentTab === 'subjects' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-bold">رمز المادة المقررة</th>
                  <th className="px-4 py-3 font-bold">اسم المادة المنهجية</th>
                  <th className="px-4 py-3 font-bold">الصف المستهدف</th>
                  <th className="px-4 py-3 font-bold text-center">عدد الحصص أسبوعياً</th>
                  <th className="px-4 py-3 font-bold">المعلم المسؤول</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredSubjects.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-blue-600">{s.code}</td>
                    <td className="px-4 py-3.5 font-bold text-gray-900">{s.name}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-700">{s.grade}</td>
                    <td className="px-4 py-3.5 text-center text-xs font-bold text-gray-800 font-mono">
                      {s.periodsPerWeek} حصص فترية
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 font-medium">
                      {getSupervisorName(s.teacherId)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* MODAL 1: ADD TEACHER */}
      {showTeacherModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-xl overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">تسجيل معلم جديد بالكادر</h3>
              <button onClick={() => setShowTeacherModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddTeacher} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">الاسم المعتمد *</label>
                  <input type="text" required value={newTeacher.name} onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white" placeholder="أ. فهد بن عبدالله" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">التخصص العلمي *</label>
                  <input type="text" required value={newTeacher.specialization} onChange={(e) => setNewTeacher({...newTeacher, specialization: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs" placeholder="مثال: علم الأحياء" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">المؤهل الدراسي</label>
                  <input type="text" value={newTeacher.qualification} onChange={(e) => setNewTeacher({...newTeacher, qualification: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs" placeholder="بكالوريوس التربية" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">الراتب الأساسي</label>
                  <input type="number" value={newTeacher.salary} onChange={(e) => setNewTeacher({...newTeacher, salary: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">رقم الجوال</label>
                  <input type="text" value={newTeacher.phone} onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">البريد الإلكتروني</label>
                  <input type="email" value={newTeacher.email} onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowTeacherModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">حفظ وحساب المعلم</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CLASS */}
      {showClassModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">إضافة صف دراسي جديد</h3>
              <button onClick={() => setShowClassModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddClass} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">اسم الصف الدراسي *</label>
                <input type="text" required value={newClass.name} onChange={(e) => setNewClass({...newClass, name: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white" placeholder="مثال: الصف الثالث الثانوي" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">المرحلة</label>
                  <select value={newClass.stage} onChange={(e) => setNewClass({...newClass, stage: e.target.value as any})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs">
                    <option value="ثانوي">ثانوي</option>
                    <option value="متوسط">متوسط</option>
                    <option value="ابتدائي">ابتدائي</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">طاقة الاستيعاب القصوى</label>
                  <input type="number" value={newClass.capacity} onChange={(e) => setNewClass({...newClass, capacity: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">رائد الفصل (معلم مشرف)</label>
                <select value={newClass.supervisorId} onChange={(e) => setNewClass({...newClass, supervisorId: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs">
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowClassModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">إضافة وحفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD SUBJECT */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">تسجيل مادة منهجية جديدة</h3>
              <button onClick={() => setShowSubjectModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddSubject} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-gray-700 block">اسم المادة المنهجية *</label>
                  <input type="text" required value={newSubject.name} onChange={(e) => setNewSubject({...newSubject, name: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs" placeholder="مثال: كيمياء ٢" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">الكود الرمزي للمادة *</label>
                  <input type="text" required value={newSubject.code} onChange={(e) => setNewSubject({...newSubject, code: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs font-mono" placeholder="CHEM-102" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">الحصص أسبوعياً</label>
                  <input type="number" value={newSubject.periodsPerWeek} onChange={(e) => setNewSubject({...newSubject, periodsPerWeek: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">الصف الدراسي المستهدف</label>
                <select value={newSubject.grade} onChange={(e) => setNewSubject({...newSubject, grade: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs">
                  <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                  <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                  <option value="الصف الثالث المتوسط">الصف الثالث المتوسط</option>
                  <option value="الصف الأول المتوسط">الصف الأول المتوسط</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">المعلم المكلف بالتدريس</label>
                <select value={newSubject.teacherId} onChange={(e) => setNewSubject({...newSubject, teacherId: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs">
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowSubjectModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">تسجيل المادة</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

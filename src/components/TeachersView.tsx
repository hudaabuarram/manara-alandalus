import React, { useState } from 'react';
import { 
  Search, Plus, Edit2, Trash2, ShieldAlert, Award, 
  Phone, Mail, CheckCircle, User, BookOpen, School, DollarSign, X
} from 'lucide-react';
import { Teacher, GradeClass, Subject } from '../types';
import { transData } from '../lib/translateHelper';

interface TeachersViewProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  classes: GradeClass[];
  setClasses: React.Dispatch<React.SetStateAction<GradeClass[]>>;
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  activeSubTab?: 'teachers' | 'classes' | 'subjects';
  lang?: 'ar' | 'en';
}

export default function TeachersView({
  teachers,
  setTeachers,
  classes,
  setClasses,
  subjects,
  setSubjects,
  activeSubTab = 'teachers',
  lang = 'ar'
}: TeachersViewProps) {
  const [currentTab, setCurrentTab] = useState<'teachers' | 'classes' | 'subjects'>(activeSubTab);
  const [search, setSearch] = useState('');
  
  // Modals trigger
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);

  const trans = (ar: string, en: string) => lang === 'ar' ? ar : en;

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
  const filteredTeachers = teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.specialization.toLowerCase().includes(search.toLowerCase()));
  const filteredClasses = classes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const filteredSubjects = subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase()));

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
    return teachers.find(t => t.id === id)?.name || trans('غير معين', 'Not Assigned');
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-200 ${lang === 'ar' ? 'text-right' : 'text-left'}`} id="teachers-classes-subjects-panel">
      
      {/* Tab Selectors */}
      <div className="flex border-b border-gray-200 bg-white p-1 rounded-xl shadow-xs" id="teachers-section-tabs">
        {[
          { id: 'teachers', label: trans('شؤون المعلمين والمعلمات', 'Teachers & Staff'), icon: User },
          { id: 'classes', label: trans('إدارة الصفوف والشعب الدراسية', 'Classes & Divisions'), icon: School },
          { id: 'subjects', label: trans('المواد والمناهج المقر المقرر', 'Subjects & Curricula'), icon: BookOpen },
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
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isAct 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <Icon size={16} />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Control panel & Action Triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${lang === 'ar' ? 'right-3' : 'left-3'}`} size={16} />
          <input 
            type="text" 
            placeholder={
              currentTab === 'teachers' ? trans("ابحث بالاسم أو التخصص...", "Search by name or specialization...") :
              currentTab === 'classes' ? trans("ابحث باسم الصف...", "Search by class name...") : trans("ابحث بالمادة أو الكود...", "Search by subject or code...")
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-gray-50 border border-gray-250 rounded-lg py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white ${
              lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'
            }`}
          />
        </div>

        {currentTab === 'teachers' && (
          <button 
            onClick={() => setShowTeacherModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>{trans("إضافة معلم جديد", "Add New Teacher")}</span>
          </button>
        )}

        {currentTab === 'classes' && (
          <button 
            onClick={() => setShowClassModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>{trans("إضافة صف جديد", "Add New Class")}</span>
          </button>
        )}

        {currentTab === 'subjects' && (
          <button 
            onClick={() => setShowSubjectModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>{trans("إضافة مادة جديدة", "Add New Subject")}</span>
          </button>
        )}
      </div>

      {/* Main Content Render */}
      {currentTab === 'teachers' && (
        <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("المعلم", "Teacher")}</th>
                  <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("التخصص والشهادة", "Specialization & Degree")}</th>
                  <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("معلومات التواصل", "Contact Info")}</th>
                  <th className="px-4 py-3.5 font-bold text-center">{trans("الراتب", "Salary")}</th>
                  <th className="px-4 py-3.5 font-bold text-center">{trans("الأداء والتقييم", "Performance Rating")}</th>
                  <th className="px-4 py-3.5 font-bold text-center">{trans("العمليات", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredTeachers.map((teach) => (
                  <tr key={teach.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-bold text-xs">
                          👨‍🏫
                        </div>
                        <div>
                          <span>{transData(teach.name, lang)}</span>
                          <span className="block text-[10px] text-gray-400 font-bold">{transData(teach.status, lang)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-gray-800 font-semibold block">{transData(teach.specialization, lang)}</span>
                      <span className="text-[10px] text-gray-400 font-medium block">{transData(teach.qualification, lang)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 font-medium">
                      <div>{teach.phone}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{teach.email}</div>
                    </td>
                    <td className="px-4 py-3.5 text-center text-xs font-bold text-gray-900">
                      {teach.salary.toLocaleString()} {trans("ريال", "SAR")}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-xs font-black text-green-600">{teach.performanceScore}%</span>
                        <span className="text-[9px] text-gray-400 font-medium">{trans("الحضور", "Attendance")}: {teach.attendanceRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors cursor-pointer">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
          {filteredClasses.map((cl) => (
            <div key={cl.id} className="bg-white border border-gray-150 rounded-xl p-4 shadow-xs relative hover:border-blue-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded">{transData(cl.stage, lang)}</span>
                  <span className="text-xs text-gray-400 font-bold">{trans("القدرة الاستيعابية", "Capacity")}: {cl.capacity}</span>
                </div>
                <h4 className="font-bold text-sm text-gray-900 mb-1">{transData(cl.name, lang)}</h4>
                <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                  <span>{trans("رائد الفصل / المشرف:", "Class Supervisor:")}</span>
                  <span className="font-bold text-blue-600">{transData(getSupervisorName(cl.supervisorId), lang)}</span>
                </p>
              </div>
              
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-bold">{trans("الشعب المرتبطة:", "Divisions:")}</span>
                  {cl.divisions.map((div, i) => (
                    <span key={i} className="w-5 h-5 rounded bg-gray-50 border border-gray-200 flex items-center justify-center text-xs text-gray-700 font-black">
                      {transData(div, lang)}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors cursor-pointer">
                    <Edit2 size={13} />
                  </button>
                  <button className="p-1 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentTab === 'subjects' && (
        <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden animate-in fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("رمز المادة", "Subject Code")}</th>
                  <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("اسم المادة المقررة", "Subject Title")}</th>
                  <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("الصف المستهدف", "Target Grade")}</th>
                  <th className="px-4 py-3.5 font-bold text-center">{trans("الحصص الإسبوعية", "Periods Per Week")}</th>
                  <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("المعلم المسؤول", "Teacher In Charge")}</th>
                  <th className="px-4 py-3.5 font-bold text-center">{trans("العمليات", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredSubjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-blue-600">{sub.code}</td>
                    <td className="px-4 py-3.5 font-bold text-gray-900">{transData(sub.name, lang)}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-700 font-medium">{transData(sub.grade, lang)}</td>
                    <td className="px-4 py-3.5 text-center text-xs font-bold text-gray-900">{sub.periodsPerWeek} {trans("حصص", "periods")}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-700 font-medium">{transData(getSupervisorName(sub.teacherId), lang)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors cursor-pointer">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {showTeacherModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">{trans("إضافة معلم جديد", "Add New Teacher")}</h3>
              <button onClick={() => setShowTeacherModal(false)} className="p-1 rounded hover:bg-gray-200 text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddTeacher} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("الاسم الكامل للمعلم *", "Full Teacher Name *")}</label>
                <input 
                  type="text" required
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("التخصص الأكاديمي *", "Specialization *")}</label>
                <input 
                  type="text" required
                  value={newTeacher.specialization}
                  onChange={(e) => setNewTeacher({...newTeacher, specialization: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("المؤهل والشهادة", "Qualification")}</label>
                <input 
                  type="text"
                  value={newTeacher.qualification}
                  onChange={(e) => setNewTeacher({...newTeacher, qualification: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("الراتب الشهري", "Monthly Salary")}</label>
                <input 
                  type="number"
                  value={newTeacher.salary}
                  onChange={(e) => setNewTeacher({...newTeacher, salary: Number(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowTeacherModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer">
                  {trans("إلغاء", "Cancel")}
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer">
                  {trans("حفظ وتسجيل المعلم", "Save Teacher")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">{trans("إضافة صف جديد", "Add New Class")}</h3>
              <button onClick={() => setShowClassModal(false)} className="p-1 rounded hover:bg-gray-200 text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddClass} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("اسم الصف *", "Class Name *")}</label>
                <input 
                  type="text" required
                  placeholder="مثال: الصف الأول الثانوي"
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("المرحلة الدراسية", "Stage")}</label>
                <select 
                  value={newClass.stage}
                  onChange={(e) => setNewClass({...newClass, stage: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                >
                  <option value="ثانوي">{trans("ثانوي", "Secondary")}</option>
                  <option value="متوسط">{trans("متوسط", "Intermediate")}</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("رائد الفصل المسؤول", "Class Supervisor")}</label>
                <select 
                  value={newClass.supervisorId}
                  onChange={(e) => setNewClass({...newClass, supervisorId: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{transData(t.name, lang)}</option>
                  ))}
                </select>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowClassModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer">
                  {trans("إلغاء", "Cancel")}
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer">
                  {trans("إنشاء وحفظ الصف", "Create Class")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">{trans("إضافة مادة جديدة", "Add New Subject")}</h3>
              <button onClick={() => setShowSubjectModal(false)} className="p-1 rounded hover:bg-gray-200 text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddSubject} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("اسم المادة الأكاديمية *", "Subject Name *")}</label>
                <input 
                  type="text" required
                  placeholder="مثال: الرياضيات ١"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("رمز المادة *", "Subject Code *")}</label>
                <input 
                  type="text" required
                  placeholder="e.g. MATH-101"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("الصف الدراسي المستهدف", "Target Grade")}</label>
                <select 
                  value={newSubject.grade}
                  onChange={(e) => setNewSubject({...newSubject, grade: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                >
                  <option value="الصف الأول الثانوي">{trans("الصف الأول الثانوي", "1st Grade - Secondary")}</option>
                  <option value="الصف الثاني الثانوي">{trans("الصف الثاني الثانوي", "2nd Grade - Secondary")}</option>
                  <option value="الصف الثالث المتوسط">{trans("الصف الثالث المتوسط", "3rd Grade - Intermediate")}</option>
                  <option value="الصف الأول المتوسط">{trans("الصف الأول المتوسط", "1st Grade - Intermediate")}</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("المعلم الموكل إليه المادة", "Assigned Teacher")}</label>
                <select 
                  value={newSubject.teacherId}
                  onChange={(e) => setNewSubject({...newSubject, teacherId: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{transData(t.name, lang)}</option>
                  ))}
                </select>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowSubjectModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer">
                  {trans("إلغاء", "Cancel")}
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer">
                  {trans("حفظ وتسجيل المادة", "Save Subject")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

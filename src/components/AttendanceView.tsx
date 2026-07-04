import React, { useState } from 'react';
import { CheckSquare, Calendar, Check, X, AlertCircle, RefreshCw, UserCheck, Search } from 'lucide-react';
import { AttendanceRecord, Student, Teacher, GradeClass } from '../types';
import { transData } from '../lib/translateHelper';

interface AttendanceViewProps {
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  students: Student[];
  teachers: Teacher[];
  classes: GradeClass[];
  lang?: 'ar' | 'en';
}

export default function AttendanceView({
  attendance,
  setAttendance,
  students,
  teachers,
  classes,
  lang = 'ar'
}: AttendanceViewProps) {
  const [activeMode, setActiveMode] = useState<'students' | 'teachers'>('students');
  const [selectedDate, setSelectedDate] = useState('2026-07-01');
  const [selectedGrade, setSelectedGrade] = useState('الصف الأول الثانوي');
  const [selectedDivision, setSelectedDivision] = useState('أ');
  const [searchTerm, setSearchTerm] = useState('');

  const trans = (ar: string, en: string) => lang === 'ar' ? ar : en;

  // Filter students based on selection
  const filteredStudents = students.filter(st => 
    st.grade === selectedGrade && 
    st.division === selectedDivision &&
    st.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find attendance record or yield default
  const getRecordStatus = (id: string) => {
    const rec = attendance.find(r => r.studentId === id && r.date === selectedDate);
    return rec ? rec.status : 'حاضر'; // default present
  };

  const getRecordNotes = (id: string) => {
    const rec = attendance.find(r => r.studentId === id && r.date === selectedDate);
    return rec ? rec.notes : '';
  };

  // Modify attendance record
  const handleStatusChange = (id: string, status: 'حاضر' | 'غائب' | 'متأخر' | 'بعذر') => {
    const existingIndex = attendance.findIndex(r => r.studentId === id && r.date === selectedDate);
    
    if (existingIndex !== -1) {
      const updated = [...attendance];
      updated[existingIndex] = { ...updated[existingIndex], status };
      setAttendance(updated);
    } else {
      const record: AttendanceRecord = {
        id: `att${Date.now()}-${id}`,
        studentId: id,
        date: selectedDate,
        status,
        notes: ''
      };
      setAttendance([...attendance, record]);
    }
  };

  // Modify attendance notes
  const handleNotesChange = (id: string, notes: string) => {
    const existingIndex = attendance.findIndex(r => r.studentId === id && r.date === selectedDate);
    
    if (existingIndex !== -1) {
      const updated = [...attendance];
      updated[existingIndex] = { ...updated[existingIndex], notes };
      setAttendance(updated);
    } else {
      const record: AttendanceRecord = {
        id: `att${Date.now()}-${id}`,
        studentId: id,
        date: selectedDate,
        status: 'حاضر',
        notes
      };
      setAttendance([...attendance, record]);
    }
  };

  // Today statistics
  const getStatistics = () => {
    const ids = activeMode === 'students' ? filteredStudents.map(s => s.id) : filteredTeachers.map(t => t.id);
    const dayRecords = attendance.filter(r => r.date === selectedDate && ids.includes(r.studentId));
    
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    ids.forEach(id => {
      const rec = dayRecords.find(r => r.studentId === id);
      const status = rec ? rec.status : 'حاضر'; // default present
      if (status === 'حاضر') present++;
      else if (status === 'غائب') absent++;
      else if (status === 'متأخر') late++;
      else if (status === 'بعذر') excused++;
    });

    const total = ids.length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 100;

    return { total, present, absent, late, excused, rate };
  };

  const stats = getStatistics();

  return (
    <div className={`space-y-6 animate-in fade-in duration-200 ${lang === 'ar' ? 'text-right' : 'text-left'}`} id="attendance-view-wrapper">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{trans("شاشات رصد الغياب والحضور اليومي", "Daily Attendance & Leave Management")}</h2>
          <p className="text-xs text-gray-500">{trans("رصد الغياب الصباحي وحصص النشاط المدرسي وتوثيق الأعذار المرضية والملاحظات السلوكية", "Morning check-in, tracking daily attendance, medical leaves, and behavior notes")}</p>
        </div>
        
        {/* Toggle Mode */}
        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-xs shrink-0 self-start">
          <button
            onClick={() => { setActiveMode('students'); setSearchTerm(''); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'students' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {trans("حضور الطلاب", "Student Attendance")}
          </button>
          <button
            onClick={() => { setActiveMode('teachers'); setSearchTerm(''); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'teachers' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {trans("حضور الهيئة التعليمية", "Staff Attendance")}
          </button>
        </div>
      </div>

      {/* Control Ribbon */}
      <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Date Picker */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold block">{trans("تاريخ الرصد اليومي:", "Daily Tracking Date:")}</span>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-50 border border-gray-250 rounded-lg px-3 py-1 text-xs focus:ring-1 focus:ring-blue-500 text-gray-800 font-bold"
            />
          </div>

          {activeMode === 'students' && (
            <>
              {/* Grade */}
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold block">{trans("الصف المستهدف:", "Target Grade:")}</span>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="bg-gray-50 border border-gray-250 rounded-lg px-3 py-1 text-xs focus:outline-none"
                >
                  <option value="الصف الأول الثانوي">{trans("الصف الأول الثانوي", "1st Grade - Secondary")}</option>
                  <option value="الصف الثاني الثانوي">{trans("الصف الثاني الثانوي", "2nd Grade - Secondary")}</option>
                  <option value="الصف الثالث المتوسط">{trans("الصف الثالث المتوسط", "3rd Grade - Intermediate")}</option>
                  <option value="الصف الأول المتوسط">{trans("الصف الأول المتوسط", "1st Grade - Intermediate")}</option>
                </select>
              </div>

              {/* Division */}
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold block">{trans("الشعبة الدراسية:", "Division:")}</span>
                <div className="flex items-center gap-1">
                  {['أ', 'ب', 'ج'].map(div => (
                    <button
                      key={div}
                      onClick={() => setSelectedDivision(div)}
                      className={`w-7 h-7 rounded-lg text-xs font-black border cursor-pointer transition-colors ${
                        selectedDivision === div 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                          : 'bg-gray-50 border-gray-250 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {transData(div, lang)}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Search bar inside list */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold block">{trans("تصفية بالاسم:", "Filter by Name:")}</span>
            <div className="relative">
              <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${lang === 'ar' ? 'right-2.5' : 'left-2.5'}`} size={13} />
              <input 
                type="text"
                placeholder={trans("بحث سريع...", "Quick search...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`bg-gray-50 border border-gray-250 rounded-lg py-1 text-xs focus:outline-none w-44 ${
                  lang === 'ar' ? 'pr-7 pl-3' : 'pl-7 pr-3'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Realtime stats badge */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-4 shrink-0">
          <div className="text-center">
            <span className="text-lg font-black text-blue-700 block leading-none">{stats.rate}%</span>
            <span className="text-[8px] text-blue-500 font-bold block mt-1">{trans("نسبة الحضور", "Attendance Rate")}</span>
          </div>
          <div className="w-px h-8 bg-blue-200"></div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] text-blue-900 font-bold">
            <div>{trans("حاضر:", "Present:")} <span className="text-green-600">{stats.present + stats.late}</span></div>
            <div>{trans("غائب:", "Absent:")} <span className="text-red-500">{stats.absent}</span></div>
            <div>{trans("متأخر:", "Late:")} <span className="text-amber-500">{stats.late}</span></div>
            <div>{trans("بعذر:", "Excused:")} <span className="text-blue-500">{stats.excused}</span></div>
          </div>
        </div>
      </div>

      {/* Interactive Attendance Log Sheet */}
      <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("الاسم الكامل", "Full Name")}</th>
                <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  {activeMode === 'students' ? trans("الرقم الأكاديمي", "Academic ID") : trans("البريد الإلكتروني", "Email Address")}
                </th>
                {activeMode === 'students' && (
                  <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("الصف والشعبة", "Grade / Division")}</th>
                )}
                <th className="px-4 py-3.5 font-bold text-center">{trans("الحالة اليومية المعتمدة", "Daily Attendance Status")}</th>
                <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("الملاحظات والأعذار", "Notes & Excuses")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {activeMode === 'students' ? (
                filteredStudents.length > 0 ? (
                  filteredStudents.map((st) => {
                    const currentStatus = getRecordStatus(st.id);
                    return (
                      <tr key={st.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-gray-900">
                          <div className="flex items-center gap-2">
                            <span>{st.gender === 'ذكر' ? '👨‍🎓' : '👩‍🎓'}</span>
                            <span>{transData(st.name, lang)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-gray-700">{st.academicId}</td>
                        <td className="px-4 py-3.5 text-xs text-gray-600 font-medium">
                          {transData(st.grade, lang)} - {transData(st.division, lang)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-1.5">
                            {[
                              { id: 'حاضر', label: trans('حاضر', 'Present'), color: 'bg-green-600 text-white border-green-600', inactive: 'bg-white text-green-600 border-green-200 hover:bg-green-50' },
                              { id: 'متأخر', label: trans('متأخر', 'Late'), color: 'bg-amber-500 text-white border-amber-500', inactive: 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50' },
                              { id: 'غائب', label: trans('غائب', 'Absent'), color: 'bg-red-500 text-white border-red-500', inactive: 'bg-white text-red-600 border-red-200 hover:bg-red-50' },
                              { id: 'بعذر', label: trans('بعذر', 'Excused'), color: 'bg-blue-500 text-white border-blue-500', inactive: 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50' }
                            ].map((btn) => {
                              const isSel = currentStatus === btn.id;
                              return (
                                <button
                                  key={btn.id}
                                  onClick={() => handleStatusChange(st.id, btn.id as any)}
                                  className={`px-3 py-1 text-[10px] font-bold border rounded-lg cursor-pointer transition-all ${
                                    isSel ? btn.color : btn.inactive
                                  }`}
                                >
                                  {btn.label}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs">
                          <input 
                            type="text"
                            placeholder={trans("اكتب ملاحظة أو عذر...", "Type notes or excuse...")}
                            value={getRecordNotes(st.id)}
                            onChange={(e) => handleNotesChange(st.id, e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-gray-700"
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400 font-medium text-xs">
                      {trans("لا يوجد طلاب مسجلون في هذا الصف والشعبة حالياً.", "No students registered in this class and division.")}
                    </td>
                  </tr>
                )
              ) : (
                filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teach) => {
                    const currentStatus = getRecordStatus(teach.id);
                    return (
                      <tr key={teach.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-gray-900">
                          <div className="flex items-center gap-2">
                            <span>👨‍🏫</span>
                            <div>
                              <span>{transData(teach.name, lang)}</span>
                              <span className="block text-[10px] text-gray-400 font-medium">{transData(teach.specialization, lang)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-gray-500">{teach.email}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-1.5">
                            {[
                              { id: 'حاضر', label: trans('حاضر', 'Present'), color: 'bg-green-600 text-white border-green-600', inactive: 'bg-white text-green-600 border-green-200 hover:bg-green-50' },
                              { id: 'متأخر', label: trans('متأخر', 'Late'), color: 'bg-amber-500 text-white border-amber-500', inactive: 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50' },
                              { id: 'غائب', label: trans('غائب', 'Absent'), color: 'bg-red-500 text-white border-red-500', inactive: 'bg-white text-red-600 border-red-200 hover:bg-red-50' },
                              { id: 'بعذر', label: trans('بعذر', 'Excused'), color: 'bg-blue-500 text-white border-blue-500', inactive: 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50' }
                            ].map((btn) => {
                              const isSel = currentStatus === btn.id;
                              return (
                                <button
                                  key={btn.id}
                                  onClick={() => handleStatusChange(teach.id, btn.id as any)}
                                  className={`px-3 py-1 text-[10px] font-bold border rounded-lg cursor-pointer transition-all ${
                                    isSel ? btn.color : btn.inactive
                                  }`}
                                >
                                  {btn.label}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs">
                          <input 
                            type="text"
                            placeholder={trans("اكتب ملاحظة أو عذر...", "Type notes or excuse...")}
                            value={getRecordNotes(teach.id)}
                            onChange={(e) => handleNotesChange(teach.id, e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-gray-700"
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400 font-medium text-xs">
                      {trans("لا يوجد معلمون مطابقون لمعيار البحث.", "No teachers match current search criteria.")}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

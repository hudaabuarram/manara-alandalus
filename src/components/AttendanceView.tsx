import React, { useState } from 'react';
import { CheckSquare, Calendar, Check, X, AlertCircle, RefreshCw, UserCheck, Search } from 'lucide-react';
import { AttendanceRecord, Student, Teacher, GradeClass } from '../types';

interface AttendanceViewProps {
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  students: Student[];
  teachers: Teacher[];
  classes: GradeClass[];
}

export default function AttendanceView({
  attendance,
  setAttendance,
  students,
  teachers,
  classes
}: AttendanceViewProps) {
  const [activeMode, setActiveMode] = useState<'students' | 'teachers'>('students');
  const [selectedDate, setSelectedDate] = useState('2026-07-01');
  const [selectedGrade, setSelectedGrade] = useState('الصف الأول الثانوي');
  const [selectedDivision, setSelectedDivision] = useState('أ');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter students based on selection
  const filteredStudents = students.filter(st => 
    st.grade === selectedGrade && 
    st.division === selectedDivision &&
    st.name.includes(searchTerm)
  );

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(t => 
    t.name.includes(searchTerm)
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
      const status = rec ? rec.status : 'حاضر'; // default
      if (status === 'حاضر') present++;
      else if (status === 'غائب') absent++;
      else if (status === 'متأخر') late++;
      else if (status === 'بعذر') excused++;
    });

    return { present, absent, late, excused, total: ids.length };
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" id="attendance-view-container">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">رصد الحضور والغياب اليومي</h2>
          <p className="text-xs text-gray-500">منظومة ذكية للتحكم بحالات التواجد المدرسي اليومي وتوثيق الأعذار الطبية</p>
        </div>

        {/* Quick Student vs Teachers selector */}
        <div className="bg-gray-100 p-1 rounded-lg flex items-center">
          <button 
            onClick={() => { setActiveMode('students'); setSearchTerm(''); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeMode === 'students' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            حضور الطلاب والطالبات
          </button>
          <button 
            onClick={() => { setActiveMode('teachers'); setSearchTerm(''); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeMode === 'teachers' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            حضور الهيئة التدريسية
          </button>
        </div>
      </div>

      {/* Date and Grade Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex flex-wrap items-center gap-4">
        
        {/* Date picker */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blue-600" />
          <span className="text-xs font-bold text-gray-700">تاريخ الرصد:</span>
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-50 border border-gray-250 rounded-lg px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {activeMode === 'students' && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">الصف:</span>
              <select 
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-gray-50 border border-gray-250 rounded-lg px-3 py-1 text-xs focus:outline-none"
              >
                {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">الشعبة:</span>
              <select 
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-gray-50 border border-gray-250 rounded-lg px-3 py-1 text-xs focus:outline-none"
              >
                <option value="أ">الشعبة أ</option>
                <option value="ب">الشعبة ب</option>
                <option value="ج">الشعبة ج</option>
              </select>
            </div>
          </>
        )}

        {/* Local search */}
        <div className="flex-1 relative min-w-44">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input 
            type="text"
            placeholder={activeMode === 'students' ? "ابحث باسم الطالب..." : "ابحث باسم المعلم..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-250 rounded-lg pr-8 pl-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

      </div>

      {/* KPI statistics of today's attendance */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="attendance-statistics">
        
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-green-50 text-green-600 flex items-center justify-center font-bold">
            {stats.present}
          </div>
          <div>
            <span className="text-gray-500 text-[10px] font-bold block">حاضرون</span>
            <span className="text-sm font-bold text-gray-800">{stats.present} من {stats.total}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            {stats.late}
          </div>
          <div>
            <span className="text-gray-500 text-[10px] font-bold block">متأخرون</span>
            <span className="text-sm font-bold text-gray-800">{stats.late} طلاب</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-red-50 text-red-600 flex items-center justify-center font-bold">
            {stats.absent}
          </div>
          <div>
            <span className="text-gray-500 text-[10px] font-bold block">غائبون</span>
            <span className="text-sm font-bold text-gray-800">{stats.absent} طلاب</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            {stats.excused}
          </div>
          <div>
            <span className="text-gray-500 text-[10px] font-bold block">غياب بعذر</span>
            <span className="text-sm font-bold text-gray-800">{stats.excused} طلاب</span>
          </div>
        </div>

      </div>

      {/* Roster list spreadsheet */}
      <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden" id="attendance-roster-sheet">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3.5 font-bold">الاسم الكامل</th>
                <th className="px-4 py-3.5 font-bold text-center">الحالة الحالية</th>
                <th className="px-4 py-3.5 font-bold">ملاحظات الأعذار الطبية أو السلوكية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {activeMode === 'students' ? (
                filteredStudents.map((student) => {
                  const currentStatus = getRecordStatus(student.id);
                  const currentNotes = getRecordNotes(student.id);

                  return (
                    <tr key={student.id} className="hover:bg-gray-50/20 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-gray-900">
                        <div className="flex flex-col">
                          <span>{student.name}</span>
                          <span className="text-[10px] text-gray-400 font-bold">الرقم الأكاديمي: {student.academicId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex gap-1 bg-gray-100/70 p-1 rounded-lg">
                          {[
                            { code: 'حاضر', label: 'حاضر', color: 'bg-green-600 text-white shadow-xs' },
                            { code: 'متأخر', label: 'متأخر', color: 'bg-amber-500 text-white shadow-xs' },
                            { code: 'غائب', label: 'غائب', color: 'bg-red-600 text-white shadow-xs' },
                            { code: 'بعذر', label: 'بعذر', color: 'bg-blue-600 text-white shadow-xs' },
                          ].map(opt => {
                            const isSel = currentStatus === opt.code;
                            return (
                              <button
                                key={opt.code}
                                type="button"
                                onClick={() => handleStatusChange(student.id, opt.code as any)}
                                className={`px-3 py-1 rounded text-xs font-extrabold transition-all duration-150 ${
                                  isSel ? opt.color : 'text-gray-500 hover:bg-gray-200'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <input 
                          type="text"
                          value={currentNotes}
                          onChange={(e) => handleNotesChange(student.id, e.target.value)}
                          placeholder="تأخر عن الطابور الصباحي، تقرير طبي، سلوك..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                filteredTeachers.map((teacher) => {
                  const currentStatus = getRecordStatus(teacher.id);
                  const currentNotes = getRecordNotes(teacher.id);

                  return (
                    <tr key={teacher.id} className="hover:bg-gray-50/20 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-gray-900">
                        <div className="flex flex-col">
                          <span>{teacher.name}</span>
                          <span className="text-[10px] text-gray-400 font-bold">{teacher.specialization}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex gap-1 bg-gray-100/70 p-1 rounded-lg">
                          {[
                            { code: 'حاضر', label: 'حاضر', color: 'bg-green-600 text-white shadow-xs' },
                            { code: 'متأخر', label: 'متأخر', color: 'bg-amber-500 text-white shadow-xs' },
                            { code: 'غائب', label: 'غائب', color: 'bg-red-600 text-white shadow-xs' },
                            { code: 'بعذر', label: 'إجازة', color: 'bg-blue-600 text-white shadow-xs' },
                          ].map(opt => {
                            const isSel = currentStatus === opt.code;
                            return (
                              <button
                                key={opt.code}
                                type="button"
                                onClick={() => handleStatusChange(teacher.id, opt.code as any)}
                                className={`px-3 py-1 rounded text-xs font-extrabold transition-all duration-150 ${
                                  isSel ? opt.color : 'text-gray-500 hover:bg-gray-200'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <input 
                          type="text"
                          value={currentNotes}
                          onChange={(e) => handleNotesChange(teacher.id, e.target.value)}
                          placeholder="تأخير بعذر، إذن كتابي من الإدارة..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

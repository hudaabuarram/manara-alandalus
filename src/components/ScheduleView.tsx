import React, { useState } from 'react';
import { Calendar, Plus, Printer, AlertTriangle, Check, BookOpen, Clock, X, Trash } from 'lucide-react';
import { ScheduleItem, Subject, Teacher, GradeClass } from '../types';
import { transData } from '../lib/translateHelper';

interface ScheduleViewProps {
  schedule: ScheduleItem[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  subjects: Subject[];
  teachers: Teacher[];
  classes: GradeClass[];
  lang?: 'ar' | 'en';
}

export default function ScheduleView({
  schedule,
  setSchedule,
  subjects,
  teachers,
  classes,
  lang = 'ar'
}: ScheduleViewProps) {
  const [selectedGrade, setSelectedGrade] = useState('الصف الأول الثانوي');
  const [selectedDivision, setSelectedDivision] = useState('أ');
  const [showAddSlot, setShowAddSlot] = useState(false);
  
  // Conflict checker and Form values
  const [newSlot, setNewSlot] = useState<Partial<ScheduleItem>>({
    subjectId: subjects[0]?.id || '',
    teacherId: teachers[0]?.id || '',
    day: 'الأحد',
    period: 1,
    room: 'قاعة ١٠١'
  });
  
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const trans = (ar: string, en: string) => lang === 'ar' ? ar : en;

  const days: Array<'الأحد' | 'الأثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس'> = ['الأحد', 'الأثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const periods = [1, 2, 3, 4, 5, 6];

  // Get active schedule for selected Grade and Division
  const activeSchedule = schedule.filter(item => 
    item.grade === selectedGrade && item.division === selectedDivision
  );

  // Find schedule item for specific day and period
  const getSlot = (day: string, period: number) => {
    return activeSchedule.find(item => item.day === day && item.period === period);
  };

  // Submit and check conflicts
  const handleAddSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictWarning(null);

    const subId = newSlot.subjectId;
    const teachId = newSlot.teacherId;
    const slotDay = newSlot.day;
    const slotPeriod = Number(newSlot.period);
    const slotRoom = newSlot.room;

    if (!subId || !teachId || !slotDay || !slotPeriod || !slotRoom) return;

    // 1. Teacher Overlap Check
    const teacherConflict = schedule.find(item => 
      item.day === slotDay && 
      item.period === slotPeriod && 
      item.teacherId === teachId
    );

    if (teacherConflict) {
      const teacherName = teachers.find(t => t.id === teachId)?.name || trans('المعلم', 'Teacher');
      setConflictWarning(trans(
        `تعارض في الجدول! المعلم (${teacherName}) مشغول بتدريس صف (${teacherConflict.grade} - الشعبة ${teacherConflict.division}) في الحصة ${slotPeriod} يوم ${slotDay}.`,
        `Schedule conflict! Teacher (${transData(teacherName, lang)}) is busy teaching class (${transData(teacherConflict.grade, lang)} - Division ${transData(teacherConflict.division, lang)}) in period ${slotPeriod} on ${transData(slotDay, lang)}.`
      ));
      return;
    }

    // 2. Room Occupancy Check
    const roomConflict = schedule.find(item => 
      item.day === slotDay && 
      item.period === slotPeriod && 
      item.room === slotRoom
    );

    if (roomConflict) {
      setConflictWarning(trans(
        `تعارض في القاعات! القاعة المحددة (${slotRoom}) محجوزة لصف (${roomConflict.grade} - الشعبة ${roomConflict.division}) في الحصة ${slotPeriod} يوم ${slotDay}.`,
        `Classroom conflict! Room (${transData(slotRoom, lang)}) is reserved for class (${transData(roomConflict.grade, lang)} - Division ${transData(roomConflict.division, lang)}) in period ${slotPeriod} on ${transData(slotDay, lang)}.`
      ));
      return;
    }

    // 3. Prevent duplicate for this class/division in the same period
    const classConflict = schedule.find(item => 
      item.grade === selectedGrade && 
      item.division === selectedDivision && 
      item.day === slotDay && 
      item.period === slotPeriod
    );

    if (classConflict) {
      setConflictWarning(trans(
        `هذا الصف الدراسي والشعبة لديهم مادة مقررة بالفعل في الحصة ${slotPeriod} يوم ${slotDay}. قم بحذف المادة القديمة أولاً.`,
        `This grade and division already have a subject scheduled in period ${slotPeriod} on ${transData(slotDay, lang)}. Delete the old slot first.`
      ));
      return;
    }

    // Success - add slot
    const slot: ScheduleItem = {
      id: `sch${Date.now()}`,
      grade: selectedGrade,
      division: selectedDivision,
      subjectId: subId,
      teacherId: teachId,
      day: slotDay as any,
      period: slotPeriod,
      room: slotRoom
    };

    setSchedule([...schedule, slot]);
    setShowAddSlot(false);
  };

  const handleDeleteSlot = (id: string) => {
    if (confirm(trans("هل تريد إزالة هذه الحصة الدراسية من الجدول؟", "Do you want to remove this period from the schedule?"))) {
      setSchedule(schedule.filter(item => item.id !== id));
    }
  };

  const getSubjectName = (subId: string) => {
    const sub = subjects.find(s => s.id === subId);
    return sub ? sub.name : trans('مادة غير معروفة', 'Unknown Subject');
  };

  const getTeacherName = (tId: string) => {
    const t = teachers.find(teach => teach.id === tId);
    return t ? t.name : trans('معلم غير معروف', 'Unknown Teacher');
  };

  const handlePrintSchedule = () => {
    window.print();
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-200 ${lang === 'ar' ? 'text-right' : 'text-left'}`} id="schedule-dashboard-container">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{trans("تنظيم وإدارة الجدول الدراسي", "School Schedule & Timetable")}</h2>
          <p className="text-xs text-gray-500">{trans("المخطط الإسبوعي وتسكين المعلمين، تلافي التعارض في الحصص والقاعات وتخطيط الشعب", "Weekly timetable, classroom planning, teacher allocation, and conflict resolution")}</p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={handlePrintSchedule}
            className="bg-white border border-gray-250 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
          >
            <Printer size={15} />
            <span>{trans("طباعة الجدول", "Print Schedule")}</span>
          </button>
          
          <button 
            onClick={() => setShowAddSlot(true)}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            <Plus size={15} />
            <span>{trans("تسكين حصة جديدة", "Schedule New Slot")}</span>
          </button>
        </div>
      </div>

      {/* Class and Division Filter Ribbon */}
      <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex flex-wrap items-center justify-between gap-4" id="schedule-filters">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold block">{trans("الصف الدراسي المحدد:", "Selected Grade:")}</span>
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

          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold block">{trans("الشعبة:", "Division:")}</span>
            <div className="flex items-center gap-1">
              {['أ', 'ب', 'ج'].map((div) => {
                const isAct = selectedDivision === div;
                return (
                  <button
                    key={div}
                    onClick={() => setSelectedDivision(div)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      isAct 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                        : 'bg-gray-50 border-gray-250 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {transData(div, lang)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-blue-50/50 px-3 py-2 rounded-lg border border-blue-100/50">
          <BookOpen className="text-blue-600" size={16} />
          <span className="text-[10px] text-blue-900 font-bold">
            {trans("الفصل الدراسي الحالي: الفصل الدراسي الأول (خريف ٢٠٢٦)", "Current Semester: First Semester (Fall 2026)")}
          </span>
        </div>
      </div>

      {/* Main Weekly Interactive Grid */}
      <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden" id="print-schedule-area">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-gray-700 font-bold">
                <th className={`p-3.5 border-r border-gray-150 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("اليوم / الحصص", "Day / Periods")}</th>
                {periods.map(p => (
                  <th key={p} className="p-3.5 text-center border-r border-gray-150 w-40">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-gray-500">{trans("الحصة", "Period")} {p}</span>
                      <span className="text-[9px] font-mono text-gray-400 mt-0.5">
                        {p === 1 ? '08:00 - 08:45' :
                         p === 2 ? '08:50 - 09:35' :
                         p === 3 ? '09:55 - 10:40' :
                         p === 4 ? '10:45 - 11:30' :
                         p === 5 ? '11:50 - 12:35' : '12:40 - 13:25'}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {days.map((day) => (
                <tr key={day} className="hover:bg-gray-50/30">
                  <td className={`p-4 font-bold bg-gray-50 border-r border-gray-150 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                    {transData(day, lang)}
                  </td>
                  {periods.map((period) => {
                    const slot = getSlot(day, period);
                    return (
                      <td key={period} className="p-2 border-r border-gray-150 text-center relative group min-h-24">
                        {slot ? (
                          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2.5 animate-in zoom-in-95 duration-100 hover:shadow-xs transition-shadow flex flex-col justify-between min-h-[5.5rem]">
                            <div>
                              <div className="font-bold text-blue-900 text-xs truncate">{transData(getSubjectName(slot.subjectId), lang)}</div>
                              <div className="text-[9px] text-blue-700 mt-1 truncate font-medium">{transData(getTeacherName(slot.teacherId), lang)}</div>
                            </div>
                            <div className="flex items-center justify-between border-t border-blue-100/60 mt-1.5 pt-1">
                              <span className="font-bold text-[9px] text-blue-600 bg-white border border-blue-100 px-1.5 py-0.5 rounded-sm">{transData(slot.room, lang)}</span>
                              <button 
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 p-0.5 rounded cursor-pointer"
                                title={trans("حذف الحصة", "Remove slot")}
                              >
                                <Trash size={11} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center text-gray-300 italic text-[9px] h-full min-h-[5.5rem] border border-dashed border-gray-100 rounded-lg">
                            -
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddSlot && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Clock className="text-blue-600" size={18} />
                <span>{trans("تسكين وتخطيط حصة دراسية", "Schedule School Period Slot")}</span>
              </h3>
              <button onClick={() => setShowAddSlot(false)} className="p-1 rounded hover:bg-gray-200 text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAddSlotSubmit} className="p-6 space-y-4">
              {conflictWarning && (
                <div className="p-3 bg-red-50 border border-red-150 text-red-800 rounded-lg text-xs font-medium flex items-start gap-2.5 animate-bounce">
                  <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={15} />
                  <span>{conflictWarning}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">{trans("الصف الدراسي المختار", "Selected Grade")}</label>
                  <input 
                    type="text" disabled 
                    value={transData(selectedGrade, lang)}
                    className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">{trans("الشعبة", "Division")}</label>
                  <input 
                    type="text" disabled 
                    value={transData(selectedDivision, lang)}
                    className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 font-bold"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-gray-700 block">{trans("المادة الدراسية المقررة", "Subject *")}</label>
                  <select 
                    value={newSlot.subjectId}
                    onChange={(e) => setNewSlot({...newSlot, subjectId: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{transData(s.name, lang)} ({s.code})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-gray-700 block">{trans("المعلم المكلّف بالتدريس", "Assigned Teacher *")}</label>
                  <select 
                    value={newSlot.teacherId}
                    onChange={(e) => setNewSlot({...newSlot, teacherId: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{transData(t.name, lang)} - {transData(t.specialization, lang)}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">{trans("اليوم", "Day *")}</label>
                  <select 
                    value={newSlot.day}
                    onChange={(e) => setNewSlot({...newSlot, day: e.target.value as any})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>{transData(d, lang)}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">{trans("رقم الحصة الدراسية", "Period Number *")}</label>
                  <select 
                    value={newSlot.period}
                    onChange={(e) => setNewSlot({...newSlot, period: Number(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                  >
                    {periods.map(p => (
                      <option key={p} value={p}>{trans("الحصة", "Period")} {p}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-bold text-gray-700 block">{trans("القاعة أو المختبر المخصص", "Assigned Room / Lab *")}</label>
                  <select 
                    value={newSlot.room}
                    onChange={(e) => setNewSlot({...newSlot, room: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="قاعة ١٠١">{trans("قاعة ١٠١", "Room 101")}</option>
                    <option value="قاعة ١٠٢">{trans("قاعة ١٠٢", "Room 102")}</option>
                    <option value="مختبر الحاسب">{trans("مختبر الحاسب", "Computer Lab")}</option>
                    <option value="مختبر العلوم">{trans("مختبر العلوم", "Science Lab")}</option>
                    <option value="المصادر والمكتبة">{trans("المصادر والمكتبة", "Library & Sources")}</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddSlot(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer"
                >
                  {trans("إلغاء", "Cancel")}
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  {trans("تسكين وتأكيد الحصة", "Confirm Slot")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

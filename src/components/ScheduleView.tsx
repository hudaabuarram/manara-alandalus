import React, { useState } from 'react';
import { Calendar, Plus, Printer, AlertTriangle, Check, BookOpen, Clock, X, Trash } from 'lucide-react';
import { ScheduleItem, Subject, Teacher, GradeClass } from '../types';

interface ScheduleViewProps {
  schedule: ScheduleItem[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  subjects: Subject[];
  teachers: Teacher[];
  classes: GradeClass[];
}

export default function ScheduleView({
  schedule,
  setSchedule,
  subjects,
  teachers,
  classes
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
      const teacherName = teachers.find(t => t.id === teachId)?.name || 'المعلم';
      setConflictWarning(`تعارض في الجدول! المعلم (${teacherName}) مشغول بتدريس صف (${teacherConflict.grade} - الشعبة ${teacherConflict.division}) في الحصة ${slotPeriod} يوم ${slotDay}.`);
      return;
    }

    // 2. Room Occupancy Check
    const roomConflict = schedule.find(item => 
      item.day === slotDay && 
      item.period === slotPeriod && 
      item.room === slotRoom
    );

    if (roomConflict) {
      setConflictWarning(`تعارض في القاعات! القاعة المحددة (${slotRoom}) محجوزة لصف (${roomConflict.grade} - الشعبة ${roomConflict.division}) في الحصة ${slotPeriod} يوم ${slotDay}.`);
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
      setConflictWarning(`هذا الصف الدراسي والشعبة لديهم مادة مقررة بالفعل في الحصة ${slotPeriod} يوم ${slotDay}. قم بحذف المادة القديمة أولاً.`);
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
    if (confirm("هل تريد إزالة هذه الحصة الدراسية من الجدول المعتمد؟")) {
      setSchedule(schedule.filter(item => item.id !== id));
    }
  };

  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || '';
  const getTeacherName = (id: string) => teachers.find(t => t.id === id)?.name || '';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" id="schedule-view-container">
      
      {/* Header and Classroom selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="schedule-header">
        <div>
          <h2 className="text-lg font-bold text-gray-900">جدولة الحصص والخطط الدراسية</h2>
          <p className="text-xs text-gray-500">منظم أسبوعي ذكي مع خوارزمية رصد تعارض المعلمين والمختبرات المدرسية</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-xs font-bold"
            title="طباعة الجدول الأسبوعي"
          >
            <Printer size={15} />
            <span>طباعة الجدول</span>
          </button>
          
          <button 
            onClick={() => {
              setConflictWarning(null);
              setShowAddSlot(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>إضافة حصة دراسية</span>
          </button>
        </div>
      </div>

      {/* Select active Grade and Division */}
      <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex items-center gap-4 flex-wrap" id="schedule-selectors">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">عرض جدول الصف:</span>
          <select 
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-gray-50 border border-gray-250 rounded-lg px-3 py-1 text-xs focus:outline-none"
          >
            {classes.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">الشعبة:</span>
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
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden print:border-none print:shadow-none" id="weekly-schedule-grid">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 border-l border-gray-150 font-bold text-xs text-gray-700 w-28 text-center">اليوم / الحصة</th>
                {periods.map(p => (
                  <th key={p} className="p-4 border-l border-gray-150 font-bold text-xs text-gray-700 text-center">
                    <div className="font-extrabold text-blue-600">الحصة {p}</div>
                    <div className="text-[9px] text-gray-400 font-medium mt-0.5">
                      {p === 1 ? '08:00 - 08:45' :
                       p === 2 ? '08:45 - 09:30' :
                       p === 3 ? '09:45 - 10:30' : // Break in-between
                       p === 4 ? '10:30 - 11:15' :
                       p === 5 ? '11:30 - 12:15' : '12:15 - 01:00'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {days.map(day => (
                <tr key={day} className="hover:bg-gray-50/20 transition-colors">
                  <td className="p-4 border-l border-gray-150 font-extrabold text-xs text-gray-900 bg-gray-50/50 text-center">
                    {day}
                  </td>
                  {periods.map(period => {
                    const slot = getSlot(day, period);
                    return (
                      <td key={period} className="p-2 border-l border-gray-150 min-h-[90px] w-40 relative group">
                        {slot ? (
                          <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-2.5 flex flex-col justify-between h-full transition-shadow hover:shadow-xs text-right">
                            <button 
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 transition-opacity p-0.5 rounded hover:bg-rose-50"
                              title="حذف الحصة"
                            >
                              <Trash size={12} />
                            </button>
                            <div>
                              <div className="font-bold text-xs text-blue-900 line-clamp-1">{getSubjectName(slot.subjectId)}</div>
                              <div className="text-[10px] text-gray-500 font-medium mt-1">{getTeacherName(slot.teacherId)}</div>
                            </div>
                            <div className="text-[9px] font-bold text-blue-600 bg-blue-100/50 rounded px-1.5 py-0.5 mt-2 self-start">
                              {slot.room}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-lg py-6 text-gray-300 font-medium text-[10px] group-hover:border-blue-300 group-hover:text-blue-500 transition-all cursor-pointer"
                               onClick={() => {
                                 setConflictWarning(null);
                                 setNewSlot({...newSlot, day: day as any, period});
                                 setShowAddSlot(true);
                               }}>
                            + شاغرة
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">تسجيل حصة جديدة بالجدول الدراسى</h3>
              <button onClick={() => setShowAddSlot(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>

            <form onSubmit={handleAddSlotSubmit} className="p-6 space-y-4">
              
              {/* Collision alert window */}
              {conflictWarning && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-3.5 rounded-lg flex items-start gap-2.5 animate-bounce">
                  <AlertTriangle className="shrink-0 mt-0.5 text-red-600" size={16} />
                  <p className="text-[11px] font-bold leading-normal">{conflictWarning}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-700">
                <div>
                  <span className="block mb-1">اليوم المعتمد</span>
                  <select 
                    value={newSlot.day}
                    onChange={(e) => setNewSlot({...newSlot, day: e.target.value as any})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white"
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <span className="block mb-1">رقم الحصة الدراسية</span>
                  <select 
                    value={newSlot.period}
                    onChange={(e) => setNewSlot({...newSlot, period: Number(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white"
                  >
                    {periods.map(p => <option key={p} value={p}>الحصة {p}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">المادة المقررة *</label>
                <select 
                  value={newSlot.subjectId}
                  onChange={(e) => {
                    const sub = subjects.find(s => s.id === e.target.value);
                    setNewSlot({
                      ...newSlot, 
                      subjectId: e.target.value,
                      teacherId: sub ? sub.teacherId : newSlot.teacherId
                    });
                  }}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">المعلم المكلف بالتدريس *</label>
                <select 
                  value={newSlot.teacherId}
                  onChange={(e) => setNewSlot({...newSlot, teacherId: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">القاعة أو مختبر التدريس *</label>
                <input 
                  type="text" 
                  required
                  value={newSlot.room}
                  onChange={(e) => setNewSlot({...newSlot, room: e.target.value})}
                  placeholder="مثال: قاعة ١٠١ أو مختبر العلوم"
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowAddSlot(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-2">
                  <Check size={14} />
                  <span>تثبيت في الجدول</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

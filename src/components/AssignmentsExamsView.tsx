import React, { useState } from 'react';
import { 
  FileText, PenTool, Award, Plus, CheckCircle, ChevronLeft, 
  Trash, Save, Users, AlertCircle, FileCheck, Star, Trash2, X
} from 'lucide-react';
import { Assignment, AssignmentSubmission, Exam, GradeRecord, Student, Subject, GradeClass } from '../types';

interface AssignmentsExamsViewProps {
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  submissions: AssignmentSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<AssignmentSubmission[]>>;
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  grades: GradeRecord[];
  setGrades: React.Dispatch<React.SetStateAction<GradeRecord[]>>;
  students: Student[];
  subjects: Subject[];
  classes: GradeClass[];
  activeSubTab?: 'assignments' | 'exams' | 'grades';
}

export default function AssignmentsExamsView({
  assignments,
  setAssignments,
  submissions,
  setSubmissions,
  exams,
  setExams,
  grades,
  setGrades,
  students,
  subjects,
  classes,
  activeSubTab = 'assignments'
}: AssignmentsExamsViewProps) {
  const [currentTab, setCurrentTab] = useState<'assignments' | 'exams' | 'grades'>(activeSubTab);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Modals
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showAddExam, setShowAddExam] = useState(false);

  // New states
  const [newAsm, setNewAsm] = useState<Partial<Assignment>>({
    title: '', subjectId: subjects[0]?.id || '', grade: 'الصف الأول الثانوي', division: 'أ', dueDate: '2026-07-10', maxPoints: 10, description: ''
  });

  const [newEx, setNewEx] = useState<Partial<Exam>>({
    title: '', type: 'شهري', subjectId: subjects[0]?.id || '', grade: 'الصف الأول الثانوي', date: '2026-07-20', time: '09:00', duration: '60', maxMarks: 20
  });

  // Grading states
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [assessmentType, setAssessmentType] = useState<'امتحان' | 'واجب' | 'مشاركة'>('امتحان');
  const [assessmentScore, setAssessmentScore] = useState(15);
  const [assessmentMax, setAssessmentMax] = useState(20);

  // Handle addition
  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsm.title) return;
    const a: Assignment = {
      id: `asm${Date.now()}`,
      title: newAsm.title,
      subjectId: newAsm.subjectId || subjects[0]?.id || '',
      grade: newAsm.grade || 'الصف الأول الثانوي',
      division: newAsm.division || 'أ',
      dueDate: newAsm.dueDate || '2026-07-10',
      maxPoints: Number(newAsm.maxPoints) || 10,
      description: newAsm.description || '',
      submissionsCount: 0
    };
    setAssignments([a, ...assignments]);
    setShowAddAssignment(false);
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEx.title) return;
    const ex: Exam = {
      id: `ex${Date.now()}`,
      title: newEx.title,
      type: newEx.type as any || 'شهري',
      subjectId: newEx.subjectId || subjects[0]?.id || '',
      grade: newEx.grade || 'الصف الأول الثانوي',
      date: newEx.date || '2026-07-20',
      time: newEx.time || '09:00',
      duration: newEx.duration || '60',
      maxMarks: Number(newEx.maxMarks) || 20
    };
    setExams([ex, ...exams]);
    setShowAddExam(false);
  };

  // Submit student grading record
  const handleRecordGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const g: GradeRecord = {
      id: `g${Date.now()}`,
      studentId: selectedStudentId,
      subjectId: selectedSubjectId,
      type: assessmentType,
      score: Number(assessmentScore),
      maxScore: Number(assessmentMax),
      date: new Date().toISOString().split('T')[0]
    };
    setGrades([g, ...grades]);
    alert("تم رصد وحفظ درجة التقييم للطالب بنجاح!");
  };

  // Submission review grading
  const handleGradeSubmission = (submId: string, score: number, feedback: string) => {
    const updated = submissions.map(sub => {
      if (sub.id === submId) {
        return { ...sub, score, feedback, status: 'تم التقييم' as any };
      }
      return sub;
    });
    setSubmissions(updated);
    alert("تم تقييم الواجب وحفظ التغذية الراجعة!");
  };

  // Get GPA and rank for students
  const getStudentRanking = () => {
    return students.map(st => {
      const studentGrades = grades.filter(g => g.studentId === st.id);
      if (studentGrades.length === 0) return { student: st, gpa: 100, status: 'ممتاز' };
      
      const totalScore = studentGrades.reduce((acc, g) => acc + g.score, 0);
      const totalMax = studentGrades.reduce((acc, g) => acc + g.maxScore, 0);
      const gpa = Math.round((totalScore / totalMax) * 100);
      
      let status = 'مقبول';
      if (gpa >= 90) status = 'ممتاز';
      else if (gpa >= 80) status = 'جيد جداً';
      else if (gpa >= 70) status = 'جيد';

      return { student: st, gpa, status };
    }).sort((a, b) => b.gpa - a.gpa);
  };

  const studentRanks = getStudentRanking();

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" id="assignments-exams-grades-container">
      
      {/* Sub Tabs */}
      <div className="flex border-b border-gray-200 bg-white p-1 rounded-xl shadow-xs" id="academic-tabs">
        {[
          { id: 'assignments', label: 'الواجبات والمهام المدرسية', icon: FileText },
          { id: 'exams', label: 'الامتحانات وجداول الاختبارات', icon: PenTool },
          { id: 'grades', label: 'ترتيب الطلاب ورصد الدرجات', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isAct = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentTab(tab.id as any);
                setSelectedAssignment(null);
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

      {/* VIEW 1: ASSIGNMENTS PORTAL */}
      {currentTab === 'assignments' && !selectedAssignment && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">مجلد الواجبات النشطة</h3>
              <p className="text-xs text-gray-500">متابعة تسليمات الواجبات من قبل الطلاب وتصحيحها فورياً</p>
            </div>
            <button 
              onClick={() => setShowAddAssignment(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>إنشاء واجب جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asm) => {
              const subName = subjects.find(s => s.id === asm.subjectId)?.name || 'مقرر دراسي';
              const asmSubs = submissions.filter(s => s.assignmentId === asm.id);
              const gradedCount = asmSubs.filter(s => s.status === 'تم التقييم').length;

              return (
                <div key={asm.id} className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">{subName}</span>
                      <span className="text-[10px] text-gray-400 font-bold">يستحق: {asm.dueDate}</span>
                    </div>
                    <h4 className="font-bold text-xs text-gray-900 mt-1">{asm.title}</h4>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{asm.description}</p>
                  </div>

                  <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 font-bold">
                      التسليمات: {asmSubs.length} | المصححة: {gradedCount}
                    </span>
                    <button 
                      onClick={() => setSelectedAssignment(asm)}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      استعراض وتصحيح الواجب ←
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Submissions Screen */}
      {selectedAssignment && (
        <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-6">
          <button 
            onClick={() => setSelectedAssignment(null)}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900"
          >
            ← العودة لقائمة الواجبات
          </button>

          <div>
            <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded font-bold">
              مادة: {subjects.find(s => s.id === selectedAssignment.subjectId)?.name}
            </span>
            <h3 className="text-sm font-bold text-gray-900 mt-2">تسليمات الطالب لـ: {selectedAssignment.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{selectedAssignment.description}</p>
          </div>

          <div className="border border-gray-150 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-right text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-bold">
                <tr>
                  <th className="px-4 py-3">اسم الطالب</th>
                  <th className="px-4 py-3">تاريخ ووقت الرفع</th>
                  <th className="px-4 py-3 text-center">الدرجة الممنوحة</th>
                  <th className="px-4 py-3 text-center">العملية / حالة التصحيح</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {submissions.filter(s => s.assignmentId === selectedAssignment.id).map((subm) => {
                  const studentName = students.find(s => s.id === subm.studentId)?.name || 'طالب المدرسة';
                  return (
                    <tr key={subm.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-bold text-gray-900">{studentName}</td>
                      <td className="px-4 py-3 font-mono text-gray-500">{subm.submittedAt}</td>
                      <td className="px-4 py-3 text-center font-bold text-blue-600">
                        {subm.score !== undefined ? `${subm.score} / ${selectedAssignment.maxPoints}` : '--'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {subm.status === 'تم التقييم' ? (
                            <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                              <CheckCircle size={10} /> تم التصحيح والتقييم
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input 
                                type="number" 
                                placeholder="الدرجة" 
                                min="0"
                                max={selectedAssignment.maxPoints}
                                className="w-16 bg-gray-50 border border-gray-250 rounded p-1 text-center font-bold"
                                id={`score-input-${subm.id}`}
                              />
                              <button 
                                onClick={() => {
                                  const inputEl = document.getElementById(`score-input-${subm.id}`) as HTMLInputElement;
                                  const score = Number(inputEl?.value || 0);
                                  handleGradeSubmission(subm.id, score, "عمل متميز وإجابات نموذجية.");
                                }}
                                className="bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-blue-700"
                              >
                                حفظ الدرجة
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: EXAMS LIST */}
      {currentTab === 'exams' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">جدول الاختبارات المقررة</h3>
              <p className="text-xs text-gray-500">استعراض وتعيين تواريخ الامتحانات الفترية والنهائية للمواد الدراسية</p>
            </div>
            <button 
              onClick={() => setShowAddExam(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>جدولة اختبار جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
            <table className="w-full text-xs text-right text-gray-500">
              <thead className="bg-gray-50 text-gray-700 font-bold">
                <tr>
                  <th className="px-4 py-3.5">عنوان الاختبار</th>
                  <th className="px-4 py-3.5">المادة والمرحلة</th>
                  <th className="px-4 py-3.5">تاريخ الامتحان</th>
                  <th className="px-4 py-3.5 text-center">الزمن والمدة</th>
                  <th className="px-4 py-3.5 text-center">الدرجة العظمى</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {exams.map((ex) => (
                  <tr key={ex.id} className="hover:bg-gray-50/20">
                    <td className="px-4 py-3.5 font-bold text-gray-900">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ml-2 ${
                        ex.type === 'نهائي' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {ex.type}
                      </span>
                      {ex.title}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-gray-800 block">{subjects.find(s => s.id === ex.subjectId)?.name || 'مقرر'}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{ex.grade}</span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 font-mono font-medium">{ex.date}</td>
                    <td className="px-4 py-3.5 text-center text-gray-700">
                      <span className="font-mono block">{ex.time} ص</span>
                      <span className="text-[10px] text-gray-400 font-bold">{ex.duration} دقيقة</span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold text-gray-900 font-mono">{ex.maxMarks} درجة</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: GRADING PANEL & RANKING */}
      {currentTab === 'grades' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Grade Recording Panel (left columns) */}
          <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs lg:col-span-1 space-y-4">
            <h4 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <FileCheck size={16} className="text-blue-600" />
              <span>رصد درجة الطالب يدوياً</span>
            </h4>

            <form onSubmit={handleRecordGrade} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">حدد الطالب</label>
                <select 
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs"
                >
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.academicId})</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">المقرر الدراسي</label>
                <select 
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs"
                >
                  {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700 block">نوع التقييم</label>
                  <select 
                    value={assessmentType}
                    onChange={(e) => setAssessmentType(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-250 rounded px-2 py-1.5 text-xs"
                  >
                    <option value="امتحان">امتحان</option>
                    <option value="واجب">واجب</option>
                    <option value="مشاركة">مشاركة</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700 block">الدرجة</label>
                  <input 
                    type="number" 
                    value={assessmentScore}
                    onChange={(e) => setAssessmentScore(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-250 rounded px-2 py-1 text-xs text-center font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700 block">الكاملة</label>
                  <input 
                    type="number" 
                    value={assessmentMax}
                    onChange={(e) => setAssessmentMax(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-250 rounded px-2 py-1 text-xs text-center font-bold"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg py-2 text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={14} />
                <span>تسجيل وحفظ الدرجة</span>
              </button>
            </form>
          </div>

          {/* Leaderboard and student list ranking (right columns) */}
          <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs lg:col-span-2 space-y-4">
            <h4 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Star size={16} className="text-amber-500" />
              <span>ترتيب لوحة الشرف ومعدلات أداء الطلاب</span>
            </h4>

            <div className="border border-gray-150 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-right text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-bold">
                  <tr>
                    <th className="px-4 py-3 text-center w-16">الترتيب</th>
                    <th className="px-4 py-3">الطالب</th>
                    <th className="px-4 py-3 text-center">المعدل العام</th>
                    <th className="px-4 py-3 text-center">التقدير المعتمد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {studentRanks.map((rank, idx) => (
                    <tr key={rank.student.id} className="hover:bg-gray-50/20">
                      <td className="px-4 py-3 text-center font-extrabold text-gray-900">
                        {idx === 0 ? '🥇 الأول' : 
                         idx === 1 ? '🥈 الثاني' : 
                         idx === 2 ? '🥉 الثالث' : `${idx + 1}`}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        <div>
                          <span>{rank.student.name}</span>
                          <span className="block text-[10px] text-gray-400 font-medium">{rank.student.grade}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-blue-600 font-mono">{rank.gpa}%</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rank.status === 'ممتاز' ? 'bg-green-50 text-green-700' :
                          rank.status === 'جيد جداً' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {rank.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* MODAL: ADD ASSIGNMENT */}
      {showAddAssignment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">إنشاء واجب أو مهمة مدرسية</h3>
              <button onClick={() => setShowAddAssignment(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddAssignment} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">عنوان الواجب *</label>
                <input type="text" required value={newAsm.title} onChange={(e) => setNewAsm({...newAsm, title: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs" placeholder="مثال: واجب المتتاليات الهندسية" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">المقرر الدراسي</label>
                  <select value={newAsm.subjectId} onChange={(e) => setNewAsm({...newAsm, subjectId: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs">
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">أقصى علامات</label>
                  <input type="number" value={newAsm.maxPoints} onChange={(e) => setNewAsm({...newAsm, maxPoints: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">الصف الدراسي</label>
                  <select value={newAsm.grade} onChange={(e) => setNewAsm({...newAsm, grade: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs">
                    <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                    <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">تاريخ التسليم الأخير</label>
                  <input type="date" value={newAsm.dueDate} onChange={(e) => setNewAsm({...newAsm, dueDate: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">الوصف وتفاصيل المهمة *</label>
                <textarea value={newAsm.description} onChange={(e) => setNewAsm({...newAsm, description: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs h-24" placeholder="الرجاء قراءة ص ٤٤ وحل الأسئلة الفردية..." />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddAssignment(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">نشر وحفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EXAM */}
      {showAddExam && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">جدولة اختبار أو امتحان جديد</h3>
              <button onClick={() => setShowAddExam(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddExam} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">عنوان الاختبار المجدول *</label>
                <input type="text" required value={newEx.title} onChange={(e) => setNewEx({...newEx, title: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs" placeholder="الاختبار الفتري الثاني ميكانيكا" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">نوع الاختبار</label>
                  <select value={newEx.type} onChange={(e) => setNewEx({...newEx, type: e.target.value as any})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs">
                    <option value="شهري">شهري</option>
                    <option value="نهائي">نهائي</option>
                    <option value="قصير">قصير</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">المادة المقررة</label>
                  <select value={newEx.subjectId} onChange={(e) => setNewEx({...newEx, subjectId: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs">
                    {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700 block">تاريخ الامتحان</label>
                  <input type="date" value={newEx.date} onChange={(e) => setNewEx({...newEx, date: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded p-1 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700 block">وقت البدء</label>
                  <input type="text" value={newEx.time} onChange={(e) => setNewEx({...newEx, time: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded p-1 text-xs text-center" placeholder="09:00" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-700 block">المدة (دقائق)</label>
                  <input type="text" value={newEx.duration} onChange={(e) => setNewEx({...newEx, duration: e.target.value})} className="w-full bg-gray-50 border border-gray-250 rounded p-1 text-xs text-center" placeholder="60" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddExam(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">جدولة وحفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

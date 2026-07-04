import React, { useState } from 'react';
import { 
  FileText, PenTool, Award, Plus, CheckCircle, ChevronLeft, 
  Trash, Save, Users, AlertCircle, FileCheck, Star, Trash2, X
} from 'lucide-react';
import { Assignment, AssignmentSubmission, Exam, GradeRecord, Student, Subject, GradeClass } from '../types';
import { transData } from '../lib/translateHelper';

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
  lang?: 'ar' | 'en';
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
  activeSubTab = 'assignments',
  lang = 'ar'
}: AssignmentsExamsViewProps) {
  const [currentTab, setCurrentTab] = useState<'assignments' | 'exams' | 'grades'>(activeSubTab);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Modals
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showAddExam, setShowAddExam] = useState(false);

  const trans = (ar: string, en: string) => lang === 'ar' ? ar : en;

  // New states
  const [newAsm, setNewAsm] = useState<Partial<Assignment>>({
    title: '', subjectId: subjects[0]?.id || '', grade: 'الصف الأول الثانوي', division: 'أ', dueDate: '2026-07-10', maxPoints: 10, description: ''
  });

  const [newEx, setNewEx] = useState<Partial<Exam>>({
    title: '', type: 'شهري', subjectId: subjects[0]?.id || '', grade: 'الصف الأول الثانوي', date: '2026-07-20', time: '09:00', duration: '60', maxMarks: 20
  });

  const getSubjectName = (subId: string) => {
    return subjects.find(s => s.id === subId)?.name || trans('الرياضيات ١', 'Mathematics 1');
  };

  const getStudentName = (stId: string) => {
    return students.find(s => s.id === stId)?.name || trans('طالب مجهول', 'Unknown Student');
  };

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsm.title) return;
    const asm: Assignment = {
      id: `asm${Date.now()}`,
      title: newAsm.title,
      subjectId: newAsm.subjectId || subjects[0]?.id || '',
      grade: newAsm.grade || 'الصف الأول الثانوي',
      division: newAsm.division || 'أ',
      dueDate: newAsm.dueDate || '2026-07-15',
      maxPoints: Number(newAsm.maxPoints) || 10,
      description: newAsm.description || '',
      submissionsCount: 0
    };
    setAssignments([asm, ...assignments]);
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

  const handleDeleteAssignment = (id: string) => {
    if (confirm(trans("هل أنت متأكد من حذف هذا الواجب؟", "Are you sure you want to delete this assignment?"))) {
      setAssignments(assignments.filter(a => a.id !== id));
    }
  };

  const handleDeleteExam = (id: string) => {
    if (confirm(trans("هل أنت متأكد من إلغاء هذا الاختبار؟", "Are you sure you want to cancel this exam?"))) {
      setExams(exams.filter(e => e.id !== id));
    }
  };

  const getSubmissionForStudent = (asmId: string, studentId: string) => {
    return submissions.find(s => s.assignmentId === asmId && s.studentId === studentId);
  };

  const handleGradeSubmission = (submId: string, score: number, feedback: string) => {
    const updated = submissions.map(subm => {
      if (subm.id === submId) {
        return { ...subm, score, feedback, status: 'تم التقييم' as const };
      }
      return subm;
    });
    setSubmissions(updated);
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-200 ${lang === 'ar' ? 'text-right' : 'text-left'}`} id="assignments-exams-view-panel">
      
      {/* Sub Tabs Selection */}
      <div className="flex border-b border-gray-200 bg-white p-1 rounded-xl shadow-xs" id="academic-tabs">
        {[
          { id: 'assignments', label: trans('الواجبات والمهام المدرسية', 'Homework & Assignments'), icon: PenTool },
          { id: 'exams', label: trans('الاختبارات والتقييمات الفترية', 'Exams & Quizzes'), icon: FileText },
          { id: 'grades', label: trans('رصد الدرجات والشهادات', 'Grades & Report Cards'), icon: Award },
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

      {/* Main View Area */}
      {currentTab === 'assignments' && !selectedAssignment && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-gray-900">{trans("قائمة الواجبات الصادرة والمسلمة", "Homework Assignments Directory")}</h3>
              <p className="text-xs text-gray-500">{trans("متابعة تسليمات الطلاب، تقدير الدرجات وإعطاء الملاحظات الفردية لكل طالب", "Manage student submissions, grade papers, and offer educational feedback")}</p>
            </div>
            <button 
              onClick={() => setShowAddAssignment(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700 cursor-pointer"
            >
              <Plus size={16} />
              <span>{trans("طرح واجب جديد", "Post New Assignment")}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map((asm) => (
              <div key={asm.id} className="bg-white border border-gray-150 rounded-xl p-5 flex flex-col justify-between hover:border-blue-500/30 transition-all shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded">
                      {transData(getSubjectName(asm.subjectId), lang)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                      {trans("تاريخ الاستحقاق:", "Due Date:")} {asm.dueDate}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-950">{transData(asm.title, lang)}</h4>
                  <p className="text-xs text-gray-400 font-medium block mt-1">
                    {transData(asm.grade, lang)} - {trans("الشعبة", "Division")} ({transData(asm.division, lang)})
                  </p>
                  <p className="text-xs text-gray-600 mt-3 leading-relaxed line-clamp-2 bg-gray-50/50 p-2.5 rounded border border-gray-100">
                    {transData(asm.description, lang)}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between">
                  <span className="text-xs text-blue-600 font-bold">
                    {trans("الدرجة العظمى:", "Max Points:")} {asm.maxPoints} {trans("نقاط", "pts")}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedAssignment(asm)}
                      className="text-xs bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      {trans("استعراض التسليمات", "Review Submissions")} ({submissions.filter(s => s.assignmentId === asm.id).length})
                    </button>
                    <button 
                      onClick={() => handleDeleteAssignment(asm.id)}
                      className="p-1.5 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentTab === 'assignments' && selectedAssignment && (
        <div className="bg-white rounded-xl border border-gray-150 p-6 space-y-6">
          <button 
            onClick={() => setSelectedAssignment(null)}
            className="text-xs text-gray-500 hover:text-blue-600 font-bold flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>{trans("العودة إلى الواجبات", "Back to Assignments")}</span>
          </button>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-150">
            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">
              {transData(getSubjectName(selectedAssignment.subjectId), lang)}
            </span>
            <h3 className="font-bold text-sm text-gray-900 mt-2">{transData(selectedAssignment.title, lang)}</h3>
            <p className="text-xs text-gray-500 mt-1">{transData(selectedAssignment.grade, lang)} - {transData(selectedAssignment.division, lang)}</p>
            <p className="text-xs text-gray-700 mt-3 leading-relaxed">{transData(selectedAssignment.description, lang)}</p>
          </div>

          <h4 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2">{trans("قائمة تسليمات الطلاب للواجب", "Student Submission Registry")}</h4>
          <div className="space-y-4">
            {students.filter(st => st.grade === selectedAssignment.grade && st.division === selectedAssignment.division).map(st => {
              const subm = getSubmissionForStudent(selectedAssignment.id, st.id);
              return (
                <div key={st.id} className="border border-gray-150 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-xs text-gray-950">{transData(st.name, lang)}</h5>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{trans("الرقم الأكاديمي:", "Academic ID:")} {st.academicId}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    {subm ? (
                      subm.status === 'تم التقييم' ? (
                        <div className="flex items-center gap-3">
                          <div className={lang === 'ar' ? 'text-left' : 'text-right'}>
                            <span className="text-[10px] text-green-700 font-bold block">{trans("تم التقييم", "Graded")}</span>
                            <span className="text-xs font-black text-gray-900">{subm.score} / {selectedAssignment.maxPoints}</span>
                          </div>
                          {subm.feedback && (
                            <div className="text-[10px] text-gray-500 max-w-xs italic border-r border-gray-200 pr-2">
                              {transData(subm.feedback, lang)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            placeholder={trans("الدرجة", "Score")}
                            max={selectedAssignment.maxPoints}
                            className="w-16 bg-gray-50 border border-gray-250 rounded-lg px-2 py-1 text-xs text-center"
                            onBlur={(e) => {
                              if (e.target.value) {
                                handleGradeSubmission(subm.id, Number(e.target.value), trans("عمل ممتاز!", "Great work!"));
                              }
                            }}
                          />
                          <span className="text-xs text-gray-400">/ {selectedAssignment.maxPoints}</span>
                          <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">{trans("مسلّم", "Submitted")}</span>
                        </div>
                      )
                    ) : (
                      <span className="text-[10px] text-red-500 bg-red-50 px-2.5 py-1 rounded font-bold">{trans("لم يسلم بعد", "Not Submitted")}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {currentTab === 'exams' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-gray-900">{trans("جدول ومواعيد الاختبارات المدرسية", "Scheduled School Exams")}</h3>
              <p className="text-xs text-gray-500">{trans("قائمة التقييمات الشهرية، الفترية والاختبارات التجريبية والقصيرة", "Track midterm assessments, mock exams, finals, and weekly quizzes")}</p>
            </div>
            <button 
              onClick={() => setShowAddExam(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700 cursor-pointer"
            >
              <Plus size={16} />
              <span>{trans("جدولة اختبار جديد", "Schedule New Exam")}</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
            <table className="w-full text-sm text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("عنوان الاختبار", "Exam Title")}</th>
                  <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("المادة والنوع", "Subject & Type")}</th>
                  <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("الصف المستهدف", "Target Class")}</th>
                  <th className="px-4 py-3.5 font-bold text-center">{trans("الموعد والزمن", "Date & Time")}</th>
                  <th className="px-4 py-3.5 font-bold text-center">{trans("الدرجة العظمى", "Max Score")}</th>
                  <th className="px-4 py-3.5 font-bold text-center">{trans("العمليات", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {exams.map((ex) => (
                  <tr key={ex.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3.5 font-bold text-gray-900">{transData(ex.title, lang)}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-bold text-blue-600 block">{transData(getSubjectName(ex.subjectId), lang)}</span>
                      <span className="text-[10px] text-gray-400 font-bold block">{transData(ex.type, lang)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-700 font-medium">{transData(ex.grade, lang)}</td>
                    <td className="px-4 py-3.5 text-center text-xs">
                      <div className="font-bold text-gray-800">{ex.date}</div>
                      <div className="text-[10px] text-gray-400 font-bold">{ex.time} ({ex.duration} {trans("دقيقة", "mins")})</div>
                    </td>
                    <td className="px-4 py-3.5 text-center text-xs font-black text-gray-900">{ex.maxMarks} {trans("درجة", "marks")}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => handleDeleteExam(ex.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
                        >
                          <Trash size={14} />
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

      {currentTab === 'grades' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-gray-900">{trans("رصد وتوثيق كشوف الدرجات", "Academic Grades Logging")}</h3>
            <p className="text-xs text-gray-500">{trans("رصد التقييم النهائي لجميع المواد وحساب النسب الإجمالية لكل طالب", "Record midterm, final, and cumulative percentage scorecards for all students")}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-150 p-4 flex flex-wrap gap-4">
            {students.slice(0, 5).map(st => (
              <div key={st.id} className="border border-gray-150 rounded-xl p-4 flex-1 min-w-[240px] hover:border-blue-500 transition-colors">
                <h4 className="font-bold text-xs text-gray-900 mb-2">{transData(st.name, lang)}</h4>
                <div className="space-y-2 text-xs">
                  {grades.filter(g => g.studentId === st.id).map(g => (
                    <div key={g.id} className="flex justify-between items-center text-[11px] text-gray-600 bg-gray-50 p-2 rounded">
                      <span>{transData(getSubjectName(g.subjectId), lang)} ({transData(g.type, lang)})</span>
                      <span className="font-bold text-blue-700">{g.score} / {g.maxScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddAssignment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">{trans("طرح واجب جديد", "Post New Assignment")}</h3>
              <button onClick={() => setShowAddAssignment(false)} className="p-1 rounded hover:bg-gray-200 text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddAssignment} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("عنوان الواجب أو المهمة *", "Assignment Title *")}</label>
                <input 
                  type="text" required
                  placeholder={trans("مثال: حل تمارين الجبر ص ٢٣", "e.g., Algebra page 23 exercises")}
                  value={newAsm.title}
                  onChange={(e) => setNewAsm({...newAsm, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">{trans("المادة المرتبطة", "Associated Subject")}</label>
                  <select 
                    value={newAsm.subjectId}
                    onChange={(e) => setNewAsm({...newAsm, subjectId: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{transData(s.name, lang)}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">{trans("تاريخ التسليم الأقصى", "Due Date")}</label>
                  <input 
                    type="date"
                    value={newAsm.dueDate}
                    onChange={(e) => setNewAsm({...newAsm, dueDate: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">{trans("الصف الدراسي", "Grade")}</label>
                  <select 
                    value={newAsm.grade}
                    onChange={(e) => setNewAsm({...newAsm, grade: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                  >
                    <option value="الصف الأول الثانوي">{trans("الصف الأول الثانوي", "1st Grade - Secondary")}</option>
                    <option value="الصف الثاني الثانوي">{trans("الصف الثاني الثانوي", "2nd Grade - Secondary")}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">{trans("الدرجة الإجمالية", "Max Score")}</label>
                  <input 
                    type="number"
                    value={newAsm.maxPoints}
                    onChange={(e) => setNewAsm({...newAsm, maxPoints: Number(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("وصف وتفاصيل الواجب", "Assignment details")}</label>
                <textarea 
                  value={newAsm.description}
                  onChange={(e) => setNewAsm({...newAsm, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs h-20"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddAssignment(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer">
                  {trans("إلغاء", "Cancel")}
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer">
                  {trans("نشر الواجب", "Post Assignment")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showAddExam && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">{trans("جدولة اختبار جديد", "Schedule New Exam")}</h3>
              <button onClick={() => setShowAddExam(false)} className="p-1 rounded hover:bg-gray-200 text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddExam} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("عنوان أو اسم الاختبار *", "Exam Title *")}</label>
                <input 
                  type="text" required
                  placeholder={trans("مثال: اختبار الرياضيات الفتري الأول", "e.g., Mathematics 1st Midterm Exam")}
                  value={newEx.title}
                  onChange={(e) => setNewEx({...newEx, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">{trans("المادة الدراسية", "Subject")}</label>
                  <select 
                    value={newEx.subjectId}
                    onChange={(e) => setNewEx({...newEx, subjectId: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{transData(s.name, lang)}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">{trans("نوع التقييم", "Assessment Type")}</label>
                  <select 
                    value={newEx.type}
                    onChange={(e) => setNewEx({...newEx, type: e.target.value as any})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                  >
                    <option value="شهري">{trans("شهري", "Monthly")}</option>
                    <option value="قصير">{trans("قصير", "Quiz")}</option>
                    <option value="نهائي">{trans("نهائي", "Final")}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">{trans("تاريخ الاختبار", "Exam Date")}</label>
                  <input 
                    type="date"
                    value={newEx.date}
                    onChange={(e) => setNewEx({...newEx, date: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">{trans("درجة النهاية العظمى", "Max Marks")}</label>
                  <input 
                    type="number"
                    value={newEx.maxMarks}
                    onChange={(e) => setNewEx({...newEx, maxMarks: Number(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddExam(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer">
                  {trans("إلغاء", "Cancel")}
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer">
                  {trans("جدولة ونشر", "Schedule & Publish")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

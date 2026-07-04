import React, { useState } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Eye, Printer, X, Save, 
  MapPin, Phone, Mail, User, ShieldAlert, Award, CreditCard, 
  CheckCircle, FileText, Calendar, ArrowRight, UserPlus
} from 'lucide-react';
import { Student, Parent, AttendanceRecord, GradeRecord, Invoice } from '../types';
import { initialSettings, initialSubjects as subjects } from '../data/mockData';

interface StudentsViewProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  parents: Parent[];
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  invoices: Invoice[];
  classes?: any;
}

export default function StudentsView({
  students,
  setStudents,
  parents,
  attendance,
  grades,
  invoices
}: StudentsViewProps) {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [profileTab, setProfileTab] = useState<'personal' | 'academic' | 'finance' | 'medical'>('personal');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // New Student Form State
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '',
    academicId: '',
    stage: 'ثانوي',
    grade: 'الصف الأول الثانوي',
    division: 'أ',
    gender: 'ذكر',
    parentId: parents[0]?.id || '',
    phone: '',
    status: 'نشط',
    address: '',
    dob: '',
    medicalRecord: 'سليم',
    notes: ''
  });

  // Filters calculation
  const filteredStudents = students.filter(st => {
    const matchesSearch = st.name.includes(search) || st.academicId.includes(search);
    const matchesStage = stageFilter === '' || st.stage === stageFilter;
    const matchesGrade = gradeFilter === '' || st.grade === gradeFilter;
    return matchesSearch && matchesStage && matchesGrade;
  });

  // Calculate student attendance metrics
  const getStudentAttendanceStats = (stId: string) => {
    const records = attendance.filter(r => r.studentId === stId);
    if (records.length === 0) return { present: 0, absent: 0, rate: 100, records: [] };
    const present = records.filter(r => r.status === 'حاضر' || r.status === 'متأخر').length;
    const absent = records.filter(r => r.status === 'غائب' || r.status === 'بعذر').length;
    return {
      present,
      absent,
      rate: Math.round((present / records.length) * 100),
      records
    };
  };

  // Get student grades
  const getStudentGrades = (stId: string) => {
    return grades.filter(g => g.studentId === stId);
  };

  // Get student invoices
  const getStudentInvoices = (stId: string) => {
    return invoices.filter(i => i.studentId === stId);
  };

  // Handle Add Student
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.academicId) {
      alert("الرجاء تعبئة الحقول الأساسية: الاسم والرقم الأكاديمي.");
      return;
    }
    
    // Auto-resolve parent name from id
    const parentObj = parents.find(p => p.id === newStudent.parentId);

    const st: Student = {
      id: `s${Date.now()}`,
      name: newStudent.name,
      academicId: newStudent.academicId,
      stage: newStudent.stage || 'ثانوي',
      grade: newStudent.grade || 'الصف الأول الثانوي',
      division: newStudent.division || 'أ',
      gender: newStudent.gender as 'ذكر' | 'أنثى',
      parentName: parentObj ? parentObj.name : 'غير محدد',
      parentId: newStudent.parentId || '',
      phone: newStudent.phone || parentObj?.phone || '',
      status: 'نشط',
      address: newStudent.address || '',
      dob: newStudent.dob || '',
      medicalRecord: newStudent.medicalRecord || 'سليم',
      notes: newStudent.notes || ''
    };

    setStudents([st, ...students]);
    setShowAddModal(false);
    
    // Reset form
    setNewStudent({
      name: '',
      academicId: '',
      stage: 'ثانوي',
      grade: 'الصف الأول الثانوي',
      division: 'أ',
      gender: 'ذكر',
      parentId: parents[0]?.id || '',
      phone: '',
      status: 'نشط',
      address: '',
      dob: '',
      medicalRecord: 'سليم',
      notes: ''
    });
  };

  // Handle Edit Save
  const handleEditStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    const updated = students.map(st => st.id === editingStudent.id ? editingStudent : st);
    setStudents(updated);
    if (selectedStudent?.id === editingStudent.id) {
      setSelectedStudent(editingStudent);
    }
    setEditingStudent(null);
  };

  // Handle Delete
  const handleDeleteStudent = (stId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطالب نهائياً من سجلات المدرسة؟")) {
      setStudents(students.filter(st => st.id !== stId));
      if (selectedStudent?.id === stId) setSelectedStudent(null);
    }
  };

  // Print mock trigger
  const handlePrintProfile = (stName: string) => {
    const printContent = document.getElementById("student-profile-print-area")?.innerHTML;
    const originalContent = document.body.innerHTML;
    if (printContent) {
      const popupWin = window.open('', '_blank', 'width=800,height=600');
      popupWin?.document.open();
      popupWin?.document.write(`
        <html>
          <head>
            <title>تقرير الطالب - ${stName}</title>
            <style>
              body { font-family: 'Cairo', sans-serif; direction: rtl; padding: 40px; color: #1F2937; }
              .header { text-align: center; border-bottom: 2px solid #2563EB; padding-bottom: 20px; margin-bottom: 30px; }
              .school-title { font-size: 20px; font-weight: bold; }
              .report-title { font-size: 16px; color: #6B7280; margin-top: 5px; }
              .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
              .card { border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px; }
              .card-title { font-weight: bold; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px; margin-bottom: 10px; color: #2563EB; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              th, td { border: 1px solid #E5E7EB; padding: 8px; text-align: right; }
              th { background-color: #F9FAFB; }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      popupWin?.document.close();
      popupWin?.print();
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" id="students-view-container">
      
      {/* View Header with adding triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">إدارة شؤون ومجلدات الطلاب</h2>
          <p className="text-xs text-gray-500">البحث، استعراض الملف الأكاديمي، طباعة التقارير، وتعديل بيانات الطلاب</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-xs"
          id="add-student-btn"
        >
          <Plus size={16} />
          <span>إضافة طالب جديد</span>
        </button>
      </div>

      {/* Directory Search & Filters Panel */}
      <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4" id="directory-filters">
        <div className="relative col-span-1 sm:col-span-2">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="ابحث بالاسم أو الرقم الأكاديمي للطالب..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-250 rounded-lg pr-10 pl-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            id="student-search-input"
          />
        </div>

        <div>
          <select 
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            id="student-stage-filter"
          >
            <option value="">كل المراحل</option>
            <option value="ثانوي">المرحلة الثانوية</option>
            <option value="متوسط">المرحلة المتوسطة</option>
          </select>
        </div>

        <div>
          <select 
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            id="student-grade-filter"
          >
            <option value="">كل الصفوف</option>
            <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
            <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
            <option value="الصف الثالث المتوسط">الصف الثالث المتوسط</option>
            <option value="الصف الأول المتوسط">الصف الأول المتوسط</option>
          </select>
        </div>
      </div>

      {/* Main Student Directory Table */}
      <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden" id="student-directory-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3.5 font-bold">الرقم الأكاديمي</th>
                <th className="px-4 py-3.5 font-bold">الاسم الكامل</th>
                <th className="px-4 py-3.5 font-bold">الصف / الشعبة</th>
                <th className="px-4 py-3.5 font-bold">ولي الأمر</th>
                <th className="px-4 py-3.5 font-bold">الجنس</th>
                <th className="px-4 py-3.5 font-bold text-center">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-gray-900">{st.academicId}</td>
                    <td className="px-4 py-3.5 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {st.gender === 'ذكر' ? '👨‍🎓' : '👩‍🎓'}
                        </div>
                        <div>
                          <span>{st.name}</span>
                          <span className="block text-[10px] text-gray-400 font-medium">{st.stage}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-gray-700 font-medium block">{st.grade}</span>
                      <span className="text-[10px] text-gray-400 font-bold">الشعبة ({st.division})</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 font-medium">{st.parentName}</td>
                    <td className="px-4 py-3.5 text-xs font-medium text-gray-700">{st.gender}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setSelectedStudent(st)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="عرض الملف الكامل"
                          id={`view-student-${st.id}`}
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          onClick={() => setEditingStudent(st)}
                          className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                          title="تعديل البيانات"
                          id={`edit-student-${st.id}`}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(st.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                          title="حذف الطالب"
                          id={`delete-student-${st.id}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 font-medium text-xs">
                    لا يوجد طلاب مطابقون لمعايير البحث الحالية.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Student Profile Overlay/Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="student-profile-modal">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👨‍🎓</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{selectedStudent.name}</h3>
                  <p className="text-xs text-gray-500">الرقم الأكاديمي: {selectedStudent.academicId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePrintProfile(selectedStudent.name)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                  title="طباعة كشف درجات وملخص الطالب"
                  id="print-profile-btn"
                >
                  <Printer size={16} />
                </button>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                  id="close-profile-btn"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="flex border-b border-gray-100 bg-white px-4">
              {[
                { id: 'personal', label: 'البيانات الشخصية والعنوان', icon: User },
                { id: 'academic', label: 'الحضور والدرجات', icon: Award },
                { id: 'finance', label: 'الحسابات والرسوم المدرسية', icon: CreditCard },
                { id: 'medical', label: 'السجل الطبي والملاحظات', icon: ShieldAlert },
              ].map((tab) => {
                const Icon = tab.icon;
                const isAct = profileTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setProfileTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
                      isAct 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-blue-600'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body / Tab Content */}
            <div className="flex-1 overflow-y-auto p-6" id="student-profile-print-area">
              
              {/* Header section specifically for print layout (hidden inside app viewport, shown during printing via iframe) */}
              <div className="hidden">
                <div className="header">
                  <div className="school-title">{initialSettings.schoolName}</div>
                  <div className="report-title">تقرير الأداء الأكاديمي الشامل وسجل الطالب</div>
                </div>
                <h2>بيانات الطالب: {selectedStudent.name}</h2>
                <p>الرقم الأكاديمي: {selectedStudent.academicId} | الصف: {selectedStudent.grade}</p>
                <hr style={{ margin: '20px 0' }} />
              </div>

              {profileTab === 'personal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-xs text-blue-700 border-b border-gray-200 pb-2 mb-3">المعلومات الشخصية</h4>
                    <ul className="space-y-3.5 text-xs text-gray-700">
                      <li><span className="font-bold text-gray-500 pl-2">الاسم الكامل:</span> {selectedStudent.name}</li>
                      <li><span className="font-bold text-gray-500 pl-2">تاريخ الميلاد:</span> {selectedStudent.dob || '2010-05-12'}</li>
                      <li><span className="font-bold text-gray-500 pl-2">الجنس:</span> {selectedStudent.gender}</li>
                      <li><span className="font-bold text-gray-500 pl-2">حالة القيد:</span> <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold text-[10px]">نشط مستجد</span></li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-xs text-blue-700 border-b border-gray-200 pb-2 mb-3">العنوان وتواصل ولي الأمر</h4>
                    <ul className="space-y-3.5 text-xs text-gray-700">
                      <li><span className="font-bold text-gray-500 pl-2">ولي الأمر المعتمد:</span> {selectedStudent.parentName}</li>
                      <li><span className="font-bold text-gray-500 pl-2">رقم الجوال:</span> {selectedStudent.phone}</li>
                      <li><span className="font-bold text-gray-500 pl-2">العنوان المختار:</span> {selectedStudent.address}</li>
                      <li><span className="font-bold text-gray-500 pl-2">المرحلة الدراسية:</span> {selectedStudent.stage} - {selectedStudent.grade} ({selectedStudent.division})</li>
                    </ul>
                  </div>
                </div>
              )}

              {profileTab === 'academic' && (
                <div className="space-y-6">
                  {/* Attendance Rate Widget */}
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-xs text-blue-950">معدل التواجد الصباحي</h4>
                      <p className="text-[10px] text-blue-700 mt-1">يحتسب بناءً على رصد الحضور لجميع الحصص</p>
                    </div>
                    <div className="text-left">
                      <span className="text-2xl font-black text-blue-700">{getStudentAttendanceStats(selectedStudent.id).rate}%</span>
                      <span className="block text-[9px] font-bold text-blue-500">حضور منتظم</span>
                    </div>
                  </div>

                  {/* Academic Grades Table */}
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 mb-3">كشف علامات الطالب والتقييمات الفترية</h4>
                    <div className="border border-gray-150 rounded-lg overflow-hidden">
                      <table className="w-full text-xs text-right text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-bold">
                          <tr>
                            <th className="px-4 py-2">المادة الدراسية</th>
                            <th className="px-4 py-2 text-center">النوع</th>
                            <th className="px-4 py-2 text-center">الدرجة المرصودة</th>
                            <th className="px-4 py-2 text-center">الدرجة الكاملة</th>
                            <th className="px-4 py-2 text-center">النسبة المئوية</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {getStudentGrades(selectedStudent.id).length > 0 ? (
                            getStudentGrades(selectedStudent.id).map((grade) => (
                              <tr key={grade.id} className="hover:bg-gray-50/50">
                                <td className="px-4 py-2.5 font-bold text-gray-900">
                                  {subjects.find(s => s.id === grade.subjectId)?.name || 'الرياضيات ١'}
                                </td>
                                <td className="px-4 py-2.5 text-center font-medium text-gray-600">{grade.type}</td>
                                <td className="px-4 py-2.5 text-center font-bold text-blue-600">{grade.score}</td>
                                <td className="px-4 py-2.5 text-center font-medium text-gray-500">{grade.maxScore}</td>
                                <td className="px-4 py-2.5 text-center font-bold text-green-600">
                                  {Math.round((grade.score / grade.maxScore) * 100)}%
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-4 py-4 text-center text-gray-400 font-medium">لا توجد درجات مرصودة لهذا الطالب حالياً.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'finance' && (
                <div className="space-y-6">
                  <h4 className="font-bold text-xs text-gray-900">سجل الأقساط والفواتير الصادرة</h4>
                  <div className="space-y-4">
                    {getStudentInvoices(selectedStudent.id).map((inv) => (
                      <div key={inv.id} className="border border-gray-150 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">رقم الفاتورة: {inv.id}</span>
                          <h5 className="font-bold text-xs text-gray-900 mt-1">{inv.title}</h5>
                          <p className="text-[10px] text-gray-500 mt-1">تاريخ الاستحقاق: {inv.dueDate}</p>
                        </div>
                        <div className="flex items-center gap-6 shrink-0">
                          <div className="text-left sm:text-right">
                            <span className="text-xs text-gray-500 block">المبلغ الإجمالي</span>
                            <span className="font-bold text-sm text-gray-900">{inv.amount.toLocaleString()} ريال</span>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-xs text-gray-500 block">المدفوع</span>
                            <span className="font-bold text-sm text-green-600">{inv.paidAmount.toLocaleString()} ريال</span>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-xs text-gray-500 block">المتبقي</span>
                            <span className="font-bold text-sm text-rose-600">{(inv.amount - inv.paidAmount).toLocaleString()} ريال</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                            inv.status === 'مدفوع' ? 'bg-green-50 text-green-700' :
                            inv.status === 'مدفوع جزئياً' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profileTab === 'medical' && (
                <div className="space-y-6">
                  <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 flex items-start gap-3">
                    <ShieldAlert className="text-rose-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="font-bold text-xs text-rose-950">الملف الصحي والاحتياطات الطبية</h4>
                      <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                        {selectedStudent.medicalRecord || 'لا توجد أي حساسيات أو أمراض مسجلة للطالب.'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-150">
                    <h4 className="font-bold text-xs text-gray-900 border-b border-gray-200 pb-2 mb-3">ملاحظات المشرف التربوي والمرشد الطلابي</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {selectedStudent.notes || 'طالب ملتزم، مشارك في الأنشطة الثقافية والمدرسية بشكل دوري ومتميز.'}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="add-student-modal">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <UserPlus size={18} className="text-blue-600" />
                <span>إضافة طالب جديد إلى سجلات المدرسة</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded hover:bg-gray-200 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAddStudentSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">الاسم الكامل للطالب *</label>
                  <input 
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    placeholder="مثال: صالح بن محمد الحربي"
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">الرقم الأكاديمي *</label>
                  <input 
                    type="text"
                    required
                    value={newStudent.academicId}
                    onChange={(e) => setNewStudent({...newStudent, academicId: e.target.value})}
                    placeholder="مثال: 444102999"
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">المرحلة الدراسية</label>
                  <select 
                    value={newStudent.stage}
                    onChange={(e) => setNewStudent({...newStudent, stage: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ثانوي">ثانوي</option>
                    <option value="متوسط">متوسط</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">الصف الدراسي</label>
                  <select 
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                    <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                    <option value="الصف الثالث المتوسط">الصف الثالث المتوسط</option>
                    <option value="الصف الأول المتوسط">الصف الأول المتوسط</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">الشعبة</label>
                  <input 
                    type="text"
                    value={newStudent.division}
                    onChange={(e) => setNewStudent({...newStudent, division: e.target.value})}
                    placeholder="أ"
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">الجنس</label>
                  <select 
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({...newStudent, gender: e.target.value as any})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">ولي الأمر المرتبط</label>
                  <select 
                    value={newStudent.parentId}
                    onChange={(e) => setNewStudent({...newStudent, parentId: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {parents.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">تاريخ الميلاد</label>
                  <input 
                    type="date"
                    value={newStudent.dob}
                    onChange={(e) => setNewStudent({...newStudent, dob: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">العنوان السكني</label>
                <input 
                  type="text"
                  value={newStudent.address}
                  onChange={(e) => setNewStudent({...newStudent, address: e.target.value})}
                  placeholder="مثال: الرياض، حي الياسمين، مخرج ٥"
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">الملف الصحي / الحساسيات</label>
                <textarea 
                  value={newStudent.medicalRecord}
                  onChange={(e) => setNewStudent({...newStudent, medicalRecord: e.target.value})}
                  placeholder="سليم، لا يعاني من أي عوارض صحية."
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white h-20"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
                >
                  إلغاء الأمر
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  تسجيل وحفظ الطالب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="edit-student-modal">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Edit2 size={16} className="text-amber-600" />
                <span>تعديل بيانات الطالب: {editingStudent.name}</span>
              </h3>
              <button 
                onClick={() => setEditingStudent(null)}
                className="p-1 rounded hover:bg-gray-200 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleEditStudentSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">الاسم الكامل للطالب</label>
                  <input 
                    type="text"
                    required
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-255 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">الرقم الأكاديمي</label>
                  <input 
                    type="text"
                    required
                    value={editingStudent.academicId}
                    onChange={(e) => setEditingStudent({...editingStudent, academicId: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-255 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">المرحلة الدراسية</label>
                  <select 
                    value={editingStudent.stage}
                    onChange={(e) => setEditingStudent({...editingStudent, stage: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-255 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="ثانوي">ثانوي</option>
                    <option value="متوسط">متوسط</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">الصف الدراسي</label>
                  <select 
                    value={editingStudent.grade}
                    onChange={(e) => setEditingStudent({...editingStudent, grade: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-255 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                    <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                    <option value="الصف الثالث المتوسط">الصف الثالث المتوسط</option>
                    <option value="الصف الأول المتوسط">الصف الأول المتوسط</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">جوال التواصل</label>
                  <input 
                    type="text"
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-255 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">تاريخ الميلاد</label>
                  <input 
                    type="date"
                    value={editingStudent.dob}
                    onChange={(e) => setEditingStudent({...editingStudent, dob: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-255 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">العنوان السكني</label>
                <input 
                  type="text"
                  value={editingStudent.address}
                  onChange={(e) => setEditingStudent({...editingStudent, address: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-255 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">الملف الصحي / الحساسيات</label>
                <textarea 
                  value={editingStudent.medicalRecord}
                  onChange={(e) => setEditingStudent({...editingStudent, medicalRecord: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-255 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 h-20"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
                >
                  إلغاء الأمر
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors"
                >
                  حفظ وتعديل البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

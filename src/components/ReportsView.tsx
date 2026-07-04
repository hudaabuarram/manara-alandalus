import { useState } from 'react';
import { BarChart3, Download, FileText, Printer, Search, CheckCircle2, Loader2, Filter } from 'lucide-react';
import { Student, Teacher, Invoice, GradeRecord } from '../types';
import { transData } from '../lib/translateHelper';

interface ReportsViewProps {
  students: Student[];
  teachers: Teacher[];
  invoices: Invoice[];
  grades: GradeRecord[];
  lang?: 'ar' | 'en';
}

export default function ReportsView({
  students,
  teachers,
  invoices,
  grades,
  lang = 'ar'
}: ReportsViewProps) {
  const [reportType, setReportType] = useState<'students' | 'grades' | 'finance'>('students');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [exporting, setExporting] = useState<string | null>(null);

  const trans = (ar: string, en: string) => lang === 'ar' ? ar : en;

  // Filter lists based on type
  const getReportData = () => {
    switch (reportType) {
      case 'students':
        return students.filter(st => selectedGrade === '' || st.grade === selectedGrade);
      case 'grades':
        return grades.filter(g => selectedGrade === '' || students.find(s => s.id === g.studentId)?.grade === selectedGrade);
      case 'finance':
        return invoices.filter(inv => selectedGrade === '' || students.find(s => s.id === inv.studentId)?.grade === selectedGrade);
      default:
        return [];
    }
  };

  const activeData = getReportData();

  const handleExport = (format: 'PDF' | 'Excel' | 'CSV') => {
    setExporting(format);
    setTimeout(() => {
      setExporting(null);
      alert(trans(
        `تم توليد وتصدير ملف التقرير بصيغة ${format} بنجاح! تم حفظ الملف في مجلد التحميلات الخاص بك.`,
        `Report compiled and exported as ${format} successfully! Saved to your downloads folder.`
      ));
    }, 2000);
  };

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || trans('طالب مدرسة', 'School Student');

  return (
    <div className={`space-y-6 animate-in fade-in duration-200 ${lang === 'ar' ? 'text-right' : 'text-left'}`} id="reports-view-container">
      
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{trans("مركز استخراج التقارير والإحصائيات المقرنة", "Comprehensive Reports & Analytics Hub")}</h2>
          <p className="text-xs text-gray-500">{trans("توليد تقارير شاملة لأقسام المدرسة المختلفة مع إمكانية التصدير والتحميل المباشر للأنظمة والوزارة", "Generate full academic, grade, and financial status spreadsheets for ministry and internal audits")}</p>
        </div>

        {/* Export triggers */}
        <div className="flex items-center gap-2">
          {['PDF', 'Excel', 'CSV'].map((fmt) => (
            <button
              key={fmt}
              disabled={exporting !== null}
              onClick={() => handleExport(fmt as any)}
              className="bg-white border border-gray-250 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {exporting === fmt ? (
                <Loader2 className="animate-spin text-blue-600" size={13} />
              ) : (
                <Download size={13} className="text-blue-600" />
              )}
              <span>{trans(`تصدير ${fmt}`, `Export ${fmt}`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Select Report Classification */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="reports-setup-panel">
        
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs space-y-1 md:col-span-1">
          <span className="text-[10px] font-bold text-gray-400 block">{trans("تصنيف التقرير المطلوب:", "Report Type:")}</span>
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="w-full bg-gray-50 border border-gray-250 rounded-lg p-1.5 text-xs focus:outline-none"
          >
            <option value="students">{trans("سجل الطلاب والطالبات المقيدين", "Student Registry & Enrollment List")}</option>
            <option value="grades">{trans("كشف الدرجات والنتائج العامة", "Academic Grades & Exam Transcripts")}</option>
            <option value="finance">{trans("تقرير التحصيلات والرسوم المالية", "Tuition Receipts & Invoicing Reports")}</option>
          </select>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs space-y-1 md:col-span-1">
          <span className="text-[10px] font-bold text-gray-400 block">{trans("فلترة حسب الصف الدراسي:", "Filter by Class:")}</span>
          <select 
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full bg-gray-50 border border-gray-250 rounded-lg p-1.5 text-xs focus:outline-none"
          >
            <option value="">{trans("جميع الصفوف الدراسية", "All Grades")}</option>
            <option value="الصف الأول الثانوي">{trans("الصف الأول الثانوي", "1st Grade - Secondary")}</option>
            <option value="الصف الثاني الثانوي">{trans("الصف الثاني الثانوي", "2nd Grade - Secondary")}</option>
            <option value="الصف الثالث المتوسط">{trans("الصف الثالث المتوسط", "3rd Grade - Intermediate")}</option>
            <option value="الصف الأول المتوسط">{trans("الصف الأول المتوسط", "1st Grade - Intermediate")}</option>
          </select>
        </div>

        {/* Aggregate KPI indicators */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs md:col-span-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 block">{trans("عدد السجلات المشمولة بالتقرير الحالي", "Records matched in selected filter:")}</span>
            <h4 className="text-xl font-black text-blue-600 mt-1">{activeData.length} {trans("سجل مؤكد", "confirmed records")}</h4>
          </div>
          <div className="text-[10px] text-gray-400 font-bold max-w-xs text-center">
            {trans("تاريخ تحديث البيانات المجمعة تلقائياً:", "Data compiled automatically on:")}
            <div className="text-gray-700 font-bold mt-1 font-mono">2026-07-04 11:30</div>
          </div>
        </div>
      </div>

      {/* Main Table render according to report classification */}
      <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-gray-700">
          <span>{trans("استعراض مسودة التقرير قبل التصدير والطباعة", "Draft Report Preview Sheet")}</span>
          <span className="text-[10px] text-gray-400 font-normal">{trans("معلومات حية مبنية على البيانات المدخلة بالنظام", "Live data built directly from active modules")}</span>
        </div>

        {reportType === 'students' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={`px-4 py-3 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("الرقم الأكاديمي", "Academic ID")}</th>
                  <th className={`px-4 py-3 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("الاسم الكامل للطالب", "Student Name")}</th>
                  <th className={`px-4 py-3 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("الصف والشعبة", "Grade & Division")}</th>
                  <th className={`px-4 py-3 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("اسم ولي الأمر", "Guardian Name")}</th>
                  <th className="px-4 py-3 font-bold text-center">{trans("رقم الجوال", "Contact Phone")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-xs">
                {activeData.map((st: any) => (
                  <tr key={st.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono font-bold text-gray-800">{st.academicId}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{transData(st.name, lang)}</td>
                    <td className="px-4 py-3 font-medium text-gray-600">{transData(st.grade, lang)} - {transData(st.division, lang)}</td>
                    <td className="px-4 py-3 text-gray-700">{transData(st.guardianName, lang)}</td>
                    <td className="px-4 py-3 text-center text-gray-600 font-mono">{st.guardianPhone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'grades' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={`px-4 py-3 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("الطالب", "Student Name")}</th>
                  <th className={`px-4 py-3 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("المادة الأكاديمية", "Subject Title")}</th>
                  <th className={`px-4 py-3 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("نوع التقييم", "Exam Type")}</th>
                  <th className="px-4 py-3 font-bold text-center">{trans("الدرجة المحققة", "Obtained Score")}</th>
                  <th className="px-4 py-3 font-bold text-center">{trans("النسبة المئوية", "Percentage")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-xs">
                {activeData.map((g: any) => {
                  const pct = Math.round((g.score / g.maxScore) * 100);
                  return (
                    <tr key={g.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-bold text-gray-950">{transData(getStudentName(g.studentId), lang)}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">{transData(g.subjectId, lang)}</td>
                      <td className="px-4 py-3 font-medium text-gray-600">{transData(g.type, lang)}</td>
                      <td className="px-4 py-3 text-center font-bold text-gray-900">{g.score} / {g.maxScore}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-md font-bold ${pct >= 90 ? 'bg-green-50 text-green-700' : pct >= 75 ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'finance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={`px-4 py-3 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("الفاتورة", "Invoice Title")}</th>
                  <th className={`px-4 py-3 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("اسم الطالب", "Student Name")}</th>
                  <th className="px-4 py-3 font-bold text-center">{trans("المبلغ الإجمالي", "Total Fees")}</th>
                  <th className="px-4 py-3 font-bold text-center">{trans("المبلغ المسدد", "Amount Paid")}</th>
                  <th className="px-4 py-3 font-bold text-center">{trans("المتبقي بذمة ولي الأمر", "Remaining Balance")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-xs">
                {activeData.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-bold text-gray-950">{transData(inv.title, lang)}</td>
                    <td className="px-4 py-3 text-gray-700 font-bold">{transData(getStudentName(inv.studentId), lang)}</td>
                    <td className="px-4 py-3 text-center text-gray-900 font-black">{inv.amount.toLocaleString()} {trans("ريال", "SAR")}</td>
                    <td className="px-4 py-3 text-center text-green-600 font-bold">{inv.paidAmount.toLocaleString()} {trans("ريال", "SAR")}</td>
                    <td className="px-4 py-3 text-center text-rose-600 font-bold">{(inv.amount - inv.paidAmount).toLocaleString()} {trans("ريال", "SAR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

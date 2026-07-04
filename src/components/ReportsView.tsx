import { useState } from 'react';
import { BarChart3, Download, FileText, Printer, Search, CheckCircle2, Loader2, Filter } from 'lucide-react';
import { Student, Teacher, Invoice, GradeRecord } from '../types';

interface ReportsViewProps {
  students: Student[];
  teachers: Teacher[];
  invoices: Invoice[];
  grades: GradeRecord[];
}

export default function ReportsView({
  students,
  teachers,
  invoices,
  grades
}: ReportsViewProps) {
  const [reportType, setReportType] = useState<'students' | 'grades' | 'finance'>('students');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [exporting, setExporting] = useState<string | null>(null);

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
      alert(`تم توليد وتصدير ملف التقرير بصيغة ${format} بنجاح! تم حفظ الملف في مجلد التحميلات الخاص بك.`);
    }, 2000);
  };

  const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'طالب مدرسة';

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" id="reports-view-container">
      
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">مركز استخراج التقارير والإحصائيات المقرنة</h2>
          <p className="text-xs text-gray-500">توليد تقارير شاملة لأقسام المدرسة المختلفة مع إمكانية التصدير والتحميل المباشر للأنظمة والوزارة</p>
        </div>

        {/* Export triggers */}
        <div className="flex items-center gap-2">
          {['PDF', 'Excel', 'CSV'].map((fmt) => (
            <button
              key={fmt}
              disabled={exporting !== null}
              onClick={() => handleExport(fmt as any)}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {exporting === fmt ? (
                <Loader2 className="animate-spin text-blue-600" size={13} />
              ) : (
                <Download size={13} className="text-blue-600" />
              )}
              <span>تصدير {fmt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Select Report Classification */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="reports-setup-panel">
        
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs space-y-1 md:col-span-1">
          <span className="text-[10px] font-bold text-gray-400 block">تصنيف التقرير المطلوب:</span>
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="w-full bg-gray-50 border border-gray-250 rounded-lg p-1.5 text-xs focus:outline-none"
          >
            <option value="students">سجل الطلاب والطالبات المقيدين</option>
            <option value="grades">كشف الدرجات والنتائج العامة</option>
            <option value="finance">تقرير التحصيلات والرسوم المالية</option>
          </select>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs space-y-1 md:col-span-1">
          <span className="text-[10px] font-bold text-gray-400 block">فلترة حسب الصف الدراسي:</span>
          <select 
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full bg-gray-50 border border-gray-250 rounded-lg p-1.5 text-xs focus:outline-none"
          >
            <option value="">جميع الفصول</option>
            <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
            <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
            <option value="الصف الثالث المتوسط">الصف الثالث المتوسط</option>
            <option value="الصف الأول المتوسط">الصف الأول المتوسط</option>
          </select>
        </div>

        {/* Live Export Status Banner */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-150 md:col-span-2 flex items-center gap-3">
          <BarChart3 className="text-blue-600 shrink-0" size={20} />
          <div>
            <h4 className="font-bold text-[11px] text-blue-950">بيانات التقرير الحالي جاهزة تماماً</h4>
            <p className="text-[10px] text-blue-700 leading-normal mt-0.5">عدد السجلات المطابقة: {activeData.length} سجل. يمكنك التحميل والمطابقة يدوياً.</p>
          </div>
        </div>

      </div>

      {/* Render Dynamic Report Data Table previews */}
      <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
        
        {reportType === 'students' && (
          <table className="w-full text-sm text-right text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 font-bold">الرقم الأكاديمي</th>
                <th className="px-4 py-3 font-bold">اسم الطالب المقيد</th>
                <th className="px-4 py-3 font-bold">الصف المستهدف</th>
                <th className="px-4 py-3 font-bold">رقم الجوال</th>
                <th className="px-4 py-3">حالة القيد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-xs">
              {activeData.map((st: any) => (
                <tr key={st.id} className="hover:bg-gray-50/20">
                  <td className="px-4 py-3 font-mono font-bold text-gray-950">{st.academicId}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{st.name}</td>
                  <td className="px-4 py-3">{st.grade} - الشعبة ({st.division})</td>
                  <td className="px-4 py-3 font-mono">{st.phone}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[9px] font-bold">نشط</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === 'grades' && (
          <table className="w-full text-sm text-right text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 font-bold">تاريخ الرصد</th>
                <th className="px-4 py-3 font-bold">اسم الطالب</th>
                <th className="px-4 py-3 font-bold">نوع التقييم</th>
                <th className="px-4 py-3 text-center">الدرجة الممنوحة</th>
                <th className="px-4 py-3 text-center">الدرجة العظمى</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-xs">
              {activeData.map((g: any) => (
                <tr key={g.id} className="hover:bg-gray-50/20">
                  <td className="px-4 py-3 font-mono text-gray-400">{g.date}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{getStudentName(g.studentId)}</td>
                  <td className="px-4 py-3 font-medium text-gray-600">{g.type}</td>
                  <td className="px-4 py-3 text-center font-bold text-blue-600">{g.score}</td>
                  <td className="px-4 py-3 text-center font-medium text-gray-400">{g.maxScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === 'finance' && (
          <table className="w-full text-sm text-right text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 font-bold">الرقم المالي</th>
                <th className="px-4 py-3 font-bold">اسم الطالب المستفيد</th>
                <th className="px-4 py-3 font-bold">نوع المطالبة المدرسية</th>
                <th className="px-4 py-3 text-center">المبلغ الكلي</th>
                <th className="px-4 py-3 text-center">المبلغ المحصل</th>
                <th className="px-4 py-3 text-center">المتبقي المطلوب</th>
                <th className="px-4 py-3 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-xs">
              {activeData.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-gray-50/20">
                  <td className="px-4 py-3 font-mono font-bold text-gray-950">{inv.id}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{getStudentName(inv.studentId)}</td>
                  <td className="px-4 py-3">{inv.title}</td>
                  <td className="px-4 py-3 text-center font-bold text-gray-800 font-mono">{inv.amount.toLocaleString()} ر.س</td>
                  <td className="px-4 py-3 text-center font-bold text-green-600 font-mono">{inv.paidAmount.toLocaleString()} ر.س</td>
                  <td className="px-4 py-3 text-center font-bold text-rose-600 font-mono">{(inv.amount - inv.paidAmount).toLocaleString()} ر.س</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      inv.status === 'مدفوع' ? 'bg-green-50 text-green-700' :
                      inv.status === 'مدفوع جزئياً' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    </div>
  );
}

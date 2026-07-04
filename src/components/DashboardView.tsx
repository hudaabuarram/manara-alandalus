import { 
  Users, UserCheck, GraduationCap, Calendar, BookOpen, CreditCard, 
  Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, DollarSign, School
} from 'lucide-react';
import { 
  Student, Teacher, Parent, GradeClass, Subject, 
  AttendanceRecord, Exam, Invoice, Message 
} from '../types';
import { initialSettings } from '../data/mockData';

interface DashboardViewProps {
  students: Student[];
  teachers: Teacher[];
  parents: Parent[];
  classes: GradeClass[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  exams: Exam[];
  invoices: Invoice[];
  setActiveTab: (tab: string) => void;
  lang?: 'ar' | 'en';
}

export default function DashboardView({
  students,
  teachers,
  parents,
  classes,
  subjects,
  attendance,
  exams,
  invoices,
  setActiveTab,
  lang = 'ar'
}: DashboardViewProps) {

  const trans = (ar: string, en: string) => lang === 'ar' ? ar : en;

  // Calculate statistics
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  const totalDivisions = classes.reduce((acc, c) => acc + c.divisions.length, 0);
  const totalSubjects = subjects.length;
  const totalParents = parents.length;

  // Attendance metrics for today (2026-07-01)
  const todayRecords = attendance.filter(r => r.date === "2026-07-01");
  const presentToday = todayRecords.filter(r => r.status === 'حاضر' || r.status === 'متأخر').length;
  const absentToday = todayRecords.filter(r => r.status === 'غائب' || r.status === 'بعذر').length;
  const attendanceRate = todayRecords.length > 0 ? Math.round((presentToday / todayRecords.length) * 100) : 92;

  // Academic and Financial totals
  const totalPendingFees = invoices
    .filter(inv => inv.status !== 'مدفوع')
    .reduce((acc, inv) => acc + (inv.amount - inv.paidAmount), 0);

  const upcomingExamsCount = exams.length;

  // Latest activities
  const latestActivities = [
    {
      id: 1,
      title: trans("تسجيل حضور اليوم", "Today's Attendance"),
      desc: trans(`تم رصد حضور وغياب الطلاب لليوم بنسبة حضور بلغت ${attendanceRate}%`, `Student attendance recorded today with a rate of ${attendanceRate}%`),
      time: trans("اليوم، 08:15 ص", "Today, 08:15 AM"),
      icon: CheckCircle,
      color: "text-green-600 bg-green-50"
    },
    {
      id: 2,
      title: trans("طالب جديد مسجل", "New Student Registered"),
      desc: trans(`تم إضافة الطالب "${students[0]?.name || 'محمد السديري'}" إلى الصف الأول الثانوي للشعبة (أ)`, `Added student "${students[0]?.name || 'Mohamed Al-Sudairy'}" to Grade 10 - Section (A)`),
      time: trans("أمس، 02:40 م", "Yesterday, 02:40 PM"),
      icon: Users,
      color: "text-blue-600 bg-blue-50"
    },
    {
      id: 3,
      title: trans("فاتورة سداد جديدة", "New Payment Received"),
      desc: trans("تم استلام سداد قسط دراسي بقيمة 10,000 ريال للطالب محمد السديري", "Received a tuition installment payment of 10,000 SAR for student Mohamed Al-Sudairy"),
      time: trans("منذ يومين", "2 days ago"),
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      id: 4,
      title: trans("جدولة اختبار فترى", "Exam Scheduled"),
      desc: trans(`تم جدولة "${exams[0]?.title || 'الاختبار الفتري الأول'}" لمادة الرياضيات لشهر يوليو`, `Scheduled "${exams[0]?.title || 'First Midterm Exam'}" for Mathematics in July`),
      time: trans("منذ ٣ أيام", "3 days ago"),
      icon: Calendar,
      color: "text-amber-600 bg-amber-50"
    }
  ];

  return (
    <div className={`space-y-8 animate-in fade-in duration-250 ${lang === 'ar' ? 'text-right' : 'text-left'}`} id="dashboard-view-container">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl p-6 text-gray-800 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden" id="welcome-banner">
        <div className={`absolute top-0 h-full w-1.5 bg-blue-600 ${lang === 'ar' ? 'right-0' : 'left-0'}`} />
        <div className={lang === 'ar' ? 'pr-2' : 'pl-2'}>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {trans("أهلاً بك مجدداً في بوابة الإدارة المدرسية 👋", "Welcome back to the School Administration Portal 👋")}
          </h2>
          <p className="text-xs text-gray-505 mt-1.5 leading-relaxed max-w-3xl">
            {trans(
              `تمنحك لوحة التحكم الشاملة نظرة فورية على الأداء التعليمي، الإيرادات المباشرة، نسب الحضور اليومية، ومؤشرات تواصل أولياء الأمور والمعلمين لعام الدراسي ${initialSettings.academicYear}.`,
              `Your comprehensive dashboard provides an instant view of academic performance, direct revenues, daily attendance rates, and parent-teacher communication metrics for the academic year ${initialSettings.academicYear}.`
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 pr-2 md:pr-0">
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-bold border border-blue-100">
            {trans(initialSettings.currentSemester, "First Semester")}
          </span>
          <span className="text-xs bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg font-bold">
            {trans("٢٠٢٦م", "2026")}
          </span>
        </div>
      </div>

      {/* Grid of Statistical Cards */}
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-4">{trans("المؤشرات والإحصائيات العامة", "General Indicators & Statistics")}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-cards-grid">
          
          {/* Card 1: Students */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">{trans("إجمالي الطلاب", "Total Students")}</span>
              <h3 className="text-2xl font-bold text-gray-900">{totalStudents} {trans("طالب", "Students")}</h3>
              <p className="text-[10px] text-green-600 font-semibold">{trans("+12% عن الشهر الماضي", "+12% from last month")}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
              <GraduationCap size={24} />
            </div>
          </div>

          {/* Card 2: Teachers */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">{trans("الكادر التعليمي", "Academic Staff")}</span>
              <h3 className="text-2xl font-bold text-gray-900">{totalTeachers} {trans("معلم", "Teachers")}</h3>
              <p className="text-[10px] text-gray-400 font-semibold">{trans("مكتمل النصاب", "Fully Staffed")}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 shrink-0">
              <Users size={24} />
            </div>
          </div>

          {/* Card 3: Classes & Divisions */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">{trans("الصفوف والشعب", "Classes & Divisions")}</span>
              <h3 className="text-2xl font-bold text-gray-900">{totalClasses} {trans("صف", "Classes")}</h3>
              <p className="text-[10px] text-gray-400 font-semibold">{totalDivisions} {trans("شعبة نشطة", "Active Divisions")}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
              <School size={24} />
            </div>
          </div>

          {/* Card 4: Attendance Today */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">{trans("نسبة حضور اليوم", "Today's Attendance Rate")}</span>
              <h3 className="text-2xl font-bold text-green-600">{attendanceRate}%</h3>
              <p className="text-[10px] text-blue-600 font-semibold">{trans("هدف اليوم المخطط", "Planned Daily Target")}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
              <UserCheck size={24} />
            </div>
          </div>

          {/* Card 5: Absences Today */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">{trans("غيابات اليوم", "Absences Today")}</span>
              <h3 className="text-2xl font-bold text-red-600">{absentToday} {trans("طالب", "Students")}</h3>
              <p className="text-[10px] text-red-500 font-semibold">{trans("قيد المتابعة مع الأهالي", "Under parent follow-up")}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 shrink-0">
              <XCircle size={24} />
            </div>
          </div>

          {/* Card 6: Subject counts */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">{trans("المواد الدراسية", "School Subjects")}</span>
              <h3 className="text-2xl font-bold text-gray-900">{totalSubjects} {trans("مادة", "Subjects")}</h3>
              <p className="text-[10px] text-gray-400 font-semibold">{trans("تغطي الكفايات الأساسية", "Covers core curriculum")}</p>
            </div>
            <div className="w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-600 shrink-0">
              <BookOpen size={24} />
            </div>
          </div>

          {/* Card 7: Exams */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">{trans("امتحانات مجدولة", "Scheduled Exams")}</span>
              <h3 className="text-2xl font-bold text-amber-600">{upcomingExamsCount} {trans("اختبار", "Exams")}</h3>
              <p className="text-[10px] text-amber-600 font-semibold">{trans("للربع الأكاديمي الحالي", "Current academic quarter")}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 shrink-0">
              <Calendar size={24} />
            </div>
          </div>

          {/* Card 8: Pending Fees */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">{trans("رسوم مستحقة معلقة", "Outstanding Pending Fees")}</span>
              <h3 className="text-2xl font-bold text-rose-600">{totalPendingFees.toLocaleString()} {trans("ر.س", "SAR")}</h3>
              <p className="text-[10px] text-rose-500 font-semibold">{trans("قيد المتابعة والتحصيل", "Under collection")}</p>
            </div>
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 shrink-0">
              <CreditCard size={24} />
            </div>
          </div>

        </div>
      </div>

      {/* Charts Section - Gorgeous custom responsive SVG infographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-charts-container">
        
        {/* Chart 1: Attendance Rate & Trends */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-bold text-xs text-gray-900">{trans("معدلات حضور الطلاب أسبوعياً", "Weekly Student Attendance Rate")}</h4>
              <p className="text-[10px] text-gray-500">{trans("متوسط الرصد اليومي للحضور لجميع المراحل", "Average daily attendance tracking across all stages")}</p>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
              {trans("مستقر ٩٦٪", "Stable 96%")}
            </span>
          </div>
          
          {/* Custom SVG Attendance Chart */}
          <div className="h-48 relative flex items-end justify-between px-4 pb-4">
            <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-gray-400 pointer-events-none">
              <div className="border-b border-gray-100 w-full pt-1">100%</div>
              <div className="border-b border-gray-100 w-full">75%</div>
              <div className="border-b border-gray-100 w-full">50%</div>
              <div className="border-b border-gray-100 w-full">25%</div>
            </div>

            {/* Days Bars */}
            {[
              { day: trans('الأحد', 'Sunday'), rate: 98, color: 'bg-blue-600' },
              { day: trans('الأحد (ب)', 'Sun (B)'), rate: 96, color: 'bg-blue-500' },
              { day: trans('الاثنين', 'Monday'), rate: 95, color: 'bg-blue-600' },
              { day: trans('الثلاثاء', 'Tuesday'), rate: 94, color: 'bg-blue-500' },
              { day: trans('الأربعاء', 'Wednesday'), rate: 97, color: 'bg-blue-600' },
              { day: trans('الخميس', 'Thursday'), rate: 92, color: 'bg-blue-400' },
            ].map((d, idx) => (
              <div key={idx} className="flex flex-col items-center w-12 z-10 group cursor-pointer">
                <div className="w-full bg-gray-100 rounded-t-lg h-36 flex items-end relative overflow-hidden">
                  <div 
                    className={`w-full ${d.color} rounded-t-lg transition-all duration-500 group-hover:brightness-105`} 
                    style={{ height: `${d.rate}%` }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-50">
                    {d.rate}% {trans("الحضور", "Attendance")}
                  </div>
                </div>
                <span className="text-[10px] text-gray-600 font-bold mt-2">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Revenue Stream */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-bold text-xs text-gray-900">{trans("إيرادات الرسوم والتحصيلات", "Fees & Collections Revenue")}</h4>
              <p className="text-[10px] text-gray-500">{trans("مقارنة بين إجمالي الرسوم المفروضة والمحصلة", "Comparison between total invoiced and collected fees")}</p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {trans("٧٢٪ تحصيل", "72% Collection")}
            </span>
          </div>

          <div className="h-48 relative flex items-end justify-around px-4 pb-4">
            <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-gray-400 pointer-events-none">
              <div className="border-b border-gray-100 w-full pt-1">{trans("٥٠ ألف", "50k")}</div>
              <div className="border-b border-gray-100 w-full">{trans("٣٠ ألف", "30k")}</div>
              <div className="border-b border-gray-100 w-full">{trans("١٠ آلاف", "10k")}</div>
              <div className="border-b border-gray-100 w-full">0</div>
            </div>

            {/* Invoices statistics */}
            {[
              { label: trans('الرسوم الكلية', 'Total Fees'), amount: 57000, color: 'bg-gray-200' },
              { label: trans('المبالغ المحصلة', 'Collected Amount'), amount: 37000, color: 'bg-emerald-600' },
              { label: trans('المتبقي المعلق', 'Outstanding Remaining'), amount: 20000, color: 'bg-rose-500' },
            ].map((item, idx) => {
              const heightPercent = Math.round((item.amount / 57000) * 100);
              return (
                <div key={idx} className="flex flex-col items-center w-20 z-10 group cursor-pointer">
                  <div className="w-10 bg-gray-100 rounded-t-lg h-36 flex items-end relative overflow-hidden">
                    <div 
                      className={`w-full ${item.color} rounded-t-lg transition-all duration-500`} 
                      style={{ height: `${heightPercent}%` }}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-50">
                      {item.amount.toLocaleString()} {trans("ريال", "SAR")}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-700 font-bold mt-2 text-center whitespace-nowrap">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Student Distribution */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-xs text-gray-900">{trans("توزيع الطلاب حسب المراحل الدراسية", "Student Distribution by Stage")}</h4>
              <p className="text-[10px] text-gray-500">{trans("حجم تسجيل الطلاب في كل مرحلة تعليمية", "Student registration volume per educational stage")}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 py-4">
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              {/* Custom SVG Donut representation */}
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#E5E7EB" strokeWidth="3" />
                {/* Secondary: 60% (Blue) */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#2563EB" strokeWidth="3.2" 
                  strokeDasharray="60 40" strokeDashoffset="0" />
                {/* Primary: 40% (Green) */}
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#16A34A" strokeWidth="3.2" 
                  strokeDasharray="40 60" strokeDashoffset="-60" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-gray-900 leading-none">{totalStudents}</span>
                <span className="text-[9px] text-gray-400 font-bold mt-1">{trans("طالب نشط", "Active Student")}</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-600" />
                  <span className="text-xs text-gray-700 font-bold">{trans("المرحلة الثانوية", "High School")}</span>
                </div>
                <span className="text-xs text-gray-900 font-bold">{trans("٣ طلاب (٦٠٪)", "3 Students (60%)")}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-600" />
                  <span className="text-xs text-gray-700 font-bold">{trans("المرحلة المتوسطة", "Middle School")}</span>
                </div>
                <span className="text-xs text-gray-900 font-bold">{trans("٢ طلاب (٤٠٪)", "2 Students (40%)")}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gray-200" />
                  <span className="text-xs text-gray-700 font-bold">{trans("المرحلة الابتدائية", "Elementary School")}</span>
                </div>
                <span className="text-xs text-gray-450 font-medium">{trans("٠ طلاب (٠٪)", "0 Students (0%)")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 4: Academic Performance */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-xs text-gray-900">{trans("متوسط الأداء الأكاديمي في المواد", "Average Academic Performance by Subject")}</h4>
              <p className="text-[10px] text-gray-500">{trans("متوسط درجات الطلاب المسجلة في المواد الأساسية", "Average grades recorded in core subjects")}</p>
            </div>
            <TrendingUp size={16} className="text-blue-600" />
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { name: trans('الرياضيات (أ. ياسر)', 'Mathematics (Mr. Yasser)'), avg: 92, color: 'bg-blue-600' },
              { name: trans('الفيزياء (د. طارق)', 'Physics (Dr. Tariq)'), avg: 88, color: 'bg-blue-500' },
              { name: trans('الكفايات اللغوية (أ. نورة)', 'Language Skills (Ms. Noura)'), avg: 95, color: 'bg-emerald-600' },
              { name: trans('اللغة الإنجليزية (أ. ماجد)', 'English Language (Mr. Majed)'), avg: 81, color: 'bg-amber-500' },
            ].map((sub, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-700">{sub.name}</span>
                  <span className="text-gray-900">{sub.avg}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${sub.color} rounded-full`} style={{ width: `${sub.avg}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Latest Activities Board */}
      <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs">
        <h4 className="font-bold text-xs text-gray-900 mb-4">{trans("آخر النشاطات وتحديثات النظام الحية", "Latest Activities & Live Updates")}</h4>
        <div className={`relative ${lang === 'ar' ? 'border-r border-gray-100 pr-5' : 'border-l border-gray-100 pl-5'} space-y-5`} id="activities-timeline">
          {latestActivities.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="relative group">
                {/* Visual timeline bullet */}
                <div className={`absolute top-1.5 w-4.5 h-4.5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shrink-0 z-10 transition-colors group-hover:bg-blue-50 ${lang === 'ar' ? '-right-[27px]' : '-left-[27px]'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-xs text-gray-800 flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${act.color}`}>
                        {act.title}
                      </span>
                    </h5>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{act.desc}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">{act.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

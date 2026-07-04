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
  setActiveTab
}: DashboardViewProps) {

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
      title: "تسجيل حضور اليوم",
      desc: `تم رصد حضور وغياب الطلاب لليوم بنسبة حضور بلغت ${attendanceRate}%`,
      time: "اليوم، 08:15 ص",
      icon: CheckCircle,
      color: "text-green-600 bg-green-50"
    },
    {
      id: 2,
      title: "طالب جديد مسجل",
      desc: `تم إضافة الطالب "${students[0]?.name || 'محمد السديري'}" إلى الصف الأول الثانوي للشعبة (أ)`,
      time: "أمس، 02:40 م",
      icon: Users,
      color: "text-blue-600 bg-blue-50"
    },
    {
      id: 3,
      title: "فاتورة سداد جديدة",
      desc: "تم استلام سداد قسط دراسي بقيمة 10,000 ريال للطالب محمد السديري",
      time: "منذ يومين",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      id: 4,
      title: "جدولة اختبار فترى",
      desc: `تم جدولة "${exams[0]?.title || 'الاختبار الفتري الأول'}" لمادة الرياضيات لشهر يوليو`,
      time: "منذ ٣ أيام",
      icon: Calendar,
      color: "text-amber-600 bg-amber-50"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-250 text-right" id="dashboard-view-container">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl p-6 text-gray-800 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden" id="welcome-banner">
        <div className="absolute right-0 top-0 h-full w-1.5 bg-blue-600" />
        <div className="pr-2">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">أهلاً بك مجدداً في بوابة الإدارة المدرسية 👋</h2>
          <p className="text-xs text-gray-505 mt-1.5 leading-relaxed max-w-3xl">
            تمنحك لوحة التحكم الشاملة نظرة فورية على الأداء التعليمي، الإيرادات المباشرة، نسب الحضور اليومية، ومؤشرات تواصل أولياء الأمور والمعلمين لعام الدراسي {initialSettings.academicYear}.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 pr-2 md:pr-0">
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-bold border border-blue-100">
            {initialSettings.currentSemester}
          </span>
          <span className="text-xs bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg font-bold">
            ٢٠٢٦م
          </span>
        </div>
      </div>

      {/* Grid of Statistical Cards */}
      <div>
        <h3 className="font-bold text-gray-800 text-sm mb-4">المؤشرات والإحصائيات العامة</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-cards-grid">
          
          {/* Card 1: Students */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">إجمالي الطلاب</span>
              <h3 className="text-2xl font-bold text-gray-900">{totalStudents} طالب</h3>
              <p className="text-[10px] text-green-600 font-semibold">+12% عن الشهر الماضي</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
              <GraduationCap size={24} />
            </div>
          </div>

          {/* Card 2: Teachers */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">الكادر التعليمي</span>
              <h3 className="text-2xl font-bold text-gray-900">{totalTeachers} معلم</h3>
              <p className="text-[10px] text-gray-400 font-semibold">مكتمل النصاب</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 shrink-0">
              <Users size={24} />
            </div>
          </div>

          {/* Card 3: Classes & Divisions */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">الصفوف والشعب</span>
              <h3 className="text-2xl font-bold text-gray-900">{totalClasses} صف</h3>
              <p className="text-[10px] text-gray-400 font-semibold">{totalDivisions} شعبة نشطة</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
              <School size={24} />
            </div>
          </div>

          {/* Card 4: Attendance Today */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">نسبة حضور اليوم</span>
              <h3 className="text-2xl font-bold text-green-600">{attendanceRate}%</h3>
              <p className="text-[10px] text-blue-600 font-semibold">هدف اليوم المخطط</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
              <UserCheck size={24} />
            </div>
          </div>

          {/* Card 5: Absences Today */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">غيابات اليوم</span>
              <h3 className="text-2xl font-bold text-red-600">{absentToday} طالب</h3>
              <p className="text-[10px] text-red-500 font-semibold">قيد المتابعة مع الأهالي</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 shrink-0">
              <XCircle size={24} />
            </div>
          </div>

          {/* Card 6: Subject counts */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">المواد الدراسية</span>
              <h3 className="text-2xl font-bold text-gray-900">{totalSubjects} مادة</h3>
              <p className="text-[10px] text-gray-400 font-semibold">تغطي الكفايات الأساسية</p>
            </div>
            <div className="w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-600 shrink-0">
              <BookOpen size={24} />
            </div>
          </div>

          {/* Card 7: Exams */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">امتحانات مجدولة</span>
              <h3 className="text-2xl font-bold text-amber-600">{upcomingExamsCount} اختبار</h3>
              <p className="text-[10px] text-amber-600 font-semibold">للربع الأكاديمي الحالي</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 shrink-0">
              <Calendar size={24} />
            </div>
          </div>

          {/* Card 8: Pending Fees */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center hover:shadow-sm transition-all duration-200">
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-medium block">رسوم مستحقة معلقة</span>
              <h3 className="text-2xl font-bold text-rose-600">{totalPendingFees.toLocaleString()} ر.س</h3>
              <p className="text-[10px] text-rose-500 font-semibold">قيد المتابعة والتحصيل</p>
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
              <h4 className="font-bold text-xs text-gray-900">معدلات حضور الطلاب أسبوعياً</h4>
              <p className="text-[10px] text-gray-500">متوسط الرصد اليومي للحضور لجميع المراحل</p>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">مستقر ٩٦٪</span>
          </div>
          
          {/* Custom SVG Attendance Chart */}
          <div className="h-48 relative flex items-end justify-between px-4 pb-4">
            <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-gray-400 pointer-events-none">
              <div className="border-b border-gray-100 w-full pt-1">١٠٠٪</div>
              <div className="border-b border-gray-100 w-full">٧٥٪</div>
              <div className="border-b border-gray-100 w-full">٥٠٪</div>
              <div className="border-b border-gray-100 w-full">٢٥٪</div>
            </div>

            {/* Days Bars */}
            {[
              { day: 'الأحد', rate: 98, color: 'bg-blue-600' },
              { day: 'الأحد (ب)', rate: 96, color: 'bg-blue-500' },
              { day: 'الاثنين', rate: 95, color: 'bg-blue-600' },
              { day: 'الثلاثاء', rate: 94, color: 'bg-blue-500' },
              { day: 'الأربعاء', rate: 97, color: 'bg-blue-600' },
              { day: 'الخميس', rate: 92, color: 'bg-blue-400' },
            ].map((d, idx) => (
              <div key={idx} className="flex flex-col items-center w-12 z-10 group cursor-pointer">
                <div className="w-full bg-gray-100 rounded-t-lg h-36 flex items-end relative overflow-hidden">
                  <div 
                    className={`w-full ${d.color} rounded-t-lg transition-all duration-500 group-hover:brightness-105`} 
                    style={{ height: `${d.rate}%` }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-50">
                    {d.rate}% الحضور
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
              <h4 className="font-bold text-xs text-gray-900">إيرادات الرسوم والتحصيلات</h4>
              <p className="text-[10px] text-gray-500">مقارنة بين إجمالي الرسوم المفروضة والمحصلة</p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">٧٢٪ تحصيل</span>
          </div>

          <div className="h-48 relative flex items-end justify-around px-4 pb-4">
            <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-gray-400 pointer-events-none">
              <div className="border-b border-gray-100 w-full pt-1">٥٠ ألف</div>
              <div className="border-b border-gray-100 w-full">٣٠ ألف</div>
              <div className="border-b border-gray-100 w-full">١٠ آلاف</div>
              <div className="border-b border-gray-100 w-full">٠</div>
            </div>

            {/* Invoices statistics */}
            {[
              { label: 'الرسوم الكلية', amount: 57000, color: 'bg-gray-200' },
              { label: 'المبالغ المحصلة', amount: 37000, color: 'bg-emerald-600' },
              { label: 'المتبقي المعلق', amount: 20000, color: 'bg-rose-500' },
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
                      {item.amount.toLocaleString()} ريال
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
              <h4 className="font-bold text-xs text-gray-900">توزيع الطلاب حسب المراحل الدراسية</h4>
              <p className="text-[10px] text-gray-500">حجم تسجيل الطلاب في كل مرحلة تعليمية</p>
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
                <span className="text-[9px] text-gray-400 font-bold mt-1">طالب نشط</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-600" />
                  <span className="text-xs text-gray-700 font-bold">المرحلة الثانوية</span>
                </div>
                <span className="text-xs text-gray-900 font-bold">٣ طلاب (٦٠٪)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-600" />
                  <span className="text-xs text-gray-700 font-bold">المرحلة المتوسطة</span>
                </div>
                <span className="text-xs text-gray-900 font-bold">٢ طلاب (٤٠٪)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gray-200" />
                  <span className="text-xs text-gray-700 font-bold">المرحلة الابتدائية</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">٠ طلاب (٠٪)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 4: Academic Performance */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-xs text-gray-900">متوسط الأداء الأكاديمي في المواد</h4>
              <p className="text-[10px] text-gray-500">متوسط درجات الطلاب المسجلة في المواد الأساسية</p>
            </div>
            <TrendingUp size={16} className="text-blue-600" />
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { name: 'الرياضيات (أ. ياسر)', avg: 92, color: 'bg-blue-600' },
              { name: 'الفيزياء (د. طارق)', avg: 88, color: 'bg-blue-500' },
              { name: 'الكفايات اللغوية (أ. نورة)', avg: 95, color: 'bg-emerald-600' },
              { name: 'اللغة الإنجليزية (أ. ماجد)', avg: 81, color: 'bg-amber-500' },
            ].map((sub, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-700">{sub.name}</span>
                  <span className="text-gray-900">{sub.avg}٪</span>
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
        <h4 className="font-bold text-xs text-gray-900 mb-4">آخر النشاطات وتحديثات النظام الحية</h4>
        <div className="relative border-r border-gray-100 pr-5 space-y-5" id="activities-timeline">
          {latestActivities.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="relative group">
                {/* Visual timeline bullet */}
                <div className="absolute -right-[27px] top-1.5 w-4.5 h-4.5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shrink-0 z-10 transition-colors group-hover:bg-blue-50">
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

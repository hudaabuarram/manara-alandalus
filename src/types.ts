export type UserRole = 'admin' | 'supervisor' | 'teacher' | 'student' | 'parent';

export interface Student {
  id: string;
  name: string;
  avatar?: string;
  academicId: string; // الرقم الأكاديمي
  stage: string; // المرحلة الدراسية (ابتدائي، متوسط، ثانوي)
  grade: string; // الصف الدراسي
  division: string; // الشعبة
  gender: 'ذكر' | 'أنثى';
  parentName: string;
  parentId: string;
  phone: string;
  status: 'نشط' | 'موقوف' | 'متخرج';
  address: string;
  dob: string;
  medicalRecord: string;
  notes: string;
}

export interface Teacher {
  id: string;
  name: string;
  avatar?: string;
  specialization: string; // التخصص الدراسي
  qualification: string; // المؤهل العلمي
  subjects: string[]; // المواد التي يدرسها
  grades: string[]; // الصفوف
  scheduleIds: string[];
  salary: number; // الراتب
  attendanceRate: number; // نسبة الحضور
  performanceScore: number; // تقييم الأداء (من 100)
  phone: string;
  email: string;
  status: 'نشط' | 'إجازة' | 'غير نشط';
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  job: string;
  address: string;
  childrenIds: string[];
  relation: string; // صلة القرابة
}

export interface GradeClass {
  id: string;
  name: string; // اسم الصف (مثال: الصف الأول الثانوي)
  stage: 'ابتدائي' | 'متوسط' | 'ثانوي';
  divisions: string[]; // الشعب (أ، ب، ج)
  capacity: number; // الطاقة الاستيعابية
  supervisorId: string; // المعلم المشرف
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  grade: string;
  periodsPerWeek: number; // عدد الحصص أسبوعياً
  teacherId: string;
}

export interface ScheduleItem {
  id: string;
  grade: string;
  division: string;
  subjectId: string;
  teacherId: string;
  day: 'الأحد' | 'الأثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';
  period: number; // الحصة (1، 2، 3، 4، 5، 6، 7)
  room: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'حاضر' | 'غائب' | 'متأخر' | 'بعذر';
  notes?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  grade: string;
  division: string;
  dueDate: string;
  maxPoints: number;
  description: string;
  fileUrl?: string;
  submissionsCount: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  fileUrl?: string;
  score?: number;
  status: 'تم التسليم' | 'تم التقييم' | 'متأخر';
  feedback?: string;
}

export interface Exam {
  id: string;
  title: string;
  type: 'شهري' | 'نصف سنوي' | 'نهائي' | 'قصير';
  subjectId: string;
  grade: string;
  date: string;
  time: string;
  duration: string; // المدة بالدقائق
  maxMarks: number;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  subjectId: string;
  examId?: string;
  assignmentId?: string;
  type: 'امتحان' | 'واجب' | 'مشاركة';
  score: number;
  maxScore: number;
  date: string;
}

export interface Invoice {
  id: string;
  studentId: string;
  title: string; // عنوان القسط أو الرسم الدراسي
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: 'مدفوع' | 'مدفوع جزئياً' | 'غير مدفوع';
  payments: Array<{
    date: string;
    amount: number;
    receiptId: string;
    method: 'نقدي' | 'شبكة' | 'تحويل بنكي';
  }>;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  available: number;
  location: string; // الرف أو القسم
}

export interface BookLoan {
  id: string;
  bookId: string;
  studentId: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  fine: number;
  status: 'مستعار' | 'تم الإرجاع' | 'متأخر';
}

export interface TransportRoute {
  id: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  routeName: string;
  stations: string[];
  activeLocationIndex?: number; // للمحاكاة
  studentsCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string; // 'all-teachers', 'all-parents', or individual ID
  receiverName: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface SystemSettings {
  schoolName: string;
  schoolLogo?: string;
  academicYear: string;
  currentSemester: string;
  phone: string;
  email: string;
  address: string;
  autoBackups: boolean;
  smsNotifications: boolean;
}

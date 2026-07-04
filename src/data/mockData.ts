import { 
  Student, Teacher, Parent, GradeClass, Subject, ScheduleItem, 
  AttendanceRecord, Assignment, AssignmentSubmission, Exam, 
  GradeRecord, Invoice, LibraryBook, BookLoan, TransportRoute, 
  Message, SystemSettings 
} from '../types';

export const initialSettings: SystemSettings = {
  schoolName: "منارة الأندلس الأهلية النموذجية",
  schoolLogo: "🏫",
  academicYear: "2026/2027",
  currentSemester: "الفصل الدراسي الأول",
  phone: "011-4567890",
  email: "info@andalus.edu.sa",
  address: "الرياض، حي الياسمين، طريق الملك عبدالعزيز",
  autoBackups: true,
  smsNotifications: true
};

export const initialParents: Parent[] = [
  {
    id: "p1",
    name: "عبدالرحمن بن محمد السديري",
    phone: "0501111111",
    email: "a.sudairy@email.com",
    job: "مهندس برمجيات",
    address: "الرياض، حي الصحافة",
    childrenIds: ["s1", "s4"],
    relation: "أب"
  },
  {
    id: "p2",
    name: "خالد بن عبدالله السعدون",
    phone: "0502222222",
    email: "k.sadoon@email.com",
    job: "طبيب استشاري",
    address: "الرياض، حي الملقا",
    childrenIds: ["s2"],
    relation: "أب"
  },
  {
    id: "p3",
    name: "سارة بنت عبدالعزيز الشقير",
    phone: "0503333333",
    email: "sara.shuqair@email.com",
    job: "أستاذة جامعية",
    address: "الرياض، حي النخيل",
    childrenIds: ["s3", "s5"],
    relation: "أم"
  }
];

export const initialStudents: Student[] = [
  {
    id: "s1",
    name: "محمد بن عبدالرحمن السديري",
    academicId: "444102911",
    stage: "ثانوي",
    grade: "الصف الأول الثانوي",
    division: "أ",
    gender: "ذكر",
    parentName: "عبدالرحمن بن محمد السديري",
    parentId: "p1",
    phone: "0501111111",
    status: "نشط",
    address: "الرياض، حي الصحافة",
    dob: "2010-05-12",
    medicalRecord: "سليم (لا توجد أمراض مزمنة)",
    notes: "طالب متميز في الرياضيات ويشارك في الإذاعة المدرسية."
  },
  {
    id: "s2",
    name: "فيصل بن خالد السعدون",
    academicId: "444102912",
    stage: "ثانوي",
    grade: "الصف الأول الثانوي",
    division: "أ",
    gender: "ذكر",
    parentName: "خالد بن عبدالله السعدون",
    parentId: "p2",
    phone: "0502222222",
    status: "نشط",
    address: "الرياض، حي الملقا",
    dob: "2010-09-20",
    medicalRecord: "ربو خفيف (يستخدم بخاخ عند الحاجة)",
    notes: "يمتلك مهارات قيادية عالية وعضو في المجلس الطلابي."
  },
  {
    id: "s3",
    name: "جود بنت فهد القحطاني",
    academicId: "444102913",
    stage: "ثانوي",
    grade: "الصف الثاني الثانوي",
    division: "ب",
    gender: "أنثى",
    parentName: "سارة بنت عبدالعزيز الشقير",
    parentId: "p3",
    phone: "0503333333",
    status: "نشط",
    address: "الرياض، حي النخيل",
    dob: "2009-02-14",
    medicalRecord: "حساسية من المكسرات",
    notes: "فائزة بالمركز الأول في مسابقة تحدي القراءة العربي على مستوى المدرسة."
  },
  {
    id: "s4",
    name: "ياسر بن عبدالرحمن السديري",
    academicId: "444102914",
    stage: "متوسط",
    grade: "الصف الثالث المتوسط",
    division: "أ",
    gender: "ذكر",
    parentName: "عبدالرحمن بن محمد السديري",
    parentId: "p1",
    phone: "0501111111",
    status: "نشط",
    address: "الرياض، حي الصحافة",
    dob: "2011-11-30",
    medicalRecord: "سليم",
    notes: "شغوف بالحاسب الآلي والبرمجة الروبوتية."
  },
  {
    id: "s5",
    name: "لجين بنت فهد القحطاني",
    academicId: "444102915",
    stage: "متوسط",
    grade: "الصف الأول المتوسط",
    division: "ج",
    gender: "أنثى",
    parentName: "سارة بنت عبدالعزيز الشقير",
    parentId: "p3",
    phone: "0503333333",
    status: "نشط",
    address: "الرياض، حي النخيل",
    dob: "2013-07-08",
    medicalRecord: "سليم",
    notes: "تتمتع بموهبة الرسم وتشارك بانتظام في معرض التربية الفنية."
  }
];

export const initialTeachers: Teacher[] = [
  {
    id: "t1",
    name: "أ. ياسر بن سليمان الحربي",
    specialization: "الرياضيات",
    qualification: "ماجستير في طرق تدريس الرياضيات",
    subjects: ["الرياضيات ١", "الرياضيات ٢"],
    grades: ["الصف الأول الثانوي", "الصف الثاني الثانوي"],
    scheduleIds: [],
    salary: 12500,
    attendanceRate: 98.2,
    performanceScore: 96,
    phone: "0554444444",
    email: "yasser.h@andalus.edu.sa",
    status: "نشط"
  },
  {
    id: "t2",
    name: "أ. نورة بنت عبدالعزيز العتيبي",
    specialization: "اللغة العربية",
    qualification: "بكالوريوس اللغة العربية وآدابها",
    subjects: ["الكفايات اللغوية ١", "البلاغة والنقد"],
    grades: ["الصف الأول الثانوي", "الصف الثاني الثانوي"],
    scheduleIds: [],
    salary: 11000,
    attendanceRate: 95.5,
    performanceScore: 94,
    phone: "0555555555",
    email: "noura.a@andalus.edu.sa",
    status: "نشط"
  },
  {
    id: "t3",
    name: "د. طارق بن خالد الشهري",
    specialization: "الفيزياء والعلوم",
    qualification: "دكتوراه في الفيزياء التعليمية",
    subjects: ["الفيزياء ١", "العلوم العامة"],
    grades: ["الصف الأول الثانوي", "الصف الثالث المتوسط"],
    scheduleIds: [],
    salary: 14000,
    attendanceRate: 99.0,
    performanceScore: 98,
    phone: "0556666666",
    email: "tariq.s@andalus.edu.sa",
    status: "نشط"
  },
  {
    id: "t4",
    name: "أ. ماجد بن عبدالله الشمري",
    specialization: "اللغة الإنجليزية",
    qualification: "بكالوريوس أدب إنجليزي",
    subjects: ["اللغة الإنجليزية ١", "اللغة الإنجليزية ٢"],
    grades: ["الصف الأول الثانوي", "الصف الثالث المتوسط", "الصف الأول المتوسط"],
    scheduleIds: [],
    salary: 11500,
    attendanceRate: 94.8,
    performanceScore: 91,
    phone: "0557777777",
    email: "majed.s@andalus.edu.sa",
    status: "نشط"
  }
];

export const initialClasses: GradeClass[] = [
  {
    id: "c1",
    name: "الصف الأول الثانوي",
    stage: "ثانوي",
    divisions: ["أ", "ب"],
    capacity: 25,
    supervisorId: "t1"
  },
  {
    id: "c2",
    name: "الصف الثاني الثانوي",
    stage: "ثانوي",
    divisions: ["أ", "ب", "ج"],
    capacity: 25,
    supervisorId: "t2"
  },
  {
    id: "c3",
    name: "الصف الثالث المتوسط",
    stage: "متوسط",
    divisions: ["أ", "ب"],
    capacity: 30,
    supervisorId: "t3"
  },
  {
    id: "c4",
    name: "الصف الأول المتوسط",
    stage: "متوسط",
    divisions: ["أ", "ب", "ج"],
    capacity: 30,
    supervisorId: "t4"
  }
];

export const initialSubjects: Subject[] = [
  {
    id: "sub1",
    name: "الرياضيات ١",
    code: "MATH-101",
    grade: "الصف الأول الثانوي",
    periodsPerWeek: 4,
    teacherId: "t1"
  },
  {
    id: "sub2",
    name: "الكفايات اللغوية ١",
    code: "ARAB-101",
    grade: "الصف الأول الثانوي",
    periodsPerWeek: 3,
    teacherId: "t2"
  },
  {
    id: "sub3",
    name: "الفيزياء ١",
    code: "PHYS-101",
    grade: "الصف الأول الثانوي",
    periodsPerWeek: 4,
    teacherId: "t3"
  },
  {
    id: "sub4",
    name: "اللغة الإنجليزية ١",
    code: "ENGL-101",
    grade: "الصف الأول الثانوي",
    periodsPerWeek: 4,
    teacherId: "t4"
  },
  {
    id: "sub5",
    name: "العلوم العامة",
    code: "SCI-301",
    grade: "الصف الثالث المتوسط",
    periodsPerWeek: 3,
    teacherId: "t3"
  }
];

export const initialSchedule: ScheduleItem[] = [
  // Sunday
  { id: "sch1", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub1", teacherId: "t1", day: "الأحد", period: 1, room: "قاعة ١٠١" },
  { id: "sch2", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub2", teacherId: "t2", day: "الأحد", period: 2, room: "قاعة ١٠١" },
  { id: "sch3", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub3", teacherId: "t3", day: "الأحد", period: 3, room: "قاعة ١٠١" },
  { id: "sch4", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub4", teacherId: "t4", day: "الأحد", period: 4, room: "مختبر الحاسب" },
  // Monday
  { id: "sch5", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub3", teacherId: "t3", day: "الأثنين", period: 1, room: "قاعة ١٠١" },
  { id: "sch6", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub1", teacherId: "t1", day: "الأثنين", period: 2, room: "قاعة ١٠١" },
  { id: "sch7", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub4", teacherId: "t4", day: "الأثنين", period: 3, room: "قاعة ١٠١" },
  // Tuesday
  { id: "sch8", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub2", teacherId: "t2", day: "الثلاثاء", period: 1, room: "قاعة ١٠١" },
  { id: "sch9", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub1", teacherId: "t1", day: "الثلاثاء", period: 3, room: "قاعة ١٠١" },
  { id: "sch10", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub4", teacherId: "t4", day: "الثلاثاء", period: 4, room: "قاعة ١٠١" },
  // Wednesday
  { id: "sch11", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub3", teacherId: "t3", day: "الأربعاء", period: 2, room: "مختبر العلوم" },
  { id: "sch12", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub1", teacherId: "t1", day: "الأربعاء", period: 3, room: "قاعة ١٠١" },
  { id: "sch13", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub2", teacherId: "t2", day: "الأربعاء", period: 5, room: "قاعة ١٠١" },
  // Thursday
  { id: "sch14", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub4", teacherId: "t4", day: "الخميس", period: 1, room: "قاعة ١٠١" },
  { id: "sch15", grade: "الصف الأول الثانوي", division: "أ", subjectId: "sub3", teacherId: "t3", day: "الخميس", period: 2, room: "قاعة ١٠١" },
];

export const initialAttendance: AttendanceRecord[] = [
  // Today's attendance defaults or previous records
  { id: "att1", studentId: "s1", date: "2026-07-01", status: "حاضر" },
  { id: "att2", studentId: "s2", date: "2026-07-01", status: "متأخر", notes: "تأخر ١٠ دقائق عن الطابور الصباحي" },
  { id: "att3", studentId: "s3", date: "2026-07-01", status: "حاضر" },
  { id: "att4", studentId: "s4", date: "2026-07-01", status: "غائب", notes: "بدون عذر مسبق" },
  { id: "att5", studentId: "s5", date: "2026-07-01", status: "بعذر", notes: "مستند طبي لعيادة الأسنان" },
];

export const initialAssignments: Assignment[] = [
  {
    id: "asm1",
    title: "حل تمارين المتتاليات الحسابية ص ٣٤",
    subjectId: "sub1",
    grade: "الصف الأول الثانوي",
    division: "أ",
    dueDate: "2026-07-05",
    maxPoints: 10,
    description: "الرجاء حل الأسئلة الفردية من ١ إلى ٩ وتصوير الحل في ملف PDF ورفعه هنا.",
    submissionsCount: 2
  },
  {
    id: "asm2",
    title: "تقرير تجربة سقوط الأجسام في الجاذبية",
    subjectId: "sub3",
    grade: "الصف الأول الثانوي",
    division: "أ",
    dueDate: "2026-07-08",
    maxPoints: 15,
    description: "كتابة تقرير معمل الفيزياء للتجربة التي قمنا بها يوم الأربعاء الماضي مع حساب نسبة الخطأ في الجاذبية.",
    submissionsCount: 1
  }
];

export const initialSubmissions: AssignmentSubmission[] = [
  {
    id: "subm1",
    assignmentId: "asm1",
    studentId: "s1",
    submittedAt: "2026-07-01 15:30",
    status: "تم التقييم",
    score: 10,
    feedback: "حل متميز ومنظم جداً يا محمد. أحسنت."
  },
  {
    id: "subm2",
    assignmentId: "asm1",
    studentId: "s2",
    submittedAt: "2026-07-01 18:15",
    status: "تم التسليم"
  },
  {
    id: "subm3",
    assignmentId: "asm2",
    studentId: "s1",
    submittedAt: "2026-07-01 20:00",
    status: "تم التسليم"
  }
];

export const initialExams: Exam[] = [
  {
    id: "ex1",
    title: "الاختبار الفتري الأول - الفصل الأول",
    type: "شهري",
    subjectId: "sub1",
    grade: "الصف الأول الثانوي",
    date: "2026-07-15",
    time: "08:30",
    duration: "60",
    maxMarks: 20
  },
  {
    id: "ex2",
    title: "اختبار الفيزياء التجريبي",
    type: "قصير",
    subjectId: "sub3",
    grade: "الصف الأول الثانوي",
    date: "2026-07-20",
    time: "09:45",
    duration: "45",
    maxMarks: 10
  }
];

export const initialGrades: GradeRecord[] = [
  { id: "g1", studentId: "s1", subjectId: "sub1", type: "واجب", score: 10, maxScore: 10, date: "2026-07-01" },
  { id: "g2", studentId: "s2", subjectId: "sub1", type: "واجب", score: 8, maxScore: 10, date: "2026-07-01" },
  { id: "g3", studentId: "s1", subjectId: "sub3", type: "امتحان", score: 18, maxScore: 20, date: "2026-06-25" },
  { id: "g4", studentId: "s2", subjectId: "sub3", type: "امتحان", score: 15, maxScore: 20, date: "2026-06-25" },
  { id: "g5", studentId: "s3", subjectId: "sub5", type: "مشاركة", score: 5, maxScore: 5, date: "2026-06-28" }
];

export const initialInvoices: Invoice[] = [
  {
    id: "inv1",
    studentId: "s1",
    title: "رسوم الفصل الدراسي الأول 2026/2027",
    amount: 15000,
    paidAmount: 10000,
    dueDate: "2026-09-01",
    status: "مدفوع جزئياً",
    payments: [
      { date: "2026-06-15", amount: 10000, receiptId: "REC-91028", method: "شبكة" }
    ]
  },
  {
    id: "inv2",
    studentId: "s2",
    title: "رسوم الفصل الدراسي الأول 2026/2027",
    amount: 15000,
    paidAmount: 15000,
    dueDate: "2026-09-01",
    status: "مدفوع",
    payments: [
      { date: "2026-06-10", amount: 15000, receiptId: "REC-91025", method: "تحويل بنكي" }
    ]
  },
  {
    id: "inv3",
    studentId: "s3",
    title: "رسوم النقل المدرسي - الفصل الأول",
    amount: 2500,
    paidAmount: 0,
    dueDate: "2026-08-15",
    status: "غير مدفوع",
    payments: []
  },
  {
    id: "inv4",
    studentId: "s4",
    title: "رسوم الفصل الدراسي الأول 2026/2027",
    amount: 12000,
    paidAmount: 12000,
    dueDate: "2026-09-01",
    status: "مدفوع",
    payments: [
      { date: "2026-06-20", amount: 12000, receiptId: "REC-91054", method: "نقدي" }
    ]
  }
];

export const initialBooks: LibraryBook[] = [
  { id: "b1", title: "مقدمة في الجبر المتقدم", author: "د. أحمد عبدالله", isbn: "978-3-16-148410-0", category: "الرياضيات", quantity: 5, available: 4, location: "الجناح أ - الرف ٣" },
  { id: "b2", title: "موسوعة تاريخ الأدب العربي", author: "شوقي ضيف", isbn: "978-9-77-016421-2", category: "الأدب", quantity: 3, available: 3, location: "الجناح ب - الرف ١" },
  { id: "b3", title: "الفيزياء للجميع", author: "د. علي مصطفى", isbn: "978-1-40-289462-6", category: "العلوم", quantity: 8, available: 7, location: "الجناح أ - الرف ٥" },
  { id: "b4", title: "رحلة في تاريخ الأندلس", author: "د. حسين مؤنس", isbn: "978-5-12-345678-9", category: "التاريخ", quantity: 4, available: 4, location: "الجناح ج - الرف ٢" }
];

export const initialLoans: BookLoan[] = [
  {
    id: "ln1",
    bookId: "b1",
    studentId: "s1",
    loanDate: "2026-06-20",
    dueDate: "2026-07-04",
    fine: 0,
    status: "مستعار"
  },
  {
    id: "ln2",
    bookId: "b3",
    studentId: "s2",
    loanDate: "2026-06-15",
    dueDate: "2026-06-29",
    returnDate: "2026-06-28",
    fine: 0,
    status: "تم الإرجاع"
  }
];

export const initialRoutes: TransportRoute[] = [
  {
    id: "r1",
    busNumber: "حافلة رقم ١٢",
    driverName: "أبو فهد العتيبي",
    driverPhone: "0509999991",
    routeName: "مسار حي الصحافة - الياسمين",
    stations: ["موقع الانطلاق", "شارع العليا", "تقاطع الملك سلمان", "حي الصحافة مربع ٢", "المدرسة"],
    activeLocationIndex: 3,
    studentsCount: 15
  },
  {
    id: "r2",
    busNumber: "حافلة رقم ٨",
    driverName: "خالد الحربي",
    driverPhone: "0509999992",
    routeName: "مسار حي النخيل - الملقا",
    stations: ["موقع الانطلاق", "طريق الثمامة", "حي الملقا مربع ٥", "شارع التخصصي", "المدرسة"],
    activeLocationIndex: 1,
    studentsCount: 12
  }
];

export const initialMessages: Message[] = [
  {
    id: "m1",
    senderId: "t1",
    senderName: "أ. ياسر بن سليمان الحربي",
    senderRole: "teacher",
    receiverId: "p1",
    receiverName: "عبدالرحمن بن محمد السديري",
    subject: "مستوى الطالب محمد في مادة الرياضيات",
    content: "السلام عليكم ورحمة الله وبركاته، أود أن أشيد بمستوى محمد الرائع في اختبار الرياضيات القصير اليوم حيث حقق الدرجة الكاملة. بارك الله في جهودكم وجهوده.",
    timestamp: "2026-07-01 10:00",
    isRead: false
  },
  {
    id: "m2",
    senderId: "p1",
    senderName: "عبدالرحمن بن محمد السديري",
    senderRole: "parent",
    receiverId: "t1",
    receiverName: "أ. ياسر بن سليمان الحربي",
    subject: "شكر وتقدير",
    content: "وعليكم السلام ورحمة الله وبركاته، أشكرك جزيل الشكر أستاذ ياسر على اهتمامك ومتابعتك الطيبة لمحمد. دافعيتك له سر نجاحه.",
    timestamp: "2026-07-01 11:15",
    isRead: true
  },
  {
    id: "m3",
    senderId: "admin",
    senderName: "المدير العام",
    senderRole: "admin",
    receiverId: "all-teachers",
    receiverName: "جميع المعلمين والمعلمات",
    subject: "اجتماع مجلس الإدارة القادم",
    content: "نحيطكم علماً بعقد اجتماع مجلس المعلمين الدوري لمناقشة نتائج الشهر الأول يوم الخميس القادم بعد الطابور الصباحي في قاعة الاجتماعات الرئيسية.",
    timestamp: "2026-06-30 08:00",
    isRead: true
  }
];

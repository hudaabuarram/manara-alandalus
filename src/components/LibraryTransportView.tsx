import React, { useState, useEffect } from 'react';
import { 
  Library, Bus, Search, Plus, MapPin, Phone, CheckCircle, 
  BookOpen, Clock, AlertCircle, Play, Bookmark, Map
} from 'lucide-react';
import { LibraryBook, BookLoan, TransportRoute, Student } from '../types';
import { transData } from '../lib/translateHelper';

interface LibraryTransportViewProps {
  books: LibraryBook[];
  setBooks: React.Dispatch<React.SetStateAction<LibraryBook[]>>;
  loans: BookLoan[];
  setLoans: React.Dispatch<React.SetStateAction<BookLoan[]>>;
  routes: TransportRoute[];
  setRoutes: React.Dispatch<React.SetStateAction<TransportRoute[]>>;
  students: Student[];
  activeSubTab?: 'library' | 'transport';
  lang?: 'ar' | 'en';
}

export default function LibraryTransportView({
  books,
  setBooks,
  loans,
  setLoans,
  routes,
  setRoutes,
  students,
  activeSubTab = 'library',
  lang = 'ar'
}: LibraryTransportViewProps) {
  const [currentTab, setCurrentTab] = useState<'library' | 'transport'>(activeSubTab);
  const [search, setSearch] = useState('');

  const trans = (ar: string, en: string) => lang === 'ar' ? ar : en;
  
  // Library filter
  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase()));

  // Live Bus Location Simulator: dynamically tick active bus index every 6 seconds to show progress
  useEffect(() => {
    if (currentTab !== 'transport') return;

    const interval = setInterval(() => {
      setRoutes(prev => prev.map(route => {
        if (route.activeLocationIndex !== undefined) {
          const nextIndex = (route.activeLocationIndex + 1) % route.stations.length;
          return { ...route, activeLocationIndex: nextIndex };
        }
        return route;
      }));
    }, 6000);

    return () => clearInterval(interval);
  }, [currentTab, setRoutes]);

  // Handle Book Return simulation
  const handleReturnBook = (loanId: string, bookId: string) => {
    // Mark loan as returned
    const updatedLoans = loans.map(ln => {
      if (ln.id === loanId) {
        return {
          ...ln,
          status: 'تم الإرجاع' as any,
          returnDate: new Date().toISOString().split('T')[0]
        };
      }
      return ln;
    });
    setLoans(updatedLoans);

    // Re-increment book availability
    const updatedBooks = books.map(bk => {
      if (bk.id === bookId) {
        return { ...bk, available: Math.min(bk.available + 1, bk.quantity) };
      }
      return bk;
    });
    setBooks(updatedBooks);
    
    alert(trans("تم تسجيل إرجاع الكتاب وإعادة النسخة للرف بنجاح!", "Book marked as returned successfully!"));
  };

  const getStudentName = (id: string) => {
    return students.find(s => s.id === id)?.name || trans('طالب مدرسة الأندلس', 'Al-Andalus School Student');
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-200 ${lang === 'ar' ? 'text-right' : 'text-left'}`} id="library-transport-container">
      
      {/* Sub Tabs */}
      <div className="flex border-b border-gray-200 bg-white p-1 rounded-xl shadow-xs">
        <button
          onClick={() => { setCurrentTab('library'); setSearch(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            currentTab === 'library' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Library size={16} />
          <span>{trans("المكتبة المدرسية واستعارة الكتب", "School Library & Book Loans")}</span>
        </button>
        <button
          onClick={() => { setCurrentTab('transport'); setSearch(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            currentTab === 'transport' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Bus size={16} />
          <span>{trans("الحافلات والنقل المدرسي المباشر", "School Buses & Live Routes")}</span>
        </button>
      </div>

      {/* Control Ribbon */}
      {currentTab === 'library' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${lang === 'ar' ? 'right-3' : 'left-3'}`} size={16} />
            <input 
              type="text" 
              placeholder={trans("البحث عن الكتب بالاسم، المؤلف أو التصنيف...", "Search library books by title, author, category...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full bg-gray-50 border border-gray-250 rounded-lg py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white ${
                lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'
              }`}
            />
          </div>
        </div>
      )}

      {/* Main View Display */}
      {currentTab === 'library' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="library-layout-grid">
          {/* Books catalog (Col 1-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2">{trans("دليل وفهرس الكتب المتوفرة بالمكتبة", "Library Books Catalog & Index")}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBooks.map((book) => (
                <div key={book.id} className="bg-white border border-gray-150 rounded-xl p-4 flex gap-4 hover:border-blue-500/30 transition-all shadow-xs">
                  <div className="w-16 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 text-2xl shrink-0">
                    📚
                  </div>
                  <div className="flex flex-col justify-between overflow-hidden">
                    <div>
                      <span className="text-[9px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded truncate inline-block">
                        {transData(book.category, lang)}
                      </span>
                      <h4 className="font-bold text-xs text-gray-950 mt-1.5 truncate">{transData(book.title, lang)}</h4>
                      <p className="text-[10px] text-gray-400 font-medium truncate">{trans("المؤلف:", "Author:")} {transData(book.author, lang)}</p>
                    </div>

                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="text-gray-400 font-bold">ISBN: <span className="font-mono text-[9px] text-gray-500">{book.isbn}</span></span>
                      <span className={`font-black ${book.available > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {book.available} / {book.quantity} {trans("متوفر", "available")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Borrow logs (Col 3) */}
          <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-xs text-gray-950">{trans("سجل استعارة الكتب النشطة", "Active Student Book Loans")}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">{trans("إدارة المرتجعات وتواريخ الاسترجاع للكتب المسموحة", "Review and record returned books and overdue loans")}</p>
            </div>

            <div className="space-y-4 divide-y divide-gray-100">
              {loans.map((loan) => {
                const book = books.find(b => b.id === loan.bookId);
                const isOverdue = new Date(loan.dueDate) < new Date() && loan.status === 'مستعار';
                return (
                  <div key={loan.id} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 leading-snug">{book ? transData(book.title, lang) : trans('كتاب مجهول', 'Unknown Book')}</h4>
                        <p className="text-[10px] text-blue-600 font-bold mt-1">{trans("المستعير:", "Borrower:")} {transData(getStudentName(loan.studentId), lang)}</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        loan.status === 'تم الإرجاع' ? 'bg-green-50 text-green-700' :
                        isOverdue ? 'bg-red-50 text-red-700 animate-pulse' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {loan.status === 'تم الإرجاع' ? trans('تم الإرجاع', 'Returned') : isOverdue ? trans('متأخر جداً', 'Overdue') : trans('مستعار', 'Borrowed')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                      <span>{trans("موعد الإرجاع:", "Due date:")} {loan.dueDate}</span>
                      {loan.status === 'مستعار' && (
                        <button 
                          onClick={() => handleReturnBook(loan.id, loan.bookId)}
                          className="bg-gray-100 hover:bg-green-50 hover:text-green-600 px-2 py-1 rounded text-[9px] font-bold text-gray-700 cursor-pointer transition-colors"
                        >
                          {trans("تسجيل الإرجاع", "Mark Returned")}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {currentTab === 'transport' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-gray-900">{trans("متابعة المسارات الحية للحافلات", "Live School Bus Logistics")}</h3>
            <p className="text-xs text-gray-500">{trans("محاكاة آنية لمسار رحلة الذهاب والإياب، بيانات السائق، المشرف وحالة الطلاب", "Realtime simulation of bus routes, passenger counts, driver details, and stop schedules")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {routes.map((route) => (
              <div key={route.id} className="bg-white border border-gray-150 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-500/30 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded font-black flex items-center gap-1">
                      <Bus size={12} />
                      <span>{transData(route.busNumber, lang)}</span>
                    </span>
                    <span className="text-xs text-gray-400 font-bold">{trans("الطلاب المسجلون:", "Active Passengers:")} {route.studentsCount} {trans("طالباً", "students")}</span>
                  </div>

                  <h4 className="font-bold text-sm text-gray-950 mb-1">{transData(route.routeName, lang)}</h4>
                  
                  {/* Driver and Supervisor information */}
                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs mt-3">
                    <div>
                      <span className="text-gray-400 block text-[10px]">{trans("اسم السائق", "Bus Driver Name")}</span>
                      <span className="font-bold text-gray-700 block mt-0.5">{transData(route.driverName, lang)}</span>
                      <span className="text-[9px] text-gray-400 font-mono block">{route.driverPhone}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">{trans("المشرف المصاحب", "Route Attendant")}</span>
                      <span className="font-bold text-gray-700 block mt-0.5">{transData((route as any).supervisorName || trans("أ. صالح الحربي", "Mr. Saleh Al-Harbi"), lang)}</span>
                    </div>
                  </div>

                  {/* Stations Stepper visualizer */}
                  <div className="mt-5 space-y-3">
                    <span className="text-[10px] text-gray-400 font-black block uppercase tracking-wider">{trans("محطات المسار المتبعة للرحلة:", "Bus Route Stops Timeline:")}</span>
                    <div className="relative flex items-center justify-between pl-2">
                      <div className="absolute left-2.5 right-2.5 top-2.5 h-0.5 bg-gray-200 -z-10"></div>
                      {route.stations.map((stop, i) => {
                        const isPastOrCurrent = i <= (route.activeLocationIndex || 0);
                        const isCurrent = i === route.activeLocationIndex;
                        return (
                          <div key={i} className="flex flex-col items-center text-center relative z-10">
                            <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-all ${
                              isCurrent ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 scale-110' :
                              isPastOrCurrent ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                              {i + 1}
                            </div>
                            <span className="text-[8px] font-bold text-gray-500 mt-1.5 max-w-[65px] leading-tight truncate">{transData(stop, lang)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Simulated active bus label */}
                <div className="border-t border-gray-100 pt-3.5 mt-5 flex items-center justify-between text-xs text-blue-600 font-bold">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                    <span>{trans("الموقع الحالي:", "Active Stop:")} {transData(route.stations[route.activeLocationIndex || 0], lang)}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold">{trans("مسار نشط للرحلة اليومية", "Active bus journey")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

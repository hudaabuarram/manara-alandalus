import React, { useState, useEffect } from 'react';
import { 
  Library, Bus, Search, Plus, MapPin, Phone, CheckCircle, 
  BookOpen, Clock, AlertCircle, Play, Bookmark, Map
} from 'lucide-react';
import { LibraryBook, BookLoan, TransportRoute, Student } from '../types';

interface LibraryTransportViewProps {
  books: LibraryBook[];
  setBooks: React.Dispatch<React.SetStateAction<LibraryBook[]>>;
  loans: BookLoan[];
  setLoans: React.Dispatch<React.SetStateAction<BookLoan[]>>;
  routes: TransportRoute[];
  setRoutes: React.Dispatch<React.SetStateAction<TransportRoute[]>>;
  students: Student[];
  activeSubTab?: 'library' | 'transport';
}

export default function LibraryTransportView({
  books,
  setBooks,
  loans,
  setLoans,
  routes,
  setRoutes,
  students,
  activeSubTab = 'library'
}: LibraryTransportViewProps) {
  const [currentTab, setCurrentTab] = useState<'library' | 'transport'>(activeSubTab);
  const [search, setSearch] = useState('');
  
  // Library filter
  const filteredBooks = books.filter(b => b.title.includes(search) || b.author.includes(search) || b.category.includes(search));

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
    
    alert("تم تسجيل إرجاع الكتاب وإعادة النسخة للرف بنجاح!");
  };

  const getStudentName = (id: string) => {
    return students.find(s => s.id === id)?.name || 'طالب مدرسة الأندلس';
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" id="library-transport-container">
      
      {/* Sub Tabs */}
      <div className="flex border-b border-gray-200 bg-white p-1 rounded-xl shadow-xs">
        <button
          onClick={() => { setCurrentTab('library'); setSearch(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-lg transition-all ${
            currentTab === 'library' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Library size={16} />
          <span>المكتبة المدرسية واستعارة الكتب</span>
        </button>
        <button
          onClick={() => { setCurrentTab('transport'); setSearch(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-lg transition-all ${
            currentTab === 'transport' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Bus size={16} />
          <span>حافلات النقل المدرسي والتتبع الحي</span>
        </button>
      </div>

      {/* VIEW 1: LIBRARY CATALOG */}
      {currentTab === 'library' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Books catalog grid (left columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-sm">فهرس المصادر والكتب بالمكتبة</h3>
              <div className="relative w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text" 
                  placeholder="ابحث بالعنوان، الكاتب أو القسم..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-gray-250 rounded-lg pr-9 pl-3 py-1 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredBooks.map((book) => (
                <div key={book.id} className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">{book.category}</span>
                      <span className="text-[10px] text-gray-400 font-bold font-mono">ISBN: {book.isbn}</span>
                    </div>
                    <h4 className="font-bold text-xs text-gray-900">{book.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-1">الكاتب: {book.author}</p>
                    <p className="text-[9px] text-gray-400 font-medium mt-1">الموقع: {book.location}</p>
                  </div>

                  <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between text-[10px] font-bold">
                    <span className={book.available > 0 ? 'text-green-600' : 'text-rose-600'}>
                      المتوفر: {book.available} من {book.quantity} نسخ
                    </span>
                    <span className="text-gray-400">الجناح العام</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Loans list (right column) */}
          <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs lg:col-span-1 space-y-4">
            <h4 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Bookmark size={15} className="text-blue-600" />
              <span>الاستعارات والكتب المعارة حالياً</span>
            </h4>

            <div className="space-y-4 max-h-[450px] overflow-y-auto">
              {loans.map((ln) => {
                const bookTitle = books.find(b => b.id === ln.bookId)?.title || 'كتاب مدرسي';
                const borrower = getStudentName(ln.studentId);
                return (
                  <div key={ln.id} className="border border-gray-100 p-3 rounded-lg bg-gray-50/50 flex flex-col justify-between space-y-2">
                    <div>
                      <h5 className="font-bold text-xs text-gray-900 leading-snug">{bookTitle}</h5>
                      <span className="text-[10px] text-gray-500 block mt-1">المستعير: {borrower}</span>
                      <span className="text-[9px] text-gray-400 block">موعد الإرجاع: {ln.dueDate}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        ln.status === 'مستعار' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-700'
                      }`}>
                        {ln.status}
                      </span>

                      {ln.status === 'مستعار' && (
                        <button 
                          onClick={() => handleReturnBook(ln.id, ln.bookId)}
                          className="bg-blue-600 text-white px-2 py-1 rounded text-[9px] font-bold hover:bg-blue-700"
                        >
                          تأكيد الإرجاع
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

      {/* VIEW 2: TRANSPORT Live PROGRESS */}
      {currentTab === 'transport' && (
        <div className="space-y-6">
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-xs text-blue-950 flex items-center gap-2">
                <Map size={16} className="text-blue-600" />
                <span>محاكاة خطوط سير الحافلات والتعقب المباشر</span>
              </h3>
              <p className="text-[10px] text-blue-700 mt-1">يتحرك السائقون تلقائياً على خريطة المحطات الافتراضية باتجاه مبنى المدرسة (تحديث كل ٦ ثوانٍ)</p>
            </div>
            <span className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded-full font-bold animate-pulse">تحديث حي نشط</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {routes.map((route) => (
              <div key={route.id} className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs space-y-6">
                
                {/* Driver information */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">{route.busNumber}</span>
                    <h4 className="font-bold text-xs text-gray-900 mt-1.5">{route.routeName}</h4>
                    <span className="text-[10px] text-gray-500 block mt-1">السائق: {route.driverName} | جوال: {route.driverPhone}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-extrabold text-blue-600 block">{route.studentsCount}</span>
                    <span className="text-[9px] text-gray-400 font-bold block">طلاب مسجلون بالخط</span>
                  </div>
                </div>

                {/* Live Stations Progress Map */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-500 block">مسار المحطات والاقتراب الفعلي:</span>
                  
                  <div className="relative pt-6 pb-2" id="live-progress-station-map">
                    {/* Background track line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                    
                    {/* Active filled line up to current approach */}
                    <div 
                      className="absolute top-1/2 right-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full transition-all duration-1000"
                      style={{ 
                        left: `${100 - ( (route.activeLocationIndex || 0) / (route.stations.length - 1) ) * 100}%` 
                      }}
                    />

                    {/* Interactive stations pins layout */}
                    <div className="flex justify-between relative">
                      {route.stations.map((st, sIdx) => {
                        const isCurrent = route.activeLocationIndex === sIdx;
                        const isPassed = (route.activeLocationIndex || 0) > sIdx;

                        return (
                          <div key={sIdx} className="flex flex-col items-center relative group w-12">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${
                              isCurrent ? 'bg-blue-600 border-white scale-125 ring-2 ring-blue-400' :
                              isPassed ? 'bg-emerald-600 border-white' : 'bg-white border-gray-300'
                            }`} />
                            
                            {/* Station label tooltip */}
                            <span className={`text-[8px] font-bold mt-2 text-center leading-tight whitespace-normal ${
                              isCurrent ? 'text-blue-600 font-extrabold scale-105' : 'text-gray-400'
                            }`}>
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

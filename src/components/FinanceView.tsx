import React, { useState } from 'react';
import { CreditCard, DollarSign, Printer, CheckCircle, Clock, X, Search, Plus, Filter } from 'lucide-react';
import { Invoice, Student } from '../types';
import { initialSettings } from '../data/mockData';

interface FinanceViewProps {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  students: Student[];
}

export default function FinanceView({
  invoices,
  setInvoices,
  students
}: FinanceViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Payment Simulator
  const [showPayModal, setShowPayModal] = useState(false);
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(5000);
  const [payMethod, setPayMethod] = useState<'نقدي' | 'شبكة' | 'تحويل بنكي'>('شبكة');

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    const student = students.find(s => s.id === inv.studentId);
    const matchesSearch = student?.name.includes(searchTerm) || inv.title.includes(searchTerm);
    const matchesStatus = statusFilter === '' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate finance metrics
  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalOutstanding = totalInvoiced - totalPaid;

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payInvoice) return;

    const receiptId = `REC-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPayment = {
      date: new Date().toISOString().split('T')[0],
      amount: Number(payAmount),
      receiptId,
      method: payMethod
    };

    const updatedInvoices = invoices.map(inv => {
      if (inv.id === payInvoice.id) {
        const newPaid = inv.paidAmount + Number(payAmount);
        let status: 'مدفوع' | 'مدفوع جزئياً' | 'غير مدفوع' = 'مدفوع جزئياً';
        if (newPaid >= inv.amount) status = 'مدفوع';
        else if (newPaid <= 0) status = 'غير مدفوع';

        return {
          ...inv,
          paidAmount: newPaid,
          status,
          payments: [newPayment, ...inv.payments]
        };
      }
      return inv;
    });

    setInvoices(updatedInvoices);
    setShowPayModal(false);
    
    // Find the newly updated invoice to show as selected (which acts as receipt display)
    const updatedInv = updatedInvoices.find(inv => inv.id === payInvoice.id);
    if (updatedInv) setSelectedInvoice(updatedInv);
    
    alert(`تم رصد وتسجيل عملية الدفع بنجاح! رقم السند: ${receiptId}`);
  };

  const getStudentName = (id: string) => {
    return students.find(s => s.id === id)?.name || 'طالب مجهول';
  };

  const getStudentAcademicId = (id: string) => {
    return students.find(s => s.id === id)?.academicId || '----';
  };

  const printReceipt = (receiptId: string) => {
    const printContent = document.getElementById("receipt-print-area")?.innerHTML;
    const popupWin = window.open('', '_blank', 'width=600,height=500');
    popupWin?.document.open();
    popupWin?.document.write(`
      <html>
        <head>
          <title>سند قبض مالي رقم ${receiptId}</title>
          <style>
            body { font-family: 'Cairo', sans-serif; direction: rtl; padding: 30px; text-align: right; }
            .receipt-box { border: 2px dashed #9CA3AF; padding: 20px; border-radius: 8px; }
            .header { text-align: center; border-bottom: 2px solid #2563EB; padding-bottom: 10px; margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
            .bold { font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6B7280; }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            ${printContent}
          </div>
        </body>
      </html>
    `);
    popupWin?.document.close();
    popupWin?.print();
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" id="finance-view-container">
      
      {/* Finance Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="finance-widgets">
        
        <div className="bg-gradient-to-l from-blue-50 to-blue-50/50 p-5 rounded-xl border border-blue-150 flex items-center justify-between">
          <div>
            <span className="text-gray-500 text-[10px] font-bold block mb-1">المطالبات المفروضة كلياً</span>
            <span className="text-xl font-bold text-gray-900 block font-mono">{totalInvoiced.toLocaleString()} ريال</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="bg-gradient-to-l from-green-50 to-green-50/50 p-5 rounded-xl border border-green-150 flex items-center justify-between">
          <div>
            <span className="text-gray-500 text-[10px] font-bold block mb-1">المبالغ المحصلة والمسددة</span>
            <span className="text-xl font-bold text-green-700 block font-mono">{totalPaid.toLocaleString()} ريال</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="bg-gradient-to-l from-rose-50 to-rose-50/50 p-5 rounded-xl border border-rose-150 flex items-center justify-between">
          <div>
            <span className="text-gray-500 text-[10px] font-bold block mb-1">الذمم والرسوم المعلقة</span>
            <span className="text-xl font-bold text-rose-700 block font-mono">{totalOutstanding.toLocaleString()} ريال</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

      </div>

      {/* Control filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        
        <div className="relative flex-1 w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="ابحث باسم الطالب أو عنوان الفاتورة المالية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-250 rounded-lg pr-10 pl-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={14} className="text-gray-400" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none w-full sm:w-44"
          >
            <option value="">كل حالات السداد</option>
            <option value="مدفوع">مدفوع بالكامل</option>
            <option value="مدفوع جزئياً">مدفوع جزئياً</option>
            <option value="غير مدفوع">غير مدفوع</option>
          </select>
        </div>

      </div>

      {/* Invoices List table */}
      <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden" id="finance-invoices-list">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3.5">الرقم المالي</th>
                <th className="px-4 py-3.5">اسم الطالب</th>
                <th className="px-4 py-3.5">المطالبة المالية</th>
                <th className="px-4 py-3.5 text-center">المبلغ الكلي</th>
                <th className="px-4 py-3.5 text-center">المسدد</th>
                <th className="px-4 py-3.5 text-center">المتبقي</th>
                <th className="px-4 py-3.5 text-center">تاريخ الاستحقاق</th>
                <th className="px-4 py-3.5 text-center">العملية / السداد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredInvoices.map((inv) => {
                const outstanding = inv.amount - inv.paidAmount;
                return (
                  <tr key={inv.id} className="hover:bg-gray-50/20">
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-gray-900">{inv.id}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-gray-900 block">{getStudentName(inv.studentId)}</span>
                      <span className="text-[10px] text-gray-400 font-bold">أكاديمي: {getStudentAcademicId(inv.studentId)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-medium text-gray-700">{inv.title}</td>
                    <td className="px-4 py-3.5 text-center font-bold text-gray-900 font-mono">{inv.amount.toLocaleString()} ر.س</td>
                    <td className="px-4 py-3.5 text-center font-bold text-green-600 font-mono">{inv.paidAmount.toLocaleString()} ر.س</td>
                    <td className="px-4 py-3.5 text-center font-bold text-rose-600 font-mono">{outstanding.toLocaleString()} ر.س</td>
                    <td className="px-4 py-3.5 text-center text-xs text-gray-500 font-medium font-mono">{inv.dueDate}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        {outstanding > 0 ? (
                          <button 
                            onClick={() => {
                              setPayInvoice(inv);
                              setPayAmount(outstanding);
                              setShowPayModal(true);
                            }}
                            className="bg-blue-600 text-white px-2.5 py-1.5 rounded text-[10px] font-bold hover:bg-blue-700 transition-colors flex items-center gap-1"
                          >
                            <CreditCard size={11} />
                            <span>تسجيل دفع</span>
                          </button>
                        ) : (
                          <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded font-bold">
                            مسددة بالكامل
                          </span>
                        )}
                        
                        {inv.payments.length > 0 && (
                          <button 
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
                            title="عرض آخر سند قبض"
                          >
                            <Printer size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Preview overlay modal */}
      {selectedInvoice && selectedInvoice.payments.length > 0 && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">سند القبض المالي المعتمد</h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            
            {/* Printable Receipt Body */}
            <div className="p-6 flex-1 space-y-6 text-xs text-gray-800" id="receipt-print-area">
              <div className="text-center pb-4 border-b border-gray-150">
                <span className="text-3xl">🏫</span>
                <h4 className="font-bold text-sm text-gray-900 mt-2">{initialSettings.schoolName}</h4>
                <p className="text-[9px] text-gray-400 font-bold mt-1">الرياض، المملكة العربية السعودية | {initialSettings.phone}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between font-bold">
                  <span>سند قبض مالي رقم:</span>
                  <span className="font-mono text-blue-600">{selectedInvoice.payments[0].receiptId}</span>
                </div>
                <div className="flex justify-between">
                  <span>تاريخ المعاملة:</span>
                  <span className="font-mono">{selectedInvoice.payments[0].date}</span>
                </div>
                <div className="flex justify-between">
                  <span>اسم الطالب:</span>
                  <span className="font-bold">{getStudentName(selectedInvoice.studentId)}</span>
                </div>
                <div className="flex justify-between">
                  <span>رقم السجل الأكاديمي:</span>
                  <span className="font-mono">{getStudentAcademicId(selectedInvoice.studentId)}</span>
                </div>
                <div className="flex justify-between">
                  <span>الرسوم المطالب بها:</span>
                  <span>{selectedInvoice.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>طريقة الدفع:</span>
                  <span className="font-bold text-indigo-600">عبر {selectedInvoice.payments[0].method}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-sm font-extrabold text-green-700">
                  <span>المبلغ المقبوض:</span>
                  <span className="font-mono">{selectedInvoice.payments[0].amount.toLocaleString()} ريال سعودي</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>المتبقي غير المسدد للفاتورة:</span>
                  <span className="font-mono font-bold">{(selectedInvoice.amount - selectedInvoice.paidAmount).toLocaleString()} ريال</span>
                </div>
              </div>

              <div className="text-center pt-6 border-t border-dashed border-gray-200">
                <p className="text-[9px] text-gray-400 font-bold">يعتبر هذا السند إيصالاً إلكترونياً معتمداً من إدارة الحسابات المدرسية.</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={() => printReceipt(selectedInvoice.payments[0].receiptId)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-2"
              >
                <Printer size={14} />
                <span>طباعة السند الورقي</span>
              </button>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Simulator Dialog */}
      {showPayModal && payInvoice && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">تسجيل عملية سداد مالي</h3>
              <button onClick={() => setShowPayModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            
            <form onSubmit={handlePaySubmit} className="p-6 space-y-4 text-xs font-bold text-gray-700">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-1">
                <span className="text-[10px] text-gray-400 block">الطالب المستفيد</span>
                <span className="text-gray-900 block font-extrabold">{getStudentName(payInvoice.studentId)}</span>
                <span className="text-[10px] text-gray-500 block font-normal">{payInvoice.title}</span>
              </div>

              <div className="space-y-1">
                <label className="block mb-1">المبلغ المراد سداده (ريال سعودي) *</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  max={payInvoice.amount - payInvoice.paidAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 font-mono text-center text-sm font-bold focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block mb-1">طريقة السداد</label>
                <select 
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white"
                >
                  <option value="شبكة">عبر الشبكة (مدى/فيزا)</option>
                  <option value="نقدي">كاش / نقدي</option>
                  <option value="تحويل بنكي">تحويل بنكي مباشر</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowPayModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold">تأكيد عملية الدفع</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

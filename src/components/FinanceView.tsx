import React, { useState } from 'react';
import { CreditCard, DollarSign, Printer, CheckCircle, Clock, X, Search, Plus, Filter } from 'lucide-react';
import { Invoice, Student } from '../types';
import { initialSettings } from '../data/mockData';
import { transData } from '../lib/translateHelper';

interface FinanceViewProps {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  students: Student[];
  lang?: 'ar' | 'en';
}

export default function FinanceView({
  invoices,
  setInvoices,
  students,
  lang = 'ar'
}: FinanceViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  // Payment Simulator
  const [showPayModal, setShowPayModal] = useState(false);
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(5000);
  const [payMethod, setPayMethod] = useState<'نقدي' | 'شبكة' | 'تحويل بنكي'>('شبكة');

  const trans = (ar: string, en: string) => lang === 'ar' ? ar : en;

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    const student = students.find(s => s.id === inv.studentId);
    const matchesSearch = student?.name.toLowerCase().includes(searchTerm.toLowerCase()) || inv.title.toLowerCase().includes(searchTerm.toLowerCase());
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
    
    alert(trans(`تم رصد وتسجيل عملية الدفع بنجاح! رقم السند: ${receiptId}`, `Payment recorded successfully! Receipt Number: ${receiptId}`));
  };

  const getStudentName = (id: string) => {
    return students.find(s => s.id === id)?.name || trans('طالب مجهول', 'Unknown Student');
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
          <title>${trans("سند قبض مالي رقم", "Payment Receipt No.")} ${receiptId}</title>
          <style>
            body { font-family: sans-serif; direction: ${lang === 'ar' ? 'rtl' : 'ltr'}; padding: 30px; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
            .receipt-box { border: 2px dashed #9CA3AF; padding: 20px; border-radius: 8px; }
            .header { text-align: center; border-bottom: 2px solid #2563EB; padding-bottom: 10px; margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
            .bold { font-weight: bold; }
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
    <div className={`space-y-6 animate-in fade-in duration-200 ${lang === 'ar' ? 'text-right' : 'text-left'}`} id="finance-view-panel">
      
      {/* Page Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">{trans("إدارة الموارد والحسابات المالية", "Tuition & School Financial Accounts")}</h2>
        <p className="text-xs text-gray-500">{trans("متابعة الأقساط الدراسية، تسجيل سندات القبض، تتبع المتبقي من الرسوم وإصدار الفواتير", "Monitor tuition installments, record payment receipts, track outstanding fees, and issue invoices")}</p>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Invoiced */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold block">{trans("الرسوم الإجمالية المفروضة", "Total Tuition Fees Invoiced")}</span>
            <h3 className="text-lg font-black text-gray-900 mt-1">{totalInvoiced.toLocaleString()} {trans("ريال", "SAR")}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Total Paid */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold block">{trans("إجمالي المبالغ المحصلة", "Total Fees Collected")}</span>
            <h3 className="text-lg font-black text-green-600 mt-1">{totalPaid.toLocaleString()} {trans("ريال", "SAR")}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold">
            <CheckCircle size={20} />
          </div>
        </div>

        {/* Total Outstanding */}
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold block">{trans("إجمالي الذمم والرسوم المتبقية", "Total Fees Outstanding")}</span>
            <h3 className="text-lg font-black text-rose-600 mt-1">{totalOutstanding.toLocaleString()} {trans("ريال", "SAR")}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* Control Ribbon */}
      <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${lang === 'ar' ? 'right-3' : 'left-3'}`} size={16} />
          <input 
            type="text" 
            placeholder={trans("البحث باسم الطالب أو عنوان الفاتورة...", "Search by student name or invoice title...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-gray-50 border border-gray-250 rounded-lg py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white ${
              lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'
            }`}
          />
        </div>

        <div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="">{trans("كل الفواتير", "All Invoices")}</option>
            <option value="مدفوع">{trans("مدفوعة بالكامل", "Paid In Full")}</option>
            <option value="مدفوع جزئياً">{trans("مدفوعة جزئياً", "Partially Paid")}</option>
            <option value="غير مدفوع">{trans("غير مدفوعة", "Unpaid")}</option>
          </select>
        </div>
      </div>

      {/* Interactive Invoices Registry List */}
      <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("الفاتورة", "Invoice")}</th>
                <th className={`px-4 py-3.5 font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{trans("الطالب / الرقم الأكاديمي", "Student / Academic ID")}</th>
                <th className="px-4 py-3.5 font-bold text-center">{trans("المبلغ الإجمالي", "Total Amount")}</th>
                <th className="px-4 py-3.5 font-bold text-center">{trans("المسدد", "Paid Amount")}</th>
                <th className="px-4 py-3.5 font-bold text-center">{trans("المتبقي", "Outstanding")}</th>
                <th className="px-4 py-3.5 font-bold text-center">{trans("حالة السداد", "Payment Status")}</th>
                <th className="px-4 py-3.5 font-bold text-center">{trans("العمليات", "Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-gray-900">
                    <div>
                      <span>{transData(inv.title, lang)}</span>
                      <span className="block text-[10px] text-gray-400 font-bold">{trans("رقم الفاتورة:", "Inv ID:")} {inv.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs">
                    <span className="font-bold text-gray-800 block">{transData(getStudentName(inv.studentId), lang)}</span>
                    <span className="text-[10px] text-gray-400 font-mono block">{getStudentAcademicId(inv.studentId)}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center text-xs font-bold text-gray-900">
                    {inv.amount.toLocaleString()} {trans("ريال", "SAR")}
                  </td>
                  <td className="px-4 py-3.5 text-center text-xs font-bold text-green-600">
                    {inv.paidAmount.toLocaleString()} {trans("ريال", "SAR")}
                  </td>
                  <td className="px-4 py-3.5 text-center text-xs font-bold text-rose-600">
                    {(inv.amount - inv.paidAmount).toLocaleString()} {trans("ريال", "SAR")}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      inv.status === 'مدفوع' ? 'bg-green-50 text-green-700' :
                      inv.status === 'مدفوع جزئياً' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {transData(inv.status, lang)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {inv.status !== 'مدفوع' && (
                        <button 
                          onClick={() => { setPayInvoice(inv); setPayAmount(inv.amount - inv.paidAmount); setShowPayModal(true); }}
                          className="text-xs bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-700 shadow-xs"
                        >
                          {trans("قبض دفعة", "Record Payment")}
                        </button>
                      )}
                      <button 
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer"
                        title={trans("عرض كشف الحساب والمدفوعات التاريخية", "Show billing history")}
                      >
                        <CreditCard size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Overlay */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-xl overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">{trans("كشف حساب مالي تفصيلي والمدفوعات", "Detailed Payment Ledger & Billing")}</h3>
              <button onClick={() => setSelectedInvoice(null)} className="p-1 rounded hover:bg-gray-200 text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 flex-1 overflow-y-auto" id="receipt-print-area">
              <div className="flex justify-between items-start">
                <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <h4 className="font-bold text-xs text-gray-500">{trans("المدرسة المصدرة", "Issuer School")}</h4>
                  <p className="font-black text-sm text-blue-600 mt-1">{transData(initialSettings.schoolName, lang)}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{transData(initialSettings.address, lang)}</p>
                </div>
                <div className={lang === 'ar' ? 'text-left' : 'text-right'}>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black">{trans("رقم الفاتورة", "Invoice ID")}: {selectedInvoice.id}</span>
                  <p className="text-xs text-gray-400 mt-1">{trans("تاريخ الاستحقاق", "Due Date")}: {selectedInvoice.dueDate}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block">{trans("الاسم الكامل للطالب", "Student Full Name")}</span>
                  <span className="font-bold text-gray-800 block mt-1">{transData(getStudentName(selectedInvoice.studentId), lang)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">{trans("الرقم الأكاديمي", "Academic ID")}</span>
                  <span className="font-bold text-gray-800 block mt-1 font-mono">{getStudentAcademicId(selectedInvoice.studentId)}</span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2 mb-3">{trans("الرسوم المفروضة", "Taxes & Tuitions Charged")}</h5>
                <div className="flex justify-between text-xs bg-gray-50 p-3 rounded">
                  <span className="font-bold text-gray-800">{transData(selectedInvoice.title, lang)}</span>
                  <span className="font-black text-gray-900">{selectedInvoice.amount.toLocaleString()} {trans("ريال", "SAR")}</span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2 mb-3">{trans("سجل الدفعات المقبوضة وسندات الدفع", "Receipts Logs & Received Instalments")}</h5>
                {selectedInvoice.payments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedInvoice.payments.map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-green-50/50 border border-green-100 p-2.5 rounded">
                        <div>
                          <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-bold">{p.receiptId}</span>
                          <span className="text-[10px] text-gray-400 font-medium pl-2 block sm:inline mt-1 sm:mt-0">{trans("التاريخ:", "Date:")} {p.date} | {trans("الطريقة:", "Method:")} {transData(p.method, lang)}</span>
                        </div>
                        <span className="font-bold text-green-700">+{p.amount.toLocaleString()} {trans("ريال", "SAR")}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">{trans("لا يوجد أي مبالغ مدفوعة أو سندات قبض صادرة لهذه الفاتورة حتى الآن.", "No payments captured for this invoice yet.")}</p>
                )}
              </div>

              {/* Outstanding metrics display */}
              <div className="border-t border-gray-150 pt-4 flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-400 block">{trans("المبلغ الإجمالي المسدد", "Paid to Date")}</span>
                  <span className="font-bold text-green-600 block text-base mt-1">{selectedInvoice.paidAmount.toLocaleString()} {trans("ريال", "SAR")}</span>
                </div>
                <div className={lang === 'ar' ? 'text-left' : 'text-right'}>
                  <span className="text-gray-400 block">{trans("المتبقي بذمة الطالب", "Remaining Balance")}</span>
                  <span className="font-black text-rose-600 block text-base mt-1">{(selectedInvoice.amount - selectedInvoice.paidAmount).toLocaleString()} {trans("ريال", "SAR")}</span>
                </div>
              </div>

              {selectedInvoice.payments.length > 0 && (
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => printReceipt(selectedInvoice.payments[0].receiptId)}
                    className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-blue-700 cursor-pointer shadow-xs"
                  >
                    <Printer size={14} />
                    <span>{trans("طباعة آخر سند قبض", "Print Latest Receipt")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pay Modal Simulator */}
      {showPayModal && payInvoice && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">{trans("رصد وقبض دفعة مالية جديدة", "Capture & Collect Tuition Payment")}</h3>
              <button onClick={() => setShowPayModal(false)} className="p-1 rounded hover:bg-gray-200 text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handlePaySubmit} className="p-6 space-y-4">
              <div className="bg-blue-50/50 p-3.5 rounded-lg border border-blue-100">
                <span className="text-xs text-gray-400">{trans("الفاتورة الهدف ومستحقات الطالب", "Tuition Item & Target Account")}</span>
                <h5 className="font-bold text-xs text-blue-950 mt-1">{transData(payInvoice.title, lang)}</h5>
                <p className="text-[10px] text-blue-600 mt-1 font-bold">{trans("المتبقي:", "Outstanding Balance:")} {(payInvoice.amount - payInvoice.paidAmount).toLocaleString()} {trans("ريال", "SAR")}</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("مبلغ الدفعة المقبوضة *", "Payment Amount *")}</label>
                <input 
                  type="number"
                  required
                  max={payInvoice.amount - payInvoice.paidAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs text-gray-900 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("طريقة الدفع", "Payment Method")}</label>
                <select 
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                >
                  <option value="شبكة">{trans("شبكة / مدى / فيزا", "POS / Credit Card")}</option>
                  <option value="تحويل بنكي">{trans("تحويل بنكي إلكتروني", "Bank Wire Transfer")}</option>
                  <option value="نقدي">{trans("دفع نقدي (كاش)", "Cash Payment")}</option>
                </select>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowPayModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer">
                  {trans("إلغاء", "Cancel")}
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold cursor-pointer">
                  {trans("تأكيد ورصد السند مالي", "Accept Payment")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

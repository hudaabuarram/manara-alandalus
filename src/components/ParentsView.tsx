import React, { useState } from 'react';
import { Search, Plus, User, Phone, Mail, Award, DollarSign, Calendar, X, Edit2, Trash2, ChevronLeft } from 'lucide-react';
import { Parent, Student, Invoice } from '../types';
import { transData } from '../lib/translateHelper';

interface ParentsViewProps {
  parents: Parent[];
  setParents: React.Dispatch<React.SetStateAction<Parent[]>>;
  students: Student[];
  invoices: Invoice[];
  lang?: 'ar' | 'en';
}

export default function ParentsView({
  parents,
  setParents,
  students,
  invoices,
  lang = 'ar'
}: ParentsViewProps) {
  const [search, setSearch] = useState('');
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  
  // Create / Edit parent modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);

  const trans = (ar: string, en: string) => lang === 'ar' ? ar : en;
  
  // Form states
  const [form, setForm] = useState<Partial<Parent>>({
    name: '', phone: '', email: '', job: '', childrenIds: []
  });

  const filteredParents = parents.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search) || p.job.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to fetch children for a parent
  const getParentChildren = (p: Parent) => {
    return students.filter(st => p.childrenIds.includes(st.id));
  };

  // Helper to calculate outstanding invoices for a parent's children
  const getParentFinancialSummary = (p: Parent) => {
    const kidsIds = p.childrenIds;
    const parentInvs = invoices.filter(inv => kidsIds.includes(inv.studentId));
    
    const total = parentInvs.reduce((acc, inv) => acc + inv.amount, 0);
    const paid = parentInvs.reduce((acc, inv) => acc + inv.paidAmount, 0);
    const remaining = total - paid;

    return { total, paid, remaining, invoicesCount: parentInvs.length };
  };

  const handleOpenAdd = () => {
    setEditingParent(null);
    setForm({ name: '', phone: '', email: '', job: '', childrenIds: [] });
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: Parent) => {
    setEditingParent(p);
    setForm({ ...p });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    if (editingParent) {
      // Edit
      const updated = parents.map(p => p.id === editingParent.id ? { ...p, ...form } as Parent : p);
      setParents(updated);
      alert(trans("تم تحديث بيانات ولي الأمر بنجاح!", "Guardian details updated successfully!"));
    } else {
      // Create
      const newP: Parent = {
        id: `p${Date.now()}`,
        name: form.name,
        phone: form.phone,
        email: form.email || 'parent@school.edu',
        job: form.job || trans('موظف', 'Employee'),
        childrenIds: form.childrenIds || [],
        address: form.address || '',
        relation: form.relation || trans('أب', 'Father')
      };
      setParents([newP, ...parents]);
      alert(trans("تم تسجيل ولي الأمر الجديد بنجاح!", "New guardian registered successfully!"));
    }
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(trans("هل تريد إزالة هذا الملف لولي الأمر بالكامل؟", "Do you want to delete this guardian completely?"))) {
      setParents(parents.filter(p => p.id !== id));
      if (selectedParent?.id === id) setSelectedParent(null);
    }
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-200 ${lang === 'ar' ? 'text-right' : 'text-left'}`} id="parents-view-wrapper">
      
      {/* Header */}
      {!selectedParent ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{trans("سجل وملفات أولياء الأمور والمرافقين", "Guardians & Parents Directory")}</h2>
            <p className="text-xs text-gray-500">{trans("إدارة بيانات تواصل الأباء والأمهات، ربط الأبناء، تتبع الذمم والمستحقات والنشاط", "Manage parent phone books, link children, track outstanding balances, and check general engagement")}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <button 
              onClick={handleOpenAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              <Plus size={15} />
              <span>{trans("إضافة ولي أمر جديد", "Add New Guardian")}</span>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setSelectedParent(null)}
          className="text-xs text-gray-500 hover:text-blue-600 font-bold flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>{trans("العودة إلى سجل أولياء الأمور", "Back to Guardians Directory")}</span>
        </button>
      )}

      {/* Main View Grid */}
      {!selectedParent ? (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${lang === 'ar' ? 'right-3' : 'left-3'}`} size={16} />
              <input 
                type="text" 
                placeholder={trans("البحث باسم ولي الأمر، الجوال، أو المهنة...", "Search by guardian name, phone, or occupation...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full bg-gray-50 border border-gray-250 rounded-lg py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white ${
                  lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
              />
            </div>
          </div>

          {/* Parents grid list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParents.map((p) => {
              const children = getParentChildren(p);
              const fin = getParentFinancialSummary(p);
              return (
                <div key={p.id} className="bg-white border border-gray-150 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-500/30 transition-all relative">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center font-bold text-sm">
                        👤
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleOpenEdit(p)}
                          className="p-1 rounded text-amber-600 hover:bg-amber-50 cursor-pointer"
                          title={trans("تعديل بيانات ولي الأمر", "Edit Guardian")}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                          title={trans("حذف ولي الأمر", "Delete Guardian")}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-gray-950 mb-1">{transData(p.name, lang)}</h4>
                    <p className="text-[10px] text-gray-400 font-medium block">{transData(p.job, lang)}</p>

                    <div className="space-y-1.5 text-xs text-gray-600 mt-4">
                      <div className="flex items-center gap-2 font-mono">
                        <Phone size={13} className="text-gray-400" />
                        <span>{p.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <Mail size={13} className="text-gray-400" />
                        <span className="truncate">{p.email}</span>
                      </div>
                    </div>

                    {/* Associated Kids list snippet */}
                    <div className="mt-4 border-t border-gray-100 pt-3">
                      <span className="text-[10px] text-gray-400 font-black block mb-2">{trans("الأبناء والطلاب المرتبطين:", "Linked Children / Students:")}</span>
                      {children.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {children.map(kid => (
                            <span key={kid.id} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                              {transData(kid.name, lang)} ({transData(kid.grade, lang)})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">{trans("لم يتم ربط أبناء بعد", "No children linked yet")}</span>
                      )}
                    </div>
                  </div>

                  {/* Finance status snippet */}
                  <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-400 block text-[9px]">{trans("المستحقات المتبقية", "Outstanding Tuition:")}</span>
                      <span className={`font-black ${fin.remaining > 0 ? 'text-rose-600' : 'text-green-600'}`}>
                        {fin.remaining.toLocaleString()} {trans("ريال", "SAR")}
                      </span>
                    </div>

                    <button 
                      onClick={() => setSelectedParent(p)}
                      className="bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      {trans("عرض التفاصيل والملف", "Show Details")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Detailed Parent Profile File */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          
          {/* Side stats card */}
          <div className="bg-white border border-gray-150 rounded-xl p-6 shadow-xs space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-3">
                👤
              </div>
              <h3 className="font-bold text-base text-gray-950">{transData(selectedParent.name, lang)}</h3>
              <p className="text-xs text-gray-400 font-bold mt-0.5">{transData(selectedParent.job, lang)}</p>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3 text-xs text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">{trans("رقم الجوال:", "Phone Number:")}</span>
                <span className="font-mono text-gray-800 font-bold">{selectedParent.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">{trans("البريد الإلكتروني:", "Email Address:")}</span>
                <span className="font-mono text-gray-800 font-bold truncate max-w-[180px]">{selectedParent.email}</span>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center">
              <span className="text-[10px] text-rose-500 font-bold block">{trans("المديونية الإجمالية المسجلة على الأبناء", "Total Unpaid Tuition Balance:")}</span>
              <h4 className="text-lg font-black text-rose-700 mt-1">
                {getParentFinancialSummary(selectedParent).remaining.toLocaleString()} {trans("ريال", "SAR")}
              </h4>
            </div>
          </div>

          {/* Children and logs details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-150 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-xs text-gray-900 border-b border-gray-100 pb-2">{trans("بطاقات الأبناء المقيدين بالمدرسة وحالتهم الأكاديمية", "Registered Children & Academic Transcripts")}</h3>
              
              <div className="space-y-4">
                {getParentChildren(selectedParent).map(kid => {
                  const kidAny = kid as any;
                  return (
                    <div key={kid.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-xs text-gray-900">{transData(kid.name, lang)}</h4>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{transData(kid.grade, lang)} - {transData(kid.division, lang)} | {trans("رقم أكاديمي:", "Academic ID:")} {kid.academicId}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-center bg-white px-3 py-1.5 rounded border border-gray-100">
                          <span className="text-gray-400 block text-[9px] font-bold">{trans("الغياب اليومي", "Absence count:")}</span>
                          <span className="font-bold text-red-500 mt-0.5 block">{kidAny.absenceCount || 0} {trans("أيام", "days")}</span>
                        </div>
                        <div className="text-center bg-white px-3 py-1.5 rounded border border-gray-100">
                          <span className="text-gray-400 block text-[9px] font-bold">{trans("المعدل الدراسي", "GPA Rate:")}</span>
                          <span className="font-bold text-blue-600 mt-0.5 block">{kidAny.gpa || 95}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Add / Edit modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">
                {editingParent ? trans("تعديل بيانات ملف ولي الأمر", "Edit Guardian Info") : trans("تسجيل ولي أمر جديد للطلاب", "Register New Parent")}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded hover:bg-gray-200 text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("الاسم الكامل لولي الأمر *", "Guardian Full Name *")}</label>
                <input 
                  type="text" required
                  placeholder="e.g. عبدالرحمن السديري"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("رقم الجوال النشط للتواصل *", "Active Phone Number *")}</label>
                <input 
                  type="text" required
                  placeholder="e.g. 050XXXXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("البريد الإلكتروني", "Email Address")}</label>
                <input 
                  type="email"
                  placeholder="e.g. parent@school.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("المهنة / جهة العمل", "Occupation")}</label>
                <input 
                  type="text"
                  placeholder="e.g. مهندس"
                  value={form.job}
                  onChange={(e) => setForm({ ...form, job: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer">
                  {trans("إلغاء", "Cancel")}
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer">
                  {trans("حفظ وتأكيد البيانات", "Confirm & Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

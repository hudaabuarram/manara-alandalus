import React, { useState } from 'react';
import { Search, Plus, User, Phone, Mail, Award, DollarSign, Calendar, X, Edit2, Trash2 } from 'lucide-react';
import { Parent, Student, Invoice } from '../types';

interface ParentsViewProps {
  parents: Parent[];
  setParents: React.Dispatch<React.SetStateAction<Parent[]>>;
  students: Student[];
  invoices: Invoice[];
}

export default function ParentsView({
  parents,
  setParents,
  students,
  invoices
}: ParentsViewProps) {
  const [search, setSearch] = useState('');
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  
  // Create / Edit parent modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  
  // Form states
  const [form, setForm] = useState<Partial<Parent>>({
    name: '', phone: '', email: '', job: '', childrenIds: []
  });

  const filteredParents = parents.filter(p => 
    p.name.includes(search) || p.phone.includes(search) || p.job.includes(search)
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    if (editingParent) {
      // Edit
      const updated = parents.map(p => {
        if (p.id === editingParent.id) {
          return {
            ...p,
            name: form.name!,
            phone: form.phone!,
            email: form.email || '',
            job: form.job || '',
            childrenIds: form.childrenIds || []
          };
        }
        return p;
      });
      setParents(updated);
      setSelectedParent(null);
    } else {
      // Add
      const p: Parent = {
        id: `p${Date.now()}`,
        name: form.name!,
        phone: form.phone!,
        email: form.email || '',
        job: form.job || '',
        address: '',
        childrenIds: form.childrenIds || [],
        relation: 'أب'
      };
      setParents([p, ...parents]);
    }

    setShowAddModal(false);
    setEditingParent(null);
    setForm({ name: '', phone: '', email: '', job: '', childrenIds: [] });
    alert("تم حفظ ملف ولي الأمر بنجاح!");
  };

  const handleDeleteParent = (id: string) => {
    if (confirm("هل تريد حذف ملف ولي الأمر هذا نهائياً من سجلات المدرسة؟")) {
      setParents(parents.filter(p => p.id !== id));
      if (selectedParent?.id === id) setSelectedParent(null);
    }
  };

  const handleOpenAdd = () => {
    setForm({ name: '', phone: '', email: '', job: '', childrenIds: [students[0]?.id || ''] });
    setEditingParent(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: Parent) => {
    setForm({ ...p });
    setEditingParent(p);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" id="parents-view-container">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900 font-sans">سجلات وبوابة أولياء الأمور</h2>
          <p className="text-xs text-gray-500">إدارة معلومات الاتصال لأولياء الأمور ومتابعة المستحقات المالية والتربوية لأسرة الطالب</p>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span>إضافة ولي أمر جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Parents roster list (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="ابحث باسم ولي الأمر، رقم الجوال، أو المهنة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-150 rounded-xl pr-10 pl-4 py-2 text-xs focus:outline-none"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
            <table className="w-full text-sm text-right text-gray-500">
              <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3.5">الاسم</th>
                  <th className="px-4 py-3.5">رقم الاتصال</th>
                  <th className="px-4 py-3.5">المهنة</th>
                  <th className="px-4 py-3.5 text-center">عدد الأبناء بالمدارس</th>
                  <th className="px-4 py-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredParents.map((p) => {
                  const kidsCount = p.childrenIds.length;
                  return (
                    <tr 
                      key={p.id} 
                      className={`hover:bg-gray-50/20 cursor-pointer transition-colors ${
                        selectedParent?.id === p.id ? 'bg-blue-50/20' : ''
                      }`}
                      onClick={() => setSelectedParent(p)}
                    >
                      <td className="px-4 py-3.5 font-bold text-gray-900">{p.name}</td>
                      <td className="px-4 py-3.5 font-mono text-xs">{p.phone}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-600">{p.job || '---'}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-blue-600">{kidsCount} أبناء</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => handleOpenEdit(p)}
                            className="p-1 rounded text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeleteParent(p.id)}
                            className="p-1 rounded text-gray-500 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected parent detail card dossier (1 column) */}
        <div className="lg:col-span-1">
          {selectedParent ? (
            <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-xs space-y-6">
              
              <div className="border-b border-gray-100 pb-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-3">
                  {selectedParent.name.charAt(0)}
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">{selectedParent.name}</h3>
                <p className="text-[11px] text-gray-500 mt-1">المهنة: {selectedParent.job || 'غير محددة'}</p>
                
                <div className="flex items-center gap-2 mt-3 font-mono text-[10px] text-gray-500">
                  <Phone size={12} className="text-gray-400" />
                  <span>{selectedParent.phone}</span>
                </div>
                {selectedParent.email && (
                  <div className="flex items-center gap-2 mt-1.5 font-mono text-[10px] text-gray-500">
                    <Mail size={12} className="text-gray-400" />
                    <span>{selectedParent.email}</span>
                  </div>
                )}
              </div>

              {/* Linked Children listing */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-gray-700 flex items-center gap-1.5">
                  <User size={13} className="text-blue-600" />
                  <span>الأبناء المنتسبون للمدرسة:</span>
                </h4>
                
                <div className="space-y-2">
                  {getParentChildren(selectedParent).map(kid => (
                    <div key={kid.id} className="p-3 border border-gray-100 rounded-lg bg-gray-50/50 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-gray-900 block">{kid.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{kid.grade}</span>
                      </div>
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">
                        رقم: {kid.academicId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial status summary */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <h4 className="font-bold text-xs text-gray-700 flex items-center gap-1.5">
                  <DollarSign size={13} className="text-emerald-600" />
                  <span>المستحقات والذمم العائلية</span>
                </h4>

                {(() => {
                  const fin = getParentFinancialSummary(selectedParent);
                  return (
                    <div className="grid grid-cols-2 gap-3 text-center text-xs">
                      <div className="bg-green-50 p-2.5 rounded-lg border border-green-100">
                        <span className="text-[9px] text-gray-500 font-bold block">المبالغ المسددة</span>
                        <span className="font-mono font-bold text-green-700 mt-0.5 block">{fin.paid.toLocaleString()} ر.س</span>
                      </div>
                      <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                        <span className="text-[9px] text-gray-500 font-bold block">المتبقي المطلوب</span>
                        <span className="font-mono font-bold text-rose-700 mt-0.5 block">{fin.remaining.toLocaleString()} ر.س</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-gray-150 shadow-xs text-center text-gray-400">
              <User size={36} className="mx-auto mb-3 text-gray-300" />
              <p className="text-xs font-bold text-gray-500">اختر ملف أحد أولياء الأمور من القائمة الجانبية لعرض بيانات عائلته وأبنائه والوضع المالي بالتفصيل.</p>
            </div>
          )}
        </div>

      </div>

      {/* CREATE / EDIT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">{editingParent ? 'تحديث ملف ولي الأمر' : 'إضافة ملف ولي أمر جديد'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs font-bold text-gray-700">
              <div className="space-y-1">
                <label className="block mb-1">اسم ولي الأمر الثلاثي *</label>
                <input 
                  type="text" 
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="أحمد بن عبدالعزيز الحميد"
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block mb-1">رقم الجوال *</label>
                  <input 
                    type="text" 
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="05xxxxxxx"
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block mb-1">المهنة / جهة العمل</label>
                  <input 
                    type="text" 
                    value={form.job}
                    onChange={(e) => setForm({ ...form, job: e.target.value })}
                    placeholder="مهندس برمجيات، معلم..."
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block mb-1">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="parent@school.com"
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block mb-1">تنسيب الأبناء (الرقم الأكاديمي للابن) *</label>
                <select 
                  multiple
                  value={form.childrenIds}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map((option: any) => option.value);
                    setForm({ ...form, childrenIds: selected });
                  }}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white h-24"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.academicId})</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 font-medium mt-1">اضغط بزر Ctrl (أو Cmd في Mac) لتحديد أكثر من ابن واحد للربط العائلي.</p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">حفظ ومطابقة الملف</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

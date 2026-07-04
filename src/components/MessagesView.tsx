import React, { useState } from 'react';
import { Mail, Send, Inbox, Plus, User, MessageSquare, AlertCircle, Trash, X } from 'lucide-react';
import { Message, UserRole } from '../types';

interface MessagesViewProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentRole: UserRole;
}

export default function MessagesView({
  messages,
  setMessages,
  currentRole
}: MessagesViewProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);

  // Compose form values
  const [newMessage, setNewMessage] = useState({
    recipientId: 'all-parents',
    recipientName: 'جميع أولياء الأمور والمعلمات',
    subject: '',
    content: ''
  });

  // Get filtered mail based on role and tab
  const getInboxMessages = () => {
    return messages.filter(msg => {
      if (activeTab === 'inbox') {
        // Letter is destined for current role or 'all-teachers'/'all-parents' if role matches
        const matchesIndividual = msg.receiverId === currentRole || msg.receiverId === 'admin';
        const matchesGroupTeachers = msg.receiverId === 'all-teachers' && (currentRole === 'teacher' || currentRole === 'admin');
        const matchesGroupParents = msg.receiverId === 'all-parents' && (currentRole === 'parent' || currentRole === 'admin');
        return matchesIndividual || matchesGroupTeachers || matchesGroupParents;
      } else {
        // Sent messages by current role
        return msg.senderRole === currentRole;
      }
    });
  };

  const activeMessages = getInboxMessages();

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.subject || !newMessage.content) return;

    // Resolve name
    let recName = 'جميع أولياء الأمور';
    if (newMessage.recipientId === 'all-teachers') recName = 'جميع المعلمين والمعلمات';
    else if (newMessage.recipientId === 'p1') recName = 'عبدالرحمن بن محمد السديري (ولي أمر)';
    else if (newMessage.recipientId === 't1') recName = 'أ. ياسر بن سليمان الحربي (رياضيات)';

    const msg: Message = {
      id: `m${Date.now()}`,
      senderId: currentRole,
      senderName: currentRole === 'admin' ? 'المدير العام' : currentRole === 'teacher' ? 'أ. هدى سليمان' : 'المشرف الأكاديمي',
      senderRole: currentRole,
      receiverId: newMessage.recipientId,
      receiverName: recName,
      subject: newMessage.subject,
      content: newMessage.content,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false
    };

    setMessages([msg, ...messages]);
    setShowCompose(false);
    
    // reset form
    setNewMessage({
      recipientId: 'all-parents',
      recipientName: 'جميع أولياء الأمور',
      subject: '',
      content: ''
    });

    alert("تم إرسال ونشر الرسالة بنجاح!");
  };

  const handleSelectMessage = (msg: Message) => {
    setSelectedMsg(msg);
    if (!msg.isRead && activeTab === 'inbox') {
      const updated = messages.map(m => m.id === msg.id ? { ...m, isRead: true } : m);
      setMessages(updated);
    }
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm("هل تريد حذف هذه الرسالة من البريد؟")) {
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMsg?.id === id) setSelectedMsg(null);
    }
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in duration-200" id="messages-view-container">
      
      {/* View Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">الرسائل البريدية والإشعارات الفورية</h2>
          <p className="text-xs text-gray-500">التراسل الداخلي بين الهيئة التعليمية، المشرفين، وأولياء الأمور للطلاب</p>
        </div>
        <button 
          onClick={() => setShowCompose(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span>إرسال رسالة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Navigation list (left columns) */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden flex flex-col h-[520px]">
          <div className="flex border-b border-gray-100 p-2 bg-gray-50/50">
            <button 
              onClick={() => { setActiveTab('inbox'); setSelectedMsg(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${activeTab === 'inbox' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-500'}`}
            >
              صندوق الوارد
            </button>
            <button 
              onClick={() => { setActiveTab('sent'); setSelectedMsg(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${activeTab === 'sent' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-500'}`}
            >
              البريد المرسل
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {activeMessages.length > 0 ? (
              activeMessages.map((msg) => (
                <div 
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                    selectedMsg?.id === msg.id ? 'bg-blue-50/40' : ''
                  }`}
                >
                  {/* Unread dot */}
                  {!msg.isRead && activeTab === 'inbox' && (
                    <div className="absolute top-4 right-3.5 w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                  <div className="pr-4">
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-1">
                      <span>{activeTab === 'inbox' ? `من: ${msg.senderName}` : `إلى: ${msg.receiverName}`}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <h4 className="font-bold text-xs text-gray-900 truncate leading-snug">{msg.subject}</h4>
                    <p className="text-[11px] text-gray-500 truncate mt-1 leading-normal">{msg.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-gray-400 font-medium text-xs">صندوق الرسائل فارغ حالياً.</div>
            )}
          </div>
        </div>

        {/* Selected Message details (right columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-150 shadow-xs p-6 h-[520px] flex flex-col justify-between">
          {selectedMsg ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug">{selectedMsg.subject}</h3>
                    <div className="text-[10px] text-gray-400 font-bold mt-2 space-y-0.5">
                      <p>المرسل: {selectedMsg.senderName} ({selectedMsg.senderRole})</p>
                      <p>المستقبل: {selectedMsg.receiverName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-400 font-mono font-bold">{selectedMsg.timestamp}</span>
                    <button 
                      onClick={() => handleDeleteMessage(selectedMsg.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      title="حذف الرسالة"
                    >
                      <Trash size={15} />
                    </button>
                  </div>
                </div>

                <div className="py-4 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedMsg.content}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 bg-gray-50 p-4 rounded-xl flex items-center gap-2.5 text-[10px] font-bold text-gray-500">
                <AlertCircle size={14} className="text-blue-500 shrink-0" />
                <span>الردود على الرسائل يتم رصدها في إشعارات ولي الأمر فورياً لسرعة التواصل.</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
              <Inbox size={40} className="text-gray-300" />
              <p className="text-xs font-bold text-gray-500">الرجاء اختيار أحد الرسائل من القائمة الجانبية لقراءة محتواها بالتفصيل.</p>
            </div>
          )}
        </div>

      </div>

      {/* Compose Draft Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">كتابة وإرسال رسالة جديدة</h3>
              <button onClick={() => setShowCompose(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            <form onSubmit={handleComposeSubmit} className="p-6 space-y-4 text-xs font-bold text-gray-700">
              <div className="space-y-1">
                <label className="block mb-1">حدد جهة الارسال *</label>
                <select 
                  value={newMessage.recipientId}
                  onChange={(e) => setNewMessage({...newMessage, recipientId: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs"
                >
                  <option value="all-parents">جميع أولياء الأمور (تعميم)</option>
                  <option value="all-teachers">جميع أعضاء هيئة التدريس (تعميم)</option>
                  <option value="p1">ولي الأمر: عبدالرحمن السديري</option>
                  <option value="t1">المعلم: أ. ياسر بن سليمان الحربي</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block mb-1">عنوان الموضوع *</label>
                <input 
                  type="text" 
                  required
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white"
                  placeholder="مثال: إشعار بخصوص اليوم المفتوح"
                />
              </div>

              <div className="space-y-1">
                <label className="block mb-1">نص الرسالة أو التعميم *</label>
                <textarea 
                  required
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg p-2 text-xs focus:bg-white h-28"
                  placeholder="السلام عليكم ورحمة الله، نحيطكم علماً..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowCompose(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1.5 hover:bg-blue-700">
                  <Send size={13} />
                  <span>إرسال الرسالة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

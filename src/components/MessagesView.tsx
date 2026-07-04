import React, { useState } from 'react';
import { Mail, Send, Inbox, Plus, User, MessageSquare, AlertCircle, Trash, X } from 'lucide-react';
import { Message, UserRole } from '../types';
import { transData } from '../lib/translateHelper';

interface MessagesViewProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentRole: UserRole;
  lang?: 'ar' | 'en';
}

export default function MessagesView({
  messages,
  setMessages,
  currentRole,
  lang = 'ar'
}: MessagesViewProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);

  const trans = (ar: string, en: string) => lang === 'ar' ? ar : en;

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
    let recName = trans('جميع أولياء الأمور', 'All Parents');
    if (newMessage.recipientId === 'all-teachers') recName = trans('جميع المعلمين والمعلمات', 'All Teachers');
    else if (newMessage.recipientId === 'p1') recName = trans('عبدالرحمن بن محمد السديري (ولي أمر)', 'Abdulrahman Al-Sudairi (Parent)');
    else if (newMessage.recipientId === 't1') recName = trans('أ. ياسر بن سليمان الحربي (رياضيات)', 'Mr. Yasser Al-Harbi (Math)');

    const msg: Message = {
      id: `m${Date.now()}`,
      senderId: currentRole,
      senderName: currentRole === 'admin' ? trans('المدير العام', 'General Director') : currentRole === 'teacher' ? trans('أ. هدى سليمان', 'Mrs. Hoda Soliman') : trans('المشرف الأكاديمي', 'Academic Supervisor'),
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
      recipientName: trans('جميع أولياء الأمور', 'All Parents'),
      subject: '',
      content: ''
    });

    alert(trans("تم إرسال ونشر الرسالة بنجاح!", "Message sent and published successfully!"));
  };

  const handleSelectMessage = (msg: Message) => {
    setSelectedMsg(msg);
    if (!msg.isRead && activeTab === 'inbox') {
      const updated = messages.map(m => m.id === msg.id ? { ...m, isRead: true } : m);
      setMessages(updated);
    }
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm(trans("هل تريد حذف هذه الرسالة من البريد؟", "Do you want to delete this message?"))) {
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMsg?.id === id) setSelectedMsg(null);
    }
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-200 ${lang === 'ar' ? 'text-right' : 'text-left'}`} id="messages-view-container">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{trans("صندوق الوارد والاتصالات والتعاميم", "Mailbox, Notices & General Circulars")}</h2>
          <p className="text-xs text-gray-500">{trans("متابعة الإشعارات والرسائل الرسمية وتواصل المعلمين مع أولياء الأمور والمدير العام", "Track administrative requests, parent communications, official board notices, and letters")}</p>
        </div>

        <button 
          onClick={() => setShowCompose(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>{trans("إنشاء رسالة جديدة", "Write New Message")}</span>
        </button>
      </div>

      {/* Inbox & Sent Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="messages-layout-grid">
        
        {/* Navigation Sidebar */}
        <div className="space-y-3">
          <div className="bg-white border border-gray-150 rounded-xl p-1 shadow-xs flex" id="inbox-sent-toggles">
            <button
              onClick={() => { setActiveTab('inbox'); setSelectedMsg(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'inbox' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Inbox size={15} />
              <span>{trans("صندوق الوارد", "Inbox")}</span>
            </button>
            <button
              onClick={() => { setActiveTab('sent'); setSelectedMsg(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'sent' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Send size={14} />
              <span>{trans("الرسائل المرسلة", "Sent Mail")}</span>
            </button>
          </div>

          {/* Mail list */}
          <div className="bg-white border border-gray-150 rounded-xl shadow-xs overflow-hidden divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
            {activeMessages.length > 0 ? (
              activeMessages.map((msg) => {
                const isSelected = selectedMsg?.id === msg.id;
                return (
                  <div 
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/70 border-r-4 border-blue-600' :
                      !msg.isRead && activeTab === 'inbox' ? 'bg-gray-50/50 font-bold text-gray-950' : 'hover:bg-gray-50/30'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 text-[10px] text-gray-400 font-bold mb-1">
                      <span>{activeTab === 'inbox' ? transData(msg.senderName, lang) : transData(msg.receiverName, lang)}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <h4 className="text-xs text-gray-900 font-bold truncate leading-snug">{transData(msg.subject, lang)}</h4>
                    <p className="text-[10px] text-gray-500 truncate mt-1.5 font-medium">{transData(msg.content, lang)}</p>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-400 italic text-xs">
                {trans("لا يوجد أي رسائل هنا حتى الآن.", "No messages found here.")}
              </div>
            )}
          </div>
        </div>

        {/* Message Reader Panel */}
        <div className="md:col-span-2">
          {selectedMsg ? (
            <div className="bg-white border border-gray-150 rounded-xl p-6 shadow-xs min-h-[400px] flex flex-col justify-between animate-in fade-in duration-150">
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-bold text-base text-gray-950 leading-snug">{transData(selectedMsg.subject, lang)}</h3>
                    <p className="text-xs text-blue-600 font-bold mt-1.5">
                      <span>{activeTab === 'inbox' ? trans("المرسل:", "Sender:") : trans("المستلم:", "Recipient:")} </span>
                      <span className="text-gray-900 font-black">{activeTab === 'inbox' ? transData(selectedMsg.senderName, lang) : transData(selectedMsg.receiverName, lang)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-medium">{selectedMsg.timestamp}</span>
                    <button 
                      onClick={() => handleDeleteMessage(selectedMsg.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer"
                      title={trans("حذف الرسالة", "Delete mail")}
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  {transData(selectedMsg.content, lang)}
                </p>
              </div>

              {/* Status footer */}
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-[10px] text-gray-400 font-bold">
                <span className="flex items-center gap-1">
                  <MessageSquare size={13} />
                  <span>{trans("تواصل رسمي محمي وموثق بالكامل", "End-to-end official communication")}</span>
                </span>
                <span>ID: {selectedMsg.id}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-150 rounded-xl p-12 text-center text-gray-400 italic text-xs min-h-[400px] flex flex-col items-center justify-center gap-3 shadow-xs">
              <Mail size={32} className="text-gray-300" />
              <span>{trans("حدد رسالة من القائمة الجانبية لقراءتها واستعراض محتواها", "Select a letter from the mailbox to preview its details.")}</span>
            </div>
          )}
        </div>

      </div>

      {/* Compose Message Modal Overlay */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">{trans("إنشاء وإرسال رسالة رسمية جديدة", "Compose New School Circular")}</h3>
              <button onClick={() => setShowCompose(false)} className="p-1 rounded hover:bg-gray-200 text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleComposeSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("المستلم المستهدف *", "Choose Recipient *")}</label>
                <select 
                  value={newMessage.recipientId}
                  onChange={(e) => setNewMessage({...newMessage, recipientId: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="all-parents">{trans("جميع أولياء الأمور بالمدرسة (تعميم أولياء الأمور)", "All School Parents")}</option>
                  <option value="all-teachers">{trans("جميع الكادر التعليمي والمعلمات (تعميم الكادر)", "All Teaching Staff")}</option>
                  <option value="p1">{trans("عبدالرحمن بن محمد السديري (ولي أمر)", "Abdulrahman Al-Sudairi (Parent)")}</option>
                  <option value="t1">{trans("أ. ياسر بن سليمان الحربي (رياضيات)", "Mr. Yasser Al-Harbi (Math)")}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("عنوان الرسالة أو التعميم *", "Subject Title *")}</label>
                <input 
                  type="text" required
                  placeholder={trans("اكتب عنوانًا واضحًا...", "Enter subject topic...")}
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">{trans("نص ومحتوى الرسالة *", "Message Content *")}</label>
                <textarea 
                  required
                  placeholder={trans("اكتب تفاصيل الإعلان أو الرسالة هنا...", "Type the details of your letter or announcement here...")}
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-250 rounded-lg px-3 py-1.5 text-xs h-24 focus:outline-none"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowCompose(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer">
                  {trans("إلغاء", "Cancel")}
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer">
                  {trans("إرسال ونشر الرسالة", "Publish Message")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

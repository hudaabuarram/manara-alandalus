import React, { useState } from 'react';
import { 
  School, Mail, Lock, Eye, EyeOff, Globe, Check, 
  ArrowRight, Shield, Sparkles, BookOpen, KeyRound, AlertCircle, Info
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginViewProps {
  onLogin: (role: UserRole, email: string) => void;
}

type Lang = 'ar' | 'en';

export default function LoginView({ onLogin }: LoginViewProps) {
  const [lang, setLang] = useState<Lang>('ar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Translations dictionary
  const t = {
    ar: {
      systemName: 'منارة الأندلس',
      systemSubtitle: 'نظام إدارة المدارس المتكامل والذكي',
      loginTitle: 'تسجيل الدخول إلى حسابك',
      loginSubtitle: 'الرجاء إدخال بيانات الاعتماد المعتمدة للوصول إلى اللوحة المخصصة.',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'name@example.com',
      password: 'كلمة المرور',
      passwordPlaceholder: '••••••••',
      rememberMe: 'تذكرني في المرة القادمة',
      forgotPassword: 'هل نسيت كلمة المرور؟',
      loginBtn: 'تسجيل الدخول الآمن',
      errorInvalid: 'الرجاء تعبئة جميع الحقول المطلوبة بشكل صحيح.',
      successMsg: 'جاري التحقق والمزامنة مع خوادم المدرسة...',
      quickSelectTitle: 'تسجيل الدخول التجريبي السريع (اختر حساباً):',
      admin: 'المدير العام',
      supervisor: 'المشرف الأكاديمي',
      teacher: 'معلم الصف',
      student: 'طالب (محمد السديري)',
      parent: 'ولي الأمر (عبدالرحمن)',
      copyright: 'جميع الحقوق محفوظة © منارة الأندلس ٢٠٢٦م',
      resetTitle: 'استعادة كلمة المرور',
      resetDesc: 'أدخل بريدك الإلكتروني الأكاديمي وسنرسل لك تعليمات إعادة التعيين.',
      sendInstructions: 'إرسال تعليمات الاستعادة',
      cancel: 'إلغاء',
      resetSuccessMsg: 'تم إرسال رابط الاستعادة إلى بريدك الإلكتروني بنجاح!',
      language: 'English',
      selectLang: 'تغيير اللغة',
    },
    en: {
      systemName: 'Manarat Al-Andalus',
      systemSubtitle: 'Integrated & Smart School Management System',
      loginTitle: 'Sign in to your account',
      loginSubtitle: 'Please enter your authorized credentials to access your dedicated dashboard.',
      email: 'Email Address',
      emailPlaceholder: 'name@example.com',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      rememberMe: 'Remember me on this device',
      forgotPassword: 'Forgot your password?',
      loginBtn: 'Secure Sign In',
      errorInvalid: 'Please fill in all required fields correctly.',
      successMsg: 'Verifying credentials and syncing school servers...',
      quickSelectTitle: 'Quick Demo Access (Select a role):',
      admin: 'General Manager',
      supervisor: 'Academic Supervisor',
      teacher: 'Class Teacher',
      student: 'Student (M. Al-Sudairy)',
      parent: 'Parent (Abdulrahman)',
      copyright: 'All Rights Reserved © Manarat Al-Andalus 2026',
      resetTitle: 'Reset Password',
      resetDesc: 'Enter your academic email address and we will send you recovery instructions.',
      sendInstructions: 'Send Recovery Instructions',
      cancel: 'Cancel',
      resetSuccessMsg: 'Recovery link has been successfully sent to your email!',
      language: 'العربية',
      selectLang: 'Change Language',
    }
  }[lang];

  // Accounts demo configuration for instant login filling
  const demoAccounts = [
    { role: 'admin' as UserRole, email: 'admin@andalus.edu.sa', label: t.admin, color: 'border-red-200 text-red-700 bg-red-50/50 hover:bg-red-50' },
    { role: 'supervisor' as UserRole, email: 'supervisor@andalus.edu.sa', label: t.supervisor, color: 'border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-50' },
    { role: 'teacher' as UserRole, email: 'teacher@andalus.edu.sa', label: t.teacher, color: 'border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-50' },
    { role: 'student' as UserRole, email: 'student@andalus.edu.sa', label: t.student, color: 'border-green-200 text-green-700 bg-green-50/50 hover:bg-green-50' },
    { role: 'parent' as UserRole, email: 'parent@andalus.edu.sa', label: t.parent, color: 'border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-50' }
  ];

  const handleQuickFill = (role: UserRole, demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword('123456');
    setError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError(t.errorInvalid);
      return;
    }

    setSuccess(t.successMsg);
    setTimeout(() => {
      onLogin(selectedRole, email);
    }, 1200);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSuccess(t.resetSuccessMsg);
    setTimeout(() => {
      setIsResetModalOpen(false);
      setResetEmail('');
      setResetSuccess('');
    }, 2000);
  };

  return (
    <div 
      className="min-h-screen w-full flex bg-[#F9FAFB] text-gray-800"
      style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
      id="login-view-root"
    >
      {/* Decorative Editorial Left/Right Brand Column (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-12 flex-col justify-between relative overflow-hidden border-r border-gray-800" id="login-brand-sidebar">
        
        {/* Subtle pattern backgrounds */}
        <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        {/* Header crest */}
        <div className="relative flex items-center gap-3.5 z-10" id="brand-crest-header">
          <div className="w-12 h-12 rounded-xl bg-blue-600/90 flex items-center justify-center border border-blue-500/30 shadow-xl shadow-blue-900/40">
            <School className="text-white" size={24} />
          </div>
          <div>
            <span className="font-serif text-xl tracking-wide font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {lang === 'ar' ? 'منارة الأندلس' : 'Manarat Al-Andalus'}
            </span>
            <div className="text-[10px] text-blue-400 tracking-widest uppercase font-mono mt-0.5">
              {lang === 'ar' ? 'الأصالة والمعاصرة' : 'Heritage & Excellence'}
            </div>
          </div>
        </div>

        {/* Center Editorial Quote & Feature Highlights */}
        <div className="relative my-auto max-w-lg z-10" id="editorial-brand-quote">
          <span className="text-xs font-bold font-mono text-blue-400 uppercase tracking-widest block mb-4">
            {lang === 'ar' ? 'بوابة التحول التعليمي المتكامل' : 'TRANSFORMATIVE EDUCATIONAL PORTAL'}
          </span>
          <h1 className="text-4xl font-serif font-bold leading-tight mb-6 text-gray-100">
            {lang === 'ar' 
              ? 'تأسيس المعرفة ورعاية الإبداع في بيئة تقنية رائدة' 
              : 'Cultivating knowledge and fostering creativity in a pioneering digital ecosystem'}
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed mb-8">
            {lang === 'ar'
              ? 'تقدم منارة الأندلس حلاً برمجياً شاملاً يربط المعلمين، الطلاب، وأولياء الأمور بكفاءة متناهية، لبناء تجربة تعليمية منضبطة ومتكاملة.'
              : 'Providing an elite unified platform connecting managers, educators, students, and parents seamlessly to enhance communication, academic performance, and institutional clarity.'}
          </p>

          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-right" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div>
              <span className="text-xl font-serif font-bold text-white block">١,٢٥٠+</span>
              <span className="text-xs text-gray-400">{lang === 'ar' ? 'طالب وطالبة نشطين' : 'Active Students'}</span>
            </div>
            <div>
              <span className="text-xl font-serif font-bold text-white block">٩٨.٤٪</span>
              <span className="text-xs text-gray-400">{lang === 'ar' ? 'نسبة رضا أولياء الأمور' : 'Parent Satisfaction'}</span>
            </div>
          </div>
        </div>

        {/* Left Footer metadata */}
        <div className="relative z-10 flex items-center justify-between text-xs text-gray-500 font-mono" id="brand-sidebar-footer">
          <span>{t.copyright}</span>
          <span>v2.8.5</span>
        </div>
      </div>

      {/* Main Form Login Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 md:p-16 lg:p-20 relative bg-white" id="login-form-sidebar">
        
        {/* Top bar with language switcher */}
        <div className="flex justify-between items-center w-full" id="login-top-navbar">
          {/* Decorative Logo for small screens only */}
          <div className="flex lg:hidden items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <School size={18} />
            </div>
            <span className="font-serif font-bold text-sm text-gray-900">{t.systemName}</span>
          </div>

          <div className="mr-auto">
            <button 
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
              id="language-switch-btn"
            >
              <Globe size={14} className="text-blue-600" />
              <span>{t.language}</span>
            </button>
          </div>
        </div>

        {/* Center login form container */}
        <div className="my-auto max-w-md w-full mx-auto py-10" id="login-main-card">
          
          {/* Logo illustration for Editorial mood */}
          <div className="mb-6 flex justify-center lg:justify-start">
            <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-100 inline-flex items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <School size={26} />
              </div>
            </div>
          </div>

          <div className="space-y-2 text-center lg:text-right" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
            <h2 className="text-2xl font-serif font-bold text-gray-950 tracking-tight">{t.loginTitle}</h2>
            <p className="text-xs text-gray-500 leading-relaxed font-sans">{t.loginSubtitle}</p>
          </div>

          {/* Error and Success Alert Banners */}
          {error && (
            <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2.5">
              <Sparkles size={16} className="shrink-0 mt-0.5 text-emerald-600 animate-pulse" />
              <span className="font-medium">{success}</span>
            </div>
          )}

          {/* The form */}
          <form onSubmit={handleLoginSubmit} className="mt-8 space-y-4" id="login-form">
            
            {/* Role Select tab segmented control */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">{lang === 'ar' ? 'المستوى الوظيفي المالي والأكاديمي' : 'Access Level'}</label>
              <div className="grid grid-cols-5 gap-1 bg-gray-100/80 p-1 rounded-xl border border-gray-200/50">
                {(['admin', 'supervisor', 'teacher', 'student', 'parent'] as UserRole[]).map((r) => {
                  const roleLabels = {
                    admin: lang === 'ar' ? 'مدير' : 'Admin',
                    supervisor: lang === 'ar' ? 'مشرف' : 'Super',
                    teacher: lang === 'ar' ? 'معلم' : 'Teach',
                    student: lang === 'ar' ? 'طالب' : 'Stud',
                    parent: lang === 'ar' ? 'ولي' : 'Parent'
                  };
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={`py-1.5 px-0.5 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
                        selectedRole === r 
                          ? 'bg-white text-blue-600 shadow-xs' 
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {roleLabels[r]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700" htmlFor="email-input">
                {t.email}
              </label>
              <div className="relative">
                <input
                  id="email-input"
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 hover:border-gray-300 focus:bg-white focus:border-blue-600 rounded-xl py-2.5 pr-10 pl-4 text-xs font-medium text-gray-800 outline-none transition-all"
                  style={{ textAlign: 'left', direction: 'ltr' }}
                />
                <div className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${lang === 'ar' ? 'right-3' : 'left-3'}`} style={{ right: lang === 'ar' ? '12px' : 'auto', left: lang === 'en' ? '12px' : 'auto' }}>
                  <Mail size={16} />
                </div>
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-gray-700" htmlFor="password-input">
                  {t.password}
                </label>
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(true)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  {t.forgotPassword}
                </button>
              </div>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 hover:border-gray-300 focus:bg-white focus:border-blue-600 rounded-xl py-2.5 pr-10 pl-10 text-xs font-medium text-gray-800 outline-none transition-all"
                  style={{ textAlign: 'left', direction: 'ltr' }}
                />
                <div className="absolute top-1/2 -translate-y-1/2 text-gray-400" style={{ right: lang === 'ar' ? '12px' : 'auto', left: lang === 'en' ? '12px' : 'auto' }}>
                  <Lock size={16} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  style={{ left: lang === 'ar' ? '12px' : 'auto', right: lang === 'en' ? '12px' : 'auto' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me & Options */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-xs text-gray-500 font-medium">{t.rememberMe}</span>
              </label>
            </div>

            {/* Submit LogIn button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs mt-6 cursor-pointer"
            >
              <span>{t.loginBtn}</span>
              <ArrowRight size={14} className={lang === 'ar' ? 'rotate-180' : ''} />
            </button>

          </form>

          {/* Quick Preset Demo Accounts Selector Section */}
          <div className="mt-8 pt-6 border-t border-gray-100" id="quick-fill-accounts">
            <span className="text-[11px] font-bold text-gray-400 block mb-3 text-center lg:text-right">
              {t.quickSelectTitle}
            </span>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleQuickFill(account.role, account.email)}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all duration-150 cursor-pointer ${account.color} flex items-center gap-1.5`}
                >
                  <span>{account.label}</span>
                  {email === account.email && (
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Small screen copyrights */}
        <div className="text-center text-[10px] text-gray-400 font-mono mt-4 lg:hidden">
          {t.copyright}
        </div>
      </div>

      {/* Forgot Password Recovery Slide-Over / Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gray-150 max-w-sm w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">{t.resetTitle}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">{t.resetDesc}</p>

            {resetSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 mb-4">
                <Check size={16} className="text-emerald-600" />
                <span>{resetSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono">{t.email}</label>
                  <input
                    type="email"
                    required
                    placeholder="example@andalus.edu.sa"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-600 rounded-lg p-2 text-xs font-semibold outline-none"
                    style={{ textAlign: 'left', direction: 'ltr' }}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsResetModalOpen(false)}
                    className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer"
                  >
                    {t.sendInstructions}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

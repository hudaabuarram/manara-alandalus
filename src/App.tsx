import { useState } from 'react';
import { UserRole } from './types';
import { 
  initialSettings, initialParents, initialStudents, initialTeachers, 
  initialClasses, initialSubjects, initialSchedule, initialAttendance, 
  initialAssignments, initialSubmissions, initialExams, initialGrades, 
  initialInvoices, initialBooks, initialLoans, initialRoutes, initialMessages 
} from './data/mockData';

// Component imports
import Sidebar, { menuItems } from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import StudentsView from './components/StudentsView';
import TeachersView from './components/TeachersView';
import ParentsView from './components/ParentsView';
import ScheduleView from './components/ScheduleView';
import AttendanceView from './components/AttendanceView';
import AssignmentsExamsView from './components/AssignmentsExamsView';
import FinanceView from './components/FinanceView';
import LibraryTransportView from './components/LibraryTransportView';
import MessagesView from './components/MessagesView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Core system-wide states to support real reactive updates across tabs
  const [settings, setSettings] = useState(initialSettings);
  const [parents, setParents] = useState(initialParents);
  const [students, setStudents] = useState(initialStudents);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [classes, setClasses] = useState(initialClasses);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [exams, setExams] = useState(initialExams);
  const [grades, setGrades] = useState(initialGrades);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [books, setBooks] = useState(initialBooks);
  const [loans, setLoans] = useState(initialLoans);
  const [routes, setRoutes] = useState(initialRoutes);
  const [messages, setMessages] = useState(initialMessages);

  // Role-Based Access Control Redirector:
  // Check if current tab is allowed for this role. If not, fallback to 'dashboard'
  const isAllowed = (tab: string, role: UserRole) => {
    const item = menuItems.find(i => i.id === tab);
    return item ? item.roles.includes(role) : false;
  };

  const handleSetActiveTab = (tab: string) => {
    if (isAllowed(tab, currentRole)) {
      setActiveTab(tab);
    } else {
      alert("عذراً، هذه اللوحة البرمجية تتطلب امتيازات صلاحية أعلى من دورك الحالي.");
    }
  };

  // Safe fallback if switching roles makes activeTab unauthorized
  const getSafeActiveTab = () => {
    if (isAllowed(activeTab, currentRole)) {
      return activeTab;
    }
    return 'dashboard';
  };

  const currentSafeTab = getSafeActiveTab();

  // Helper count badges
  const unreadMessagesCount = messages.filter(m => !m.isRead && m.receiverId === currentRole).length;
  const activeNotificationsCount = 3; // simulated default notification bullet count

  // Main views routing mapper
  const renderActiveView = () => {
    switch (currentSafeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            students={students}
            teachers={teachers}
            parents={parents}
            classes={classes}
            subjects={subjects}
            attendance={attendance}
            exams={exams}
            invoices={invoices}
            setActiveTab={handleSetActiveTab}
          />
        );
      
      case 'students':
        return (
          <StudentsView 
            students={students}
            setStudents={setStudents}
            parents={parents}
            classes={classes}
            grades={grades}
            invoices={invoices}
            attendance={attendance}
          />
        );

      case 'teachers':
        return (
          <TeachersView 
            teachers={teachers}
            setTeachers={setTeachers}
            classes={classes}
            setClasses={setClasses}
            subjects={subjects}
            setSubjects={setSubjects}
            activeSubTab="teachers"
          />
        );

      case 'classes':
        return (
          <TeachersView 
            teachers={teachers}
            setTeachers={setTeachers}
            classes={classes}
            setClasses={setClasses}
            subjects={subjects}
            setSubjects={setSubjects}
            activeSubTab="classes"
          />
        );

      case 'subjects':
        return (
          <TeachersView 
            teachers={teachers}
            setTeachers={setTeachers}
            classes={classes}
            setClasses={setClasses}
            subjects={subjects}
            setSubjects={setSubjects}
            activeSubTab="subjects"
          />
        );

      case 'schedule':
        return (
          <ScheduleView 
            schedule={schedule}
            setSchedule={setSchedule}
            subjects={subjects}
            teachers={teachers}
            classes={classes}
          />
        );

      case 'attendance':
        return (
          <AttendanceView 
            attendance={attendance}
            setAttendance={setAttendance}
            students={students}
            teachers={teachers}
            classes={classes}
          />
        );

      case 'assignments':
        return (
          <AssignmentsExamsView 
            assignments={assignments}
            setAssignments={setAssignments}
            submissions={submissions}
            setSubmissions={setSubmissions}
            exams={exams}
            setExams={setExams}
            grades={grades}
            setGrades={setGrades}
            students={students}
            subjects={subjects}
            classes={classes}
            activeSubTab="assignments"
          />
        );

      case 'exams':
        return (
          <AssignmentsExamsView 
            assignments={assignments}
            setAssignments={setAssignments}
            submissions={submissions}
            setSubmissions={setSubmissions}
            exams={exams}
            setExams={setExams}
            grades={grades}
            setGrades={setGrades}
            students={students}
            subjects={subjects}
            classes={classes}
            activeSubTab="exams"
          />
        );

      case 'grades':
        return (
          <AssignmentsExamsView 
            assignments={assignments}
            setAssignments={setAssignments}
            submissions={submissions}
            setSubmissions={setSubmissions}
            exams={exams}
            setExams={setExams}
            grades={grades}
            setGrades={setGrades}
            students={students}
            subjects={subjects}
            classes={classes}
            activeSubTab="grades"
          />
        );

      case 'parents':
        return (
          <ParentsView 
            parents={parents}
            setParents={setParents}
            students={students}
            invoices={invoices}
          />
        );

      case 'finance':
        return (
          <FinanceView 
            invoices={invoices}
            setInvoices={setInvoices}
            students={students}
          />
        );

      case 'library':
        return (
          <LibraryTransportView 
            books={books}
            setBooks={setBooks}
            loans={loans}
            setLoans={setLoans}
            routes={routes}
            setRoutes={setRoutes}
            students={students}
            activeSubTab="library"
          />
        );

      case 'transport':
        return (
          <LibraryTransportView 
            books={books}
            setBooks={setBooks}
            loans={loans}
            setLoans={setLoans}
            routes={routes}
            setRoutes={setRoutes}
            students={students}
            activeSubTab="transport"
          />
        );

      case 'messages':
        return (
          <MessagesView 
            messages={messages}
            setMessages={setMessages}
            currentRole={currentRole}
          />
        );

      case 'reports':
        return (
          <ReportsView 
            students={students}
            teachers={teachers}
            invoices={invoices}
            grades={grades}
          />
        );

      case 'settings':
        return (
          <SettingsView 
            settings={settings}
            setSettings={setSettings}
          />
        );

      default:
        return (
          <DashboardView 
            students={students}
            teachers={teachers}
            parents={parents}
            classes={classes}
            subjects={subjects}
            attendance={attendance}
            exams={exams}
            invoices={invoices}
            setActiveTab={handleSetActiveTab}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginView 
        onLogin={(role, email) => {
          setCurrentRole(role);
          setSettings(prev => ({ ...prev, email }));
          setIsAuthenticated(true);
        }} 
      />
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen text-right" style={{ direction: 'rtl' }} id="app-workspace-root">
      
      {/* Sidebar Navigator */}
      <Sidebar 
        currentRole={currentRole}
        activeTab={currentSafeTab}
        setActiveTab={handleSetActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Right Section layout */}
      <div className="flex-1 flex flex-col min-w-0" id="main-content-wrapper">
        
        {/* Dynamic header */}
        <Header 
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          userEmail={settings.email}
          activeNotificationsCount={activeNotificationsCount}
          unreadMessagesCount={unreadMessagesCount}
          onLogout={() => setIsAuthenticated(false)}
        />

        {/* View container */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full" id="main-viewport">
          {renderActiveView()}
        </main>

      </div>

    </div>
  );
}

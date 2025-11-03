import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Batches from './pages/Batches';
import Subjects from './pages/Subjects';
import Sections from './pages/Sections';
import Courses from './pages/Courses';
import Teachers from './pages/Teachers';
import TeacherView from './pages/TeacherView';
import AssignOptionalSubjects from './pages/AssignOptionalSubjects';
import AssignAdditionalSubjects from './pages/AssignAdditionalSubjects';
import AssignSyllabus from './pages/AssignSyllabus';
import Classroom from './pages/Classroom';
import StudentProfile from './pages/StudentProfile';
import './App.css';

// Placeholder components for other routes
const PlaceholderPage = ({ title }) => (
  <div className=" bg-gray-50 dark:bg-gray-900 transition-all duration-300 p-8">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
      <p className="text-gray-600 dark:text-gray-400">
        This page is under construction. Content coming soon...
      </p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <Router>
          <div className="flex  bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            
            <div className="flex-1 flex flex-col">
              <Topbar />
              
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/batches" element={<Batches />} />
                  <Route path="/subjects" element={<Subjects />} />
                  <Route path="/subjects/assign-optional" element={<AssignOptionalSubjects />} />
                  <Route path="/subjects/assign-additional" element={<AssignAdditionalSubjects />} />
                  <Route path="/subjects/assign-syllabus" element={<AssignSyllabus />} />
                  <Route path="/sections" element={<Sections />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/teachers" element={<Teachers />} />
                  <Route path="/teachers/view" element={<TeacherView />} />
                  <Route path="/classrooms" element={<Classroom />} />
                  <Route path="/students/profile" element={<StudentProfile />} />
                  <Route path="/students/promote" element={<PlaceholderPage title="Promote Student" />} />
                  <Route path="/students/certificates" element={<PlaceholderPage title="Certificates" />} />
                  <Route path="/students/scholarship" element={<PlaceholderPage title="Scholarship" />} />
                  <Route path="/students/attendance" element={<PlaceholderPage title="Attendance" />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </SoundProvider>
    </ThemeProvider>
  );
}

export default App;


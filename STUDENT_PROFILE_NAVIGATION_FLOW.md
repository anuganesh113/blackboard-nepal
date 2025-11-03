# Student Profile - Navigation Flow Diagram

## 📊 Visual Flow Chart

```
┌─────────────────────────────────────────────────────────────────┐
│                         APPLICATION START                        │
│                         (Dashboard / Home)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ├─────────────────────────────────────────┐
                         │                                         │
                         ▼                                         ▼
              ┌──────────────────────┐                  ┌──────────────────────┐
              │   SIDEBAR MENU       │                  │   DIRECT URL         │
              │   "Classroom"        │                  │   /students/profile  │
              └──────────┬───────────┘                  └──────────────────────┘
                         │                                         │
                         ▼                                         │
              ┌──────────────────────┐                            │
              │  CLASSROOM PAGE      │                            │
              │  View all classrooms │                            │
              └──────────┬───────────┘                            │
                         │                                         │
                         ▼                                         │
              ┌──────────────────────┐                            │
              │  Select a Classroom  │                            │
              └──────────┬───────────┘                            │
                         │                                         │
                         ▼                                         │
              ┌──────────────────────┐                            │
              │  Action Dropdown     │                            │
              │  Click "Manage       │                            │
              │   Students" (👥)     │                            │
              └──────────┬───────────┘                            │
                         │                                         │
                         ▼                                         │
              ┌──────────────────────────┐                        │
              │  MANAGE STUDENTS VIEW    │                        │
              │  - List of students      │                        │
              │  - Search/filter         │                        │
              │  - Assign/Remove         │                        │
              └──────────┬───────────────┘                        │
                         │                                         │
                         ▼                                         │
              ┌──────────────────────────┐                        │
              │  Click "View Profile"    │                        │
              │  (Eye icon 👁️)          │                        │
              └──────────┬───────────────┘                        │
                         │                                         │
                         └─────────────────────────┬───────────────┘
                                                   │
                                                   ▼
                         ┌─────────────────────────────────────────┐
                         │       STUDENT PROFILE PAGE               │
                         │   ┌─────────────────────────────────┐   │
                         │   │  ← Back Button                  │   │
                         │   │  Student: John Doe              │   │
                         │   │  ID: STU001 | Class 8 | Batch   │   │
                         │   │  Due: ₹5,500 | School Admin ▼   │   │
                         │   └─────────────────────────────────┘   │
                         │                                          │
                         │   ┌───────────────────────────────────┐ │
                         │   │ [Student Info] [Attendance] [Fees]│ │
                         │   └───────────────────────────────────┘ │
                         │                                          │
                         │   Active Tab Content:                   │
                         │   ┌─────────────────────────────────┐   │
                         │   │  • Profile Picture              │   │
                         │   │  • Personal Details             │   │
                         │   │  • Documents                    │   │
                         │   │  • ID Card Preview              │   │
                         │   │  • Actions                      │   │
                         │   └─────────────────────────────────┘   │
                         └─────────────────────────────────────────┘
```

---

## 🔍 Detailed Step-by-Step Guide

### Path 1: Via Classroom Management (Recommended)

#### Step 1: Navigate to Classroom
- **Action**: Click "Classroom" in the left sidebar
- **Component**: `Sidebar.jsx` → `Classroom.jsx`
- **URL**: `/classrooms`

#### Step 2: View Classroom List
- **View**: Table showing all classrooms
- **Columns**: S.No, Classroom, Course, Subjects, Teachers, Class Teacher, Action

#### Step 3: Select Classroom
- **Action**: Click three-dot menu (⋮) in Actions column
- **Options**:
  - 📘 Manage Students
  - ✏️ Edit Classroom
  - 🗑️ Delete Classroom

#### Step 4: Click "Manage Students"
- **Component**: Opens `ManageStudentsView.jsx`
- **View**: List of all students in that classroom

#### Step 5: View Student List
- **Display**:
  - S.No, Roll No, Student ID, Photo, Name, Contact, Course, Batch
  - Search bar
  - Filter options
  - Action buttons per student

#### Step 6: Click "View Profile"
- **Button**: Eye icon (👁️) in Action column
- **Code Reference**: `ManageStudentsView.jsx` Line 291-297
```jsx
<button onClick={() => handleViewStudent(item)}>
  <Eye className="w-4 h-4" />
</button>

const handleViewStudent = (student) => {
  navigate('/students/profile', { state: { student } });
};
```

#### Step 7: Student Profile Opens
- **Component**: `StudentProfile.jsx`
- **URL**: `/students/profile`
- **Data**: Passed via `location.state.student`

---

### Path 2: Direct URL Navigation (Alternative)

#### Step 1: Navigate Directly
- **URL**: `http://localhost:5173/students/profile`
- **Result**: Opens with default mock data if no student passed

#### Step 2: Profile Displays
- **Fallback**: Uses default student data (Lines 40-61 in StudentProfile.jsx)
```jsx
const student = location.state?.student || {
  id: 1,
  name: 'John Doe',
  studentId: 'STU001',
  // ... default values
};
```

---

## 🎯 Navigation Components Map

```
┌─────────────────────────────────────────────────────────────┐
│                         App.jsx                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ <Router>                                               │ │
│  │   <Sidebar />                                          │ │
│  │   <Topbar />                                           │ │
│  │   <Routes>                                             │ │
│  │     <Route path="/classrooms" element={<Classroom/>}/> │ │
│  │     <Route path="/students/profile"                    │ │
│  │            element={<StudentProfile/>} />              │ │
│  │   </Routes>                                            │ │
│  │ </Router>                                              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────────┐
│  Sidebar.jsx   │  │ Classroom.jsx  │  │ StudentProfile.jsx │
│                │  │                │  │                    │
│ • Dashboard    │  │ Shows:         │  │ Shows:             │
│ • Batches      │  │ • Classrooms   │  │ • Student Info     │
│ • Subjects     │  │ • Teachers     │  │ • Attendance       │
│ • Sections     │  │ • Subjects     │  │ • Fee & Payments   │
│ • Course       │  │                │  │                    │
│ • Teacher      │  │ Actions:       │  │ Actions:           │
│ • Classroom ◄──┼──┼─Manage Students├──►│ • Edit Info        │
│ • Student      │  │                │  │ • View Documents   │
└────────────────┘  └────────┬───────┘  │ • Pay Fees         │
                             │          └────────────────────┘
                             ▼
                  ┌────────────────────┐
                  │ManageStudentsView.│
                  │                    │
                  │ Shows:             │
                  │ • Student list     │
                  │ • Roll numbers     │
                  │ • Search/filter    │
                  │                    │
                  │ Actions:           │
                  │ • View Profile ◄───┼─────┐
                  │ • Delete           │     │
                  │ • Assign           │     │
                  └────────────────────┘     │
                                             │
                             ┌───────────────┘
                             ▼
                  Student data passed via
                  navigate('/students/profile', 
                          { state: { student } })
```

---

## 🔄 Data Flow

### Forward Navigation (to Profile)
```javascript
// From ManageStudentsView.jsx
const handleViewStudent = useCallback((student) => {
  navigate('/students/profile', { 
    state: { student }  // ← Student object passed here
  });
}, [navigate]);
```

### Receiving Data (in Profile)
```javascript
// In StudentProfile.jsx
const location = useLocation();
const student = location.state?.student || defaultStudent;
```

### Back Navigation (from Profile)
```javascript
// StudentProfile.jsx
const handleBack = () => {
  navigate(-1);  // ← Goes back to previous page
};
```

---

## 🎨 UI States & Transitions

### Loading State
```
Classroom Page → ManageStudentsView → Student Profile
    ↓                  ↓                    ↓
Loading...         Loading...          Loading...
    ↓                  ↓                    ↓
[Table]         [Student List]      [Profile Tabs]
```

### Tab Navigation (within Profile)
```
Student Profile Page
    │
    ├─ Tab: Student Info (default) ◄─┐
    ├─ Tab: View Attendance          ├─ State: activeTab
    └─ Tab: Fee & Payments           │
                                     │
    Click Tab ──────────────────────┘
```

---

## 📊 Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     React Context                            │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │ ThemeContext   │  │ SoundContext   │  │ (Future:      │ │
│  │ • Light/Dark   │  │ • Play sounds  │  │  AuthContext) │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    StudentProfile.jsx                        │
│                                                              │
│  State Management:                                           │
│  • activeTab                                                 │
│  • attendanceData                                            │
│  • pendingTransactions                                       │
│  • toast                                                     │
│                                                              │
│  Child Components:                                           │
│  ├─ Button (Design System)                                   │
│  ├─ Card (Design System)                                     │
│  ├─ DataTable (UI Component)                                 │
│  ├─ Toast (Notification)                                     │
│  └─ Tooltip (UI Component)                                   │
│                                                              │
│  External Hooks:                                             │
│  ├─ useNavigate() → Router navigation                        │
│  ├─ useLocation() → Receive student data                     │
│  └─ useSound() → Play notification sounds                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚦 User Journey Map

### Scenario 1: Teacher views student profile from classroom
```
Teacher Dashboard
    ↓ (Click Classroom)
Classroom List
    ↓ (Click Manage Students on "Class 8-A")
Student List (Class 8-A)
    ↓ (Click View Profile on "John Doe")
John Doe's Profile
    ↓ (View 3 tabs)
    • Student Info ✓
    • Attendance ✓
    • Fee & Payments ✓
    ↓ (Click Back)
Return to Student List
```

### Scenario 2: Admin checks student fee status
```
Admin Dashboard
    ↓ (Navigate to Classroom → Manage Students → View Profile)
Student Profile
    ↓ (Click "Fee & Payments" tab)
Fee & Payments View
    ↓ (Review pending transactions)
    • Due: ₹5,500
    • Recent payments: ✓
    • Pending fees: 2 items
    ↓ (Select fees and click Pay Now)
Payment Processed ✓
```

### Scenario 3: Parent views child's attendance
```
Parent Portal Login
    ↓ (View Children → Select Child)
Child's Profile
    ↓ (Click "View Attendance" tab)
Attendance Tab
    ↓ (Select Month: January, Year: 2024)
    ↓ (Click View)
Attendance Data
    • Total Days: 20
    • Present: 18
    • Absent: 2
    • Percentage: 90%
```

---

## 🔐 Permission & Access Control (Future)

### Role-based Access
```
┌──────────────────────────────────────────────────────────┐
│                    User Roles                             │
├──────────────┬───────────────────────────────────────────┤
│ Admin        │ Full access to all features               │
│ Teacher      │ View only (no edit/payment)               │
│ Parent       │ View only their child                     │
│ Student      │ View only their own profile               │
└──────────────┴───────────────────────────────────────────┘
```

### Feature Permissions
```
┌─────────────────┬───────┬─────────┬────────┬─────────┐
│ Feature         │ Admin │ Teacher │ Parent │ Student │
├─────────────────┼───────┼─────────┼────────┼─────────┤
│ View Profile    │   ✓   │    ✓    │   ✓    │    ✓    │
│ Edit Info       │   ✓   │    ✗    │   ✗    │    ✗    │
│ View Attendance │   ✓   │    ✓    │   ✓    │    ✓    │
│ View Fees       │   ✓   │    ✓    │   ✓    │    ✓    │
│ Pay Fees        │   ✓   │    ✗    │   ✓    │    ✗    │
│ Change Password │   ✓   │    ✗    │   ✗    │    ✓    │
│ Upload Docs     │   ✓   │    ✗    │   ✓    │    ✗    │
└─────────────────┴───────┴─────────┴────────┴─────────┘
```

---

## 📱 Responsive Navigation

### Desktop (> 1024px)
```
┌─────────────┬──────────────────────────────────────────┐
│             │                                          │
│  Sidebar    │         Main Content Area                │
│  (Fixed)    │         (Student Profile)                │
│             │                                          │
│  • Dashboard│  ┌────────────────────────────────────┐  │
│  • Batches  │  │  Header with Back Button           │  │
│  • Classroom│  ├────────────────────────────────────┤  │
│  • Student  │  │  [Tab1] [Tab2] [Tab3]              │  │
│             │  ├────────────────────────────────────┤  │
│             │  │                                    │  │
│             │  │  Tab Content                       │  │
│             │  │                                    │  │
│             │  └────────────────────────────────────┘  │
└─────────────┴──────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────────────────────────────────────────────┐
│  ☰ Menu                                          👤 Admin│
├──────────────────────────────────────────────────────────┤
│  ← Back     Student Profile                              │
├──────────────────────────────────────────────────────────┤
│  [Student Info] [Attendance] [Fees]                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Tab Content                                             │
│  (Stacked vertically)                                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 Quick Access Summary

| From             | To                  | Steps | Time |
|------------------|---------------------|-------|------|
| Dashboard        | Student Profile     | 4     | 10s  |
| Classroom List   | Student Profile     | 3     | 8s   |
| Direct URL       | Student Profile     | 1     | 2s   |
| Student Profile  | Back to previous    | 1     | 1s   |

---

## 📝 Navigation Code Snippets

### Navigate to Profile
```jsx
// From any component
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/students/profile', { 
  state: { 
    student: {
      id: 1,
      name: 'John Doe',
      // ... student data
    }
  } 
});
```

### Access Passed Data
```jsx
// In StudentProfile.jsx
import { useLocation } from 'react-router-dom';

const location = useLocation();
const student = location.state?.student;
```

### Navigate Back
```jsx
// From StudentProfile
const navigate = useNavigate();
navigate(-1); // Go to previous page
```

---

## 🔍 Debugging Navigation

### Check Current Route
```jsx
import { useLocation } from 'react-router-dom';

const location = useLocation();
console.log('Current path:', location.pathname);
console.log('State data:', location.state);
```

### Verify Student Data
```jsx
// In StudentProfile.jsx
useEffect(() => {
  console.log('Student data:', student);
  console.log('Location state:', location.state);
}, []);
```

---

This completes the comprehensive navigation flow documentation! 🎉

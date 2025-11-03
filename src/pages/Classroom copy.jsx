import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown,
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import Toast from '../components/Toast';
import ClassroomModal from '../components/ClassroomModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import ClassroomDetailsModal from '../components/ClassroomDetailsModal';
import ActionDropdown from '../components/ActionDropdown';
import { useSound } from '../context/SoundContext';

const Classroom = () => {
  const { playNotificationSound } = useSound();
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'sno', direction: 'asc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [showDisabled, setShowDisabled] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsModalType, setDetailsModalType] = useState('subjects');

  // Sample data for classrooms - populated from actual course module data
  const [classrooms, setClassrooms] = useState([
    {
      id: 1,
      classroom: 'Nursery - A',
      course: 'Nursery',
      section: 'A',
      subjects: ['English', 'English Oral', 'Hygiene', 'Maths', 'Maths Oral', 'Nepali', 'Nepali Oral', 'Rhymes'],
      teachers: ['Anu Shrestha', 'Sharmila', 'Teacher', 'Sharmila', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Sharmila',
      status: 'yes',
      subjectTeachers: {
        'English': 'Anu Shrestha',
        'English Oral': 'Sharmila',
        'Hygiene': 'Teacher',
        'Maths': 'Sharmila',
        'Maths Oral': 'Teacher',
        'Nepali': 'Teacher',
        'Nepali Oral': 'Teacher',
        'Rhymes': 'Teacher'
      },
      isActive: true
    },
    {
      id: 2,
      classroom: 'Nursery - B',
      course: 'Nursery',
      section: 'B',
      subjects: ['English', 'English Oral', 'Hygiene', 'Maths', 'Maths Oral', 'Nepali', 'Nepali Oral', 'Rhymes'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'English': 'Teacher',
        'English Oral': 'Teacher',
        'Hygiene': 'Teacher',
        'Maths': 'Teacher',
        'Maths Oral': 'Teacher',
        'Nepali': 'Teacher',
        'Nepali Oral': 'Teacher',
        'Rhymes': 'Teacher'
      },
      isActive: true
    },
    {
      id: 3,
      classroom: 'Lkg - A',
      course: 'Lkg',
      section: 'A',
      subjects: ['Drawing', 'English', 'English Oral', 'Hygiene', 'Maths', 'Maths Oral', 'Nepali', 'Nepali Oral', 'Rhymes', 'Science', 'Science Oral'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'English Oral': 'Teacher',
        'Hygiene': 'Teacher',
        'Maths': 'Teacher',
        'Maths Oral': 'Teacher',
        'Nepali': 'Teacher',
        'Nepali Oral': 'Teacher',
        'Rhymes': 'Teacher',
        'Science': 'Teacher',
        'Science Oral': 'Teacher'
      },
      isActive: true
    },
    {
      id: 4,
      classroom: 'Lkg - B',
      course: 'Lkg',
      section: 'B',
      subjects: ['Drawing', 'English', 'English Oral', 'Hygiene', 'Maths', 'Maths Oral', 'Nepali', 'Nepali Oral', 'Rhymes', 'Science', 'Science Oral'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'English Oral': 'Teacher',
        'Hygiene': 'Teacher',
        'Maths': 'Teacher',
        'Maths Oral': 'Teacher',
        'Nepali': 'Teacher',
        'Nepali Oral': 'Teacher',
        'Rhymes': 'Teacher',
        'Science': 'Teacher',
        'Science Oral': 'Teacher'
      },
      isActive: true
    },
    {
      id: 5,
      classroom: 'Lkg - C',
      course: 'Lkg',
      section: 'C',
      subjects: ['Drawing', 'English', 'English Oral', 'Hygiene', 'Maths', 'Maths Oral', 'Nepali', 'Nepali Oral', 'Rhymes', 'Science', 'Science Oral'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'English Oral': 'Teacher',
        'Hygiene': 'Teacher',
        'Maths': 'Teacher',
        'Maths Oral': 'Teacher',
        'Nepali': 'Teacher',
        'Nepali Oral': 'Teacher',
        'Rhymes': 'Teacher',
        'Science': 'Teacher',
        'Science Oral': 'Teacher'
      },
      isActive: true
    },
    {
      id: 6,
      classroom: 'Ukg - A',
      course: 'Ukg',
      section: 'A',
      subjects: ['Drawing', 'English', 'English Oral', 'Hygiene', 'Maths', 'Maths Oral', 'Nepali', 'Nepali Oral', 'Rhymes', 'Science', 'Science Oral'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'English Oral': 'Teacher',
        'Hygiene': 'Teacher',
        'Maths': 'Teacher',
        'Maths Oral': 'Teacher',
        'Nepali': 'Teacher',
        'Nepali Oral': 'Teacher',
        'Rhymes': 'Teacher',
        'Science': 'Teacher',
        'Science Oral': 'Teacher'
      },
      isActive: true
    },
    {
      id: 7,
      classroom: 'Ukg - B',
      course: 'Ukg',
      section: 'B',
      subjects: ['Drawing', 'English', 'English Oral', 'Hygiene', 'Maths', 'Maths Oral', 'Nepali', 'Nepali Oral', 'Rhymes', 'Science', 'Science Oral'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'English Oral': 'Teacher',
        'Hygiene': 'Teacher',
        'Maths': 'Teacher',
        'Maths Oral': 'Teacher',
        'Nepali': 'Teacher',
        'Nepali Oral': 'Teacher',
        'Rhymes': 'Teacher',
        'Science': 'Teacher',
        'Science Oral': 'Teacher'
      },
      isActive: true
    },
    {
      id: 8,
      classroom: 'Class 1 - A',
      course: 'Class 1',
      section: 'A',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Maths', 'Nepali', 'Science', 'Serofero'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Serofero': 'Teacher'
      },
      isActive: true
    },
    {
      id: 9,
      classroom: 'Class 1 - B',
      course: 'Class 1',
      section: 'B',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Maths', 'Nepali', 'Science', 'Serofero'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Serofero': 'Teacher'
      },
      isActive: true
    },
    {
      id: 10,
      classroom: 'Class 1 - C',
      course: 'Class 1',
      section: 'C',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Maths', 'Nepali', 'Science', 'Serofero'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Serofero': 'Teacher'
      },
      isActive: true
    },
    {
      id: 11,
      classroom: 'Class 1 - D',
      course: 'Class 1',
      section: 'D',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Maths', 'Nepali', 'Science', 'Serofero'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Serofero': 'Teacher'
      },
      isActive: true
    },
    {
      id: 12,
      classroom: 'Class 2 - A',
      course: 'Class 2',
      section: 'A',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Maths', 'Nepali', 'Science', 'Serofero'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Serofero': 'Teacher'
      },
      isActive: true
    },
    {
      id: 13,
      classroom: 'Class 2 - B',
      course: 'Class 2',
      section: 'B',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Maths', 'Nepali', 'Science', 'Serofero'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Serofero': 'Teacher'
      },
      isActive: true
    },
    {
      id: 14,
      classroom: 'Class 2 - C',
      course: 'Class 2',
      section: 'C',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Maths', 'Nepali', 'Science', 'Serofero'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Serofero': 'Teacher'
      },
      isActive: true
    },
    {
      id: 15,
      classroom: 'Class 3 - A',
      course: 'Class 3',
      section: 'A',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Maths', 'Nepali', 'Science', 'Serofero'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Serofero': 'Teacher'
      },
      isActive: true
    },
    {
      id: 16,
      classroom: 'Class 3 - B',
      course: 'Class 3',
      section: 'B',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Maths', 'Nepali', 'Science', 'Serofero'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Serofero': 'Teacher'
      },
      isActive: true
    },
    {
      id: 17,
      classroom: 'Class 3 - C',
      course: 'Class 3',
      section: 'C',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Maths', 'Nepali', 'Science', 'Serofero'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Serofero': 'Teacher'
      },
      isActive: true
    },
    {
      id: 18,
      classroom: 'Class 3 - D',
      course: 'Class 3',
      section: 'D',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Maths', 'Nepali', 'Science', 'Serofero'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Serofero': 'Teacher'
      },
      isActive: true
    },
    {
      id: 19,
      classroom: 'Class 4 - A',
      course: 'Class 4',
      section: 'A',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 20,
      classroom: 'Class 4 - B',
      course: 'Class 4',
      section: 'B',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 21,
      classroom: 'Class 4 - C',
      course: 'Class 4',
      section: 'C',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 22,
      classroom: 'Class 5 - A',
      course: 'Class 5',
      section: 'A',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 23,
      classroom: 'Class 5 - B',
      course: 'Class 5',
      section: 'B',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 24,
      classroom: 'Class 5 - C',
      course: 'Class 5',
      section: 'C',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 25,
      classroom: 'Class 5 - D',
      course: 'Class 5',
      section: 'D',
      subjects: ['Computer', 'Cursive', 'Drawing', 'English', 'General Knowledge', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Cursive': 'Teacher',
        'Drawing': 'Teacher',
        'English': 'Teacher',
        'General Knowledge': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 26,
      classroom: 'Class 6 - A',
      course: 'Class 6',
      section: 'A',
      subjects: ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'English': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 27,
      classroom: 'Class 6 - B',
      course: 'Class 6',
      section: 'B',
      subjects: ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'English': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 28,
      classroom: 'Class 6 - C',
      course: 'Class 6',
      section: 'C',
      subjects: ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'English': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 29,
      classroom: 'Class 7 - A',
      course: 'Class 7',
      section: 'A',
      subjects: ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'English': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 30,
      classroom: 'Class 7 - B',
      course: 'Class 7',
      section: 'B',
      subjects: ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'English': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 31,
      classroom: 'Class 7 - C',
      course: 'Class 7',
      section: 'C',
      subjects: ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'English': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 32,
      classroom: 'Class 7 - D',
      course: 'Class 7',
      section: 'D',
      subjects: ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'English': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 33,
      classroom: 'Class 8 - A',
      course: 'Class 8',
      section: 'A',
      subjects: ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'English': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 34,
      classroom: 'Class 8 - B',
      course: 'Class 8',
      section: 'B',
      subjects: ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'English': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 35,
      classroom: 'Class 8 - C',
      course: 'Class 8',
      section: 'C',
      subjects: ['Computer', 'English', 'Hamro Dhangadhi', 'Health and Education', 'Maths', 'Nepali', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'English': 'Teacher',
        'Hamro Dhangadhi': 'Teacher',
        'Health and Education': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 36,
      classroom: 'Class 9 - A',
      course: 'Class 9',
      section: 'A',
      subjects: ['Computer', 'Economics', 'English', 'Maths', 'Nepali', 'OPT Maths', 'Science', 'Social'],
      teachers: ['Anu Shrestha', 'Principal', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Anu Shrestha',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Anu Shrestha',
        'Economics': 'Principal',
        'English': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'OPT Maths': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 37,
      classroom: 'Class 9 - B',
      course: 'Class 9',
      section: 'B',
      subjects: ['Computer', 'Economics', 'English', 'Maths', 'Nepali', 'OPT Maths', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Economics': 'Teacher',
        'English': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'OPT Maths': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 38,
      classroom: 'Class 9 - C',
      course: 'Class 9',
      section: 'C',
      subjects: ['Computer', 'Economics', 'English', 'Maths', 'Nepali', 'OPT Maths', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Economics': 'Teacher',
        'English': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'OPT Maths': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 39,
      classroom: 'Class 9 - D',
      course: 'Class 9',
      section: 'D',
      subjects: ['Computer', 'Economics', 'English', 'Maths', 'Nepali', 'OPT Maths', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Economics': 'Teacher',
        'English': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'OPT Maths': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 40,
      classroom: 'Class 10 - A',
      course: 'Class 10',
      section: 'A',
      subjects: ['Computer', 'Economics', 'English', 'Maths', 'Nepali', 'OPT Maths', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Principal', 'Principal', 'Teacher', 'Principal', 'Teacher', 'Principal'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Economics': 'Teacher',
        'English': 'Principal',
        'Maths': 'Principal',
        'Nepali': 'Teacher',
        'OPT Maths': 'Principal',
        'Science': 'Teacher',
        'Social': 'Principal'
      },
      isActive: true
    },
    {
      id: 41,
      classroom: 'Class 10 - B',
      course: 'Class 10',
      section: 'B',
      subjects: ['Computer', 'Economics', 'English', 'Maths', 'Nepali', 'OPT Maths', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Economics': 'Teacher',
        'English': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'OPT Maths': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 42,
      classroom: 'Class 10 - C',
      course: 'Class 10',
      section: 'C',
      subjects: ['Computer', 'Economics', 'English', 'Maths', 'Nepali', 'OPT Maths', 'Science', 'Social'],
      teachers: ['Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher', 'Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'Computer': 'Teacher',
        'Economics': 'Teacher',
        'English': 'Teacher',
        'Maths': 'Teacher',
        'Nepali': 'Teacher',
        'OPT Maths': 'Teacher',
        'Science': 'Teacher',
        'Social': 'Teacher'
      },
      isActive: true
    },
    {
      id: 43,
      classroom: 'Alumni - A',
      course: 'Alumni',
      section: 'A',
      subjects: ['English'],
      teachers: ['Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'English': 'Teacher'
      },
      isActive: true
    },
    {
      id: 44,
      classroom: 'Alumni - B',
      course: 'Alumni',
      section: 'B',
      subjects: ['English'],
      teachers: ['Teacher'],
      classTeacher: 'Teacher',
      status: 'yes',
      subjectTeachers: {
        'English': 'Teacher'
      },
      isActive: true
    }
  ]);

  // Sorting logic
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-500" />
      : <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  // Filter and sort data
  const filteredData = classrooms.filter(item =>
    item.classroom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.classTeacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key === 'sno') {
      return sortConfig.direction === 'asc' ? a.id - b.id : b.id - a.id;
    }
    if (sortConfig.key === 'classroom') {
      return sortConfig.direction === 'asc'
        ? a.classroom.localeCompare(b.classroom)
        : b.classroom.localeCompare(a.classroom);
    }
    if (sortConfig.key === 'course') {
      return sortConfig.direction === 'asc'
        ? a.course.localeCompare(b.course)
        : b.course.localeCompare(a.course);
    }
    if (sortConfig.key === 'classTeacher') {
      return sortConfig.direction === 'asc'
        ? a.classTeacher.localeCompare(b.classTeacher)
        : b.classTeacher.localeCompare(a.course);
    }
    return 0;
  });

  // Pagination logic
  const totalEntries = sortedData.length;
  const totalPages = entriesPerPage === -1 ? 1 : Math.ceil(totalEntries / entriesPerPage);
  const startIndex = entriesPerPage === -1 ? 0 : (currentPage - 1) * entriesPerPage;
  const endIndex = entriesPerPage === -1 ? totalEntries : Math.min(startIndex + entriesPerPage, totalEntries);
  const paginatedData = entriesPerPage === -1 ? sortedData : sortedData.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleAddClassroom = () => {
    setEditingClassroom(null);
    setIsModalOpen(true);
  };

  const handleEditClassroom = (classroom) => {
    setEditingClassroom(classroom);
    setIsModalOpen(true);
  };

  const handleDeleteClassroom = (classroom) => {
    setSelectedClassroom(classroom);
    setIsDeleteModalOpen(true);
  };

  const handleManageStudents = (classroom) => {
    setToast({
      isVisible: true,
      message: `Managing students for ${classroom.classroom}...`,
      type: 'info'
    });
  };

  const handleViewAll = (classroom, type) => {
    setSelectedClassroom(classroom);
    setDetailsModalType(type);
    setIsDetailsModalOpen(true);
  };

  const handleSaveClassroom = (classroomData) => {
    console.log('Received classroom data:', classroomData);
    console.log('Editing classroom:', editingClassroom);
    
    if (editingClassroom) {
      // Update existing classroom
      setClassrooms(prev => prev.map(c => 
        c.id === editingClassroom.id ? { ...c, ...classroomData } : c
      ));
      
      // Play edit notification sound
      playNotificationSound('edit');
      
      setToast({
        isVisible: true,
        message: 'Classroom updated successfully!',
        type: 'success'
      });
    } else {
      // Add new classroom
      const newClassroom = {
        id: Math.max(...classrooms.map(c => c.id), 0) + 1,
        ...classroomData,
        isActive: true
      };
      console.log('Adding new classroom:', newClassroom);
      setClassrooms(prev => [...prev, newClassroom]);
      
      // Play add notification sound
      playNotificationSound('add');
      
      setToast({
        isVisible: true,
        message: 'Classroom added successfully!',
        type: 'success'
      });
    }
    setIsModalOpen(false);
    setEditingClassroom(null);
  };

  const handleConfirmDelete = () => {
    if (selectedClassroom) {
      setClassrooms(prev => prev.filter(c => c.id !== selectedClassroom.id));
      
      // Play delete notification sound
      playNotificationSound('delete');
      
      setToast({
        isVisible: true,
        message: 'Classroom deleted successfully!',
        type: 'success'
      });
    }
    setIsDeleteModalOpen(false);
    setSelectedClassroom(null);
  };

  const handleToggleDisabled = () => {
    setShowDisabled(!showDisabled);
    setToast({
      isVisible: true,
      message: showDisabled ? 'Showing active classrooms' : 'Showing disabled classrooms',
      type: 'info'
    });
  };

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Classroom List
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage and organize your classrooms
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleDisabled}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                showDisabled 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              {showDisabled ? 'Show Active' : 'Disabled Classroom'}
            </button>
            <button
              onClick={handleAddClassroom}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add Classroom
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Controls */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Entries Per Page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={-1}>All</option>
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">entries</span>
              </div>

              {/* Search */}
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <span className="text-sm text-gray-600 dark:text-gray-400">Search:</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 sm:w-48 px-4 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Search classrooms..."
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="relative">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-20 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    <button
                      onClick={() => handleSort('sno')}
                      className="flex items-center gap-1.5 font-semibold text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      S.No.
                      {getSortIcon('sno')}
                    </button>
                  </th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    <button
                      onClick={() => handleSort('classroom')}
                      className="flex items-center gap-1.5 font-semibold text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      Classroom
                      {getSortIcon('classroom')}
                    </button>
                  </th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    <button
                      onClick={() => handleSort('course')}
                      className="flex items-center gap-1.5 font-semibold text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      Course
                      {getSortIcon('course')}
                    </button>
                  </th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                      Subjects
                    </span>
                  </th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                      Teachers
                    </span>
                  </th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    <button
                      onClick={() => handleSort('classTeacher')}
                      className="flex items-center gap-1.5 font-semibold text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      Class Teacher
                      {getSortIcon('classTeacher')}
                    </button>
                  </th>
                  <th className="px-3 py-2 text-left whitespace-nowrap">
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {item.classroom}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {item.course}
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          <div className="flex flex-wrap gap-1.5">
                            {item.subjects.length > 0 ? (
                              <>
                                {item.subjects.slice(0, 3).map((subject, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-700/30"
                                  >
                                    {subject}
                                  </span>
                                ))}
                                {item.subjects.length > 3 && (
                                    <button
                                      onClick={() => handleViewAll(item, 'subjects')}
                                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700/30 hover:bg-green-200 dark:hover:bg-green-900/50 hover:shadow-sm transition-all duration-200 cursor-pointer"
                                      title={`View all ${item.subjects.length} subjects`}
                                    >
                                      +{item.subjects.length - 3} more
                                    </button>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">-</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs">
                          <div className="flex flex-wrap gap-1.5">
                            {item.teachers.length > 0 ? (
                              <>
                                {item.teachers.slice(0, 3).map((teacher, idx) => (
                                  <span
                                    key={idx}
                                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                      teacher === '-'
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
                                        : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-700/30'
                                    }`}
                                  >
                                    {teacher}
                                  </span>
                                ))}
                                {item.teachers.length > 3 && (
                                    <button
                                      onClick={() => handleViewAll(item, 'teachers')}
                                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700/30 hover:bg-green-200 dark:hover:bg-green-900/50 hover:shadow-sm transition-all duration-200 cursor-pointer"
                                      title={`View all ${item.teachers.length} teachers`}
                                    >
                                      +{item.teachers.length - 3} more
                                    </button>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">-</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {item.classTeacher || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex justify-center">
                          <ActionDropdown
                            actions={[
                              {
                                key: 'manageStudents',
                                type: 'manageStudents',
                                title: 'Manage Students',
                                className: 'text-blue-600 dark:text-blue-400',
                                handler: handleManageStudents
                              },
                              {
                                key: 'edit',
                                type: 'edit',
                                title: 'Edit Classroom',
                                className: 'text-green-600 dark:text-green-400',
                                handler: handleEditClassroom
                              },
                              {
                                key: 'delete',
                                type: 'delete',
                                title: 'Delete Classroom',
                                className: 'text-red-600 dark:text-red-400',
                                handler: handleDeleteClassroom
                              }
                            ]}
                            item={item}
                            position="bottom-end"
                            className="flex justify-center"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Info */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {totalEntries > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, totalEntries)} of{' '}
                {totalEntries} entries
              </div>

              {/* Pagination Controls */}
              {entriesPerPage !== -1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                        : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === i + 1
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalEntries === 0}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === totalPages || totalEntries === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                        : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Classroom Modal */}
      {isModalOpen && (
        <ClassroomModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingClassroom(null);
          }}
          classroom={editingClassroom}
          onSave={handleSaveClassroom}
          mode={editingClassroom ? 'edit' : 'create'}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedClassroom(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Classroom"
          message={`Are you sure you want to delete "${selectedClassroom?.classroom}"? This action cannot be undone.`}
        />
      )}

      {/* Classroom Details Modal */}
      {isDetailsModalOpen && (
        <ClassroomDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedClassroom(null);
          }}
          classroom={selectedClassroom}
          type={detailsModalType}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
        duration={3000}
      />
    </div>
  );
};

export default Classroom;

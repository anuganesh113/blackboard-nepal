import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const StudentsBarChart = () => {
  const studentsByClass = [
    { class: 'Class 8', students: 1 },
    { class: 'Class 9', students: 0 },
    { class: 'Class 10', students: 17 },
    { class: 'Class 11', students: 0 },
    { class: 'Class 12', students: 0 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-4 rounded-xl border-2 border-white/20 shadow-2xl">
          <p className="text-white font-bold text-base mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white text-sm capitalize">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-all duration-300">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
        Number of Students
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Total students by class
      </p>
      
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={studentsByClass}>
          <defs>
            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="class"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickLine={{ stroke: '#9CA3AF' }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickLine={{ stroke: '#9CA3AF' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Bar
            dataKey="students"
            fill="url(#colorStudents)"
            radius={[8, 8, 0, 0]}
            animationBegin={0}
            animationDuration={800}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentsBarChart;


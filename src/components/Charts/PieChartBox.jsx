import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const PieChartBox = () => {
  const data = [
    { name: 'Class 10', value: 17, percentage: 94.44 },
    { name: 'Class 8', value: 1, percentage: 5.56 },
  ];

  const COLORS = ['#3B82F6', '#A855F7'];

  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, name, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = (percent * 100).toFixed(2);

    return (
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-bold"
        style={{ 
          fontSize: '14px',
          fill: "#8f9092",
          fontWeight: '600'
        }}
      >
        {`${name}: ${percentage} %`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-4 rounded-xl border-2 border-white/20 shadow-2xl">
          <p className="text-white font-bold text-base mb-1">{payload[0].name}</p>
          <p className="text-white text-sm">
            {payload[0].value} students ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-all duration-300">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
        Total Students: 18
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Distribution by Class
      </p>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={{
              stroke: '#9CA3AF',
              strokeWidth: 1.5,
            }}
            label={renderCustomLabel}
            outerRadius={100}
            innerRadius={0}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                style={{ filter: 'drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.1))' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value, entry) => (
              <span className="text-gray-700 dark:text-gray-300">
                {value}: {entry.payload.value} ({entry.payload.percentage}%)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartBox;


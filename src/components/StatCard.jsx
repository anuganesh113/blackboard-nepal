import React from 'react';

const StatCard = ({ title, value, icon: Icon, gradientFrom, gradientTo }) => {
  return (
    <div
      className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} p-6 rounded-2xl text-white shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium opacity-90">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;


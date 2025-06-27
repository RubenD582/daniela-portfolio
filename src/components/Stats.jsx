import React, { useEffect, useState } from 'react';

const stats = [
  { number: 100, suffix: '+', label: 'Nail Sets Crafted' },
  { number: 50, suffix: '+', label: 'Satisfied Clients' },
  { number: 2, suffix: '+', label: 'Years Specializing' },
];

const StatItem = ({ number, suffix, label }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = number;
    if (start === end) return;

    const duration = 2000; // animation duration in ms
    const increment = Math.max(Math.floor(duration / end), 1);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, increment);

    return () => clearInterval(timer);
  }, [number]);

  return (
    <div className="text-stone-600">
      <div className="text-2xl font-light text-stone-900">
        {count}{suffix}
      </div>
      <div className="text-xs font-light uppercase tracking-wider">{label}</div>
    </div>
  );
};

// Main component rendering all stats
const ProfessionalStats = () => (
  <div className="mt-20 flex justify-center space-x-12 text-center">
    {stats.map((stat, idx) => (
      <StatItem key={idx} {...stat} />
    ))}
  </div>
);

export default ProfessionalStats;
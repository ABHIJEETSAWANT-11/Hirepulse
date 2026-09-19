import React from 'react';
import { ChevronRight, BookOpen, Code } from 'lucide-react';


export const TopicCard = ({ topic, onClick }) => {
  const completedLectures = topic.lectures.filter(l => l.completed).length;
  const completedAssignments = topic.assignments.filter(a => a.completed).length;
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-6 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all border border-gray-200/70 hover:border-primary/50"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-ink">{topic.title}</h3>
        <ChevronRight className="text-gray-400" />
      </div>
      <p className="text-gray-500 mt-2">{topic.description}</p>
      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-2 text-gray-500">
          <BookOpen size={18} />
          <span>{completedLectures}/{topic.lectures.length} lectures</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Code size={18} />
          <span>{completedAssignments}/{topic.assignments.length} assignments</span>
        </div>
      </div>
    </div>
  );
};
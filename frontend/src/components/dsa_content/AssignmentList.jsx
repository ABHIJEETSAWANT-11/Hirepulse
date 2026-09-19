import React from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';

export const AssignmentList = ({ assignments, onToggleComplete }) => {
  return (
    <div className="space-y-4">
      {assignments.map(assignment => (
        <div
          key={assignment.id}
          className="bg-white p-4 rounded-xl flex items-center justify-between border border-gray-200/70 shadow-sm"
        >
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-ink font-medium">{assignment.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                assignment.difficulty === 'Easy' ? 'bg-teal-50 text-teal-700' :
                assignment.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' :
                'bg-rose-50 text-rose-700'
              }`}>
                {assignment.difficulty}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Platform: {assignment.platform}</p>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={assignment.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <ExternalLink size={20} />
            </a>
            <button
              onClick={() => onToggleComplete(assignment.id)}
              className={`${
                assignment.completed ? 'text-primary' : 'text-gray-300'
              } hover:text-primary transition-colors`}
            >
              <CheckCircle size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
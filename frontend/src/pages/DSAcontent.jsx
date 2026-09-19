import React, { useState } from 'react';
import { BookOpen, Code } from 'lucide-react';
import dsaTopics from '../data/dsaContent.js';
import { TopicCard } from '../components/dsa_content/TopicCard';
import { VideoPlayer } from '../components/dsa_content/VideoPlayer';
import { AssignmentList } from '../components/dsa_content/AssignmentList';

function DSAContent() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('lectures');

  const handleLectureComplete = (lectureId) => {
    console.log(`Lecture ${lectureId} completed`);
  };

  const handleAssignmentToggle = (assignmentId) => {
    console.log(`Assignment ${assignmentId} toggled`);
  };

  return (
    <div className="min-h-screen bg-secondary/60 text-ink">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-ink">
          DSA <span className="text-primary">Learning Path</span>
        </h1>

        {selectedTopic ? (
          <div>
            <button
              onClick={() => setSelectedTopic(null)}
              className="text-gray-500 hover:text-primary mb-6 transition-colors"
            >
              ← Back to Topics
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-ink">{selectedTopic.title}</h2>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setActiveTab('lectures')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                  activeTab === 'lectures'
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-primary/40 hover:text-ink'
                }`}
              >
                <BookOpen size={18} />
                Lectures
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                  activeTab === 'assignments'
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-primary/40 hover:text-ink'
                }`}
              >
                <Code size={18} />
                Assignments
              </button>
            </div>

            {activeTab === 'lectures' ? (
              <div className="grid gap-6">
                {selectedTopic.lectures.map((lecture) => (
                  <VideoPlayer
                    key={lecture.id}
                    lecture={lecture}
                    onComplete={() => handleLectureComplete(lecture.id)}
                  />
                ))}
              </div>
            ) : (
              <AssignmentList
                assignments={selectedTopic.assignments}
                onToggleComplete={handleAssignmentToggle}
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dsaTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => setSelectedTopic(topic)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DSAContent;

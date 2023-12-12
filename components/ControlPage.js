import React, { useState, useEffect } from 'react';
import { createAPIEndpoint, ENDPOINTS } from '../api';

const ControlPage = () => {
  const [examStart, setExamStart] = useState(false);

  useEffect(() => {
    const fetchExamStatus = async () => {
        try {
          const response = await createAPIEndpoint(ENDPOINTS.participant).getStartExam(1); // Replace 1 with the desired ID
          if (response.data) {
            setExamStart(response.data.examstart);
            console.log(response.data.examstart);
          }
        } catch (error) {    
          console.error('Error fetching exam status:', error);
        }
      };

    fetchExamStatus();
  }, []); // Run this effect only once when the component mounts

  const handleStartExam = async () => {
    try {
        const start = await createAPIEndpoint(ENDPOINTS.participant).startExam();
      setExamStart(true);
    } catch (error) {
      console.error('Error starting exam:', error);
    }
  };

  const handleEndExam = async () => {
    try {
        const end = await createAPIEndpoint(ENDPOINTS.participant).endExam();
       setExamStart(false);
    } catch (error) {
      console.error('Error ending exam:', error);
    }
  };

  return (
    <div>
      <h1>Control Page</h1>
      <button onClick={handleStartExam}>Start Exam</button>
      <button onClick={handleEndExam}>End Exam</button>

      {examStart ? (
        <div>
          <h2>Quiz Page</h2>
          {/* Render your quiz page components here */}
        </div>
      ) : (
        <div>
          <h2>Result Page</h2>
          {/* Render your result page components here */}
        </div>
      )}
    </div>
  );
};

export default ControlPage;

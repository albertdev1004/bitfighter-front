import React, { useState, useEffect } from 'react';

interface GameTimerProps {
  type: string;
  // endTime: number; // End time in seconds
}

const GameTimer: React.FC<GameTimerProps> = ({ type }) => {
  const getNext3AMUTC = () => {
    const now = new Date();
    const next3AM = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 5, 0, 0));

    // If the current time is already past 3 AM UTC, set the next 3 AM to tomorrow
    if (now > next3AM) {
      next3AM.setUTCDate(now.getUTCDate() + 1);
    }

    return next3AM.getTime() / 1000; // Convert to seconds
  };

  const endTime = getNext3AMUTC(); // Target time: 3 AM UTC
  const [time, setTime] = useState<number>(endTime - Math.floor(Date.now() / 1000)); // Remaining time until 3 AM UTC

  // const [time, setTime] = useState(50400); // 3600 for one hour

  // useEffect(() => {
  //   let timer: NodeJS.Timeout;

  //   if (type === 'fight-night' && time > 0) {
  //     timer = setInterval(() => {
  //       setTime(prevTime => {
  //         if (prevTime <= 1) {
  //           clearInterval(timer); // Stop the timer when it reaches zero
  //           return 0;
  //         }
  //         return prevTime - 1;
  //       });
  //     }, 1000);
  //   }

  //   return () => clearInterval(timer); // Clean up on unmount
  // }, [type, time]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (type === 'fight-night' && time > 0) {
      timer = setInterval(() => {
        setTime(prevTime => {
          const currentTime = Math.floor(Date.now() / 1000); // Get the current time
          const newTime = endTime - currentTime; // Calculate remaining time until 3 AM UTC

          if (newTime <= 0) {
            clearInterval(timer); // Stop the timer when it reaches zero
            return 0;
          }

          return newTime; // Update the remaining time
        });
      }, 1000);
    }

    return () => clearInterval(timer); // Clean up the timer on unmount
  }, [type, time, endTime]);
  // Format time in HH:MM:SS
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <>
      {type === 'fight-night' && (
        <div className="timer-box">
          <p>Game time: {formatTime(time)}</p>
        </div>
      )}
    </>
  );
};

export default GameTimer;

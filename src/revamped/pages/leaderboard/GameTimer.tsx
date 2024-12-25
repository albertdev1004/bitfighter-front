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

  const ISTToUTC = (istTime: string): number => {
    const [date, time] = istTime.split(' ');
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const istDate = new Date(Date.UTC(year, month - 1, day, hours - 5, minutes - 30, seconds)); // Convert IST to UTC
    return istDate.getTime() / 1000; // Convert to seconds
  };
  const startTimeIST = "2024-12-23 18:30:00"
  const finishTimeIST = "2024-12-23 20:30:00"

  const startTimeUTC = ISTToUTC(startTimeIST);
  const finishTimeUTC = ISTToUTC(finishTimeIST);

  // const endTime = getNext3AMUTC(); // Target time: 3 AM UTC
  // const [time, setTime] = useState<number>(endTime - Math.floor(Date.now() / 1000)); // Remaining time until 3 AM UTC
  // const [time, setTime] = useState<number>(Math.max(startTimeUTC - Math.floor(Date.now() / 1000), 0)); // Time until start or remaining time
  // const [time, setTime] = useState(0);

  // useEffect(() => {
  //   let timer: NodeJS.Timeout;

  //   if (time > 0) {
  //     timer = setInterval(() => {
  //       setTime(prevTime => {
  //         const currentTime = Math.floor(Date.now() / 1000); // Get the current time

  //         console.log("debug time--- ", currentTime < startTimeUTC, currentTime >= startTimeUTC && currentTime <= finishTimeUTC)

  //         if (currentTime < startTimeUTC) {
  //           return startTimeUTC - currentTime; // Time until start
  //         } else if (currentTime >= startTimeUTC && currentTime <= finishTimeUTC) {
  //           return finishTimeUTC - currentTime; // Remaining time until finish
  //         } else {
  //           return 0;
  //         }

  //       });
  //     }, 1000);
  //   }

  //   return () => clearInterval(timer); // Clean up the timer on unmount
  // }, [type, startTimeUTC, finishTimeUTC, time]);

  const [time, setTime] = useState(() => {
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime < startTimeUTC) {
      return startTimeUTC - currentTime; // Time until start
    } else if (currentTime >= startTimeUTC && currentTime <= finishTimeUTC) {
      return finishTimeUTC - currentTime; // Remaining game time
    } else {
      return 0; // Game has ended
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime < startTimeUTC) {
        setTime(startTimeUTC - currentTime);
      } else if (currentTime >= startTimeUTC && currentTime <= finishTimeUTC) {
        setTime(finishTimeUTC - currentTime);
      } else {
        setTime(0); // Game has ended
      }
    }, 1000);

    return () => clearInterval(timer); // Clean up the interval on unmount
  }, [startTimeUTC, finishTimeUTC]);
  // Format time in HH:MM:SS
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const currentTime = Math.floor(Date.now() / 1000);

  return (
    <>
      {type === 'fight-night' && (
        <>
          {type === 'fight-night' && (
            <div className="timer-box">
              {currentTime < startTimeUTC && (
                <p>Game starts in: {formatTime(time)}</p>
              )}
              {currentTime >= startTimeUTC && currentTime <= finishTimeUTC && (
                <p>Game time: {formatTime(finishTimeUTC - currentTime)}</p>
              )}
              {currentTime > finishTimeUTC && <p>Game has ended.</p>}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default GameTimer;

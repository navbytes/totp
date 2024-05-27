import React, { useEffect, useState, useRef } from "react";

interface CountdownTimerProps {
  targetEpoch: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetEpoch }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(
    Math.floor((targetEpoch - Date.now()) / 1000)
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const remainingSeconds = Math.floor((targetEpoch - Date.now()) / 1000);
      setSecondsLeft(remainingSeconds);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetEpoch]);

  return (
    <div>
      {secondsLeft > 1 ? (
        <h2>Seconds Left: {secondsLeft}</h2>
      ) : (
        <h2>Expired!</h2>
      )}
    </div>
  );
};

export default CountdownTimer;

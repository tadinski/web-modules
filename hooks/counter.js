import { useState, useEffect } from "react";

export default function useSecondCounter(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isFinished, setIsFinished] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId = null;

    if (isRunning && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else {
      setIsFinished(true);
      setIsRunning(false);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, seconds]);

  const startCounter = () => {
    setIsRunning(true);
  };

  const resetCounter = () => {
    setSeconds(initialSeconds);
    setIsRunning(true);
    setIsFinished(false);
  };

  return [seconds, isFinished, isRunning, startCounter, resetCounter];
}

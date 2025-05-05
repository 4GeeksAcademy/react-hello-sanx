import React, { useState, useEffect, useRef } from 'react';

function formatTime(totalSeconds) {
  const days = Math.floor(totalSeconds / (24 * 3600));
  const remainingSecondsAfterDays = totalSeconds % (24 * 3600);
  const hours = Math.floor(remainingSecondsAfterDays / 3600);
  const remainingSecondsAfterHours = remainingSecondsAfterDays % 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60);
  const seconds = remainingSecondsAfterHours % 60;

  const pad = (num) => num.toString().padStart(2, '0');

  return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function SecondsCounter() {
  const [isNormalCounter, setIsNormalCounter] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [alertTime, setAlertTime] = useState('');

  //Colores de botones
  const counterColorClass = isNormalCounter ? 'bg-info' : 'bg-warning';
  const normalButtonClass = 'btn btn-info text-light rounded-top rounded-bottom-0';
  const regresivoButtonClass = 'btn btn-warning text-dark rounded-top rounded-bottom-0';
  const controlButtonClass = isNormalCounter
    ? 'btn btn-light fw-bold text-uppercase text-info'
    : 'btn btn-dark fw-bold text-uppercase text-warning';

  const counterTextColorClass = isNormalCounter ? 'text-light' : 'text-dark';

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (isNormalCounter) {
          setSeconds((prevSeconds) => prevSeconds + 1);
        } else {
          setCountdownSeconds((prevSeconds) => {
            if (prevSeconds > 0) {
              return prevSeconds - 1;
            } else {
              clearInterval(intervalRef.current);
              setIsRunning(false);
              if (alertTime && parseInt(alertTime, 10) === 0) {
                alert('¡TIEMPO DE CUENTA REGRESIVA FINALIZADO!');
              }
              return 0;
            }
          });
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isNormalCounter, alertTime]);

  useEffect(() => {
    if (isNormalCounter && alertTime && seconds === parseInt(alertTime, 10) && isRunning) {
      alert(`¡ALERTA! SE ALCANZARON ${alertTime} SEGUNDOS.`);
    }
  }, [seconds, alertTime, isNormalCounter, isRunning]);

  const handlePlay = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (isNormalCounter) {
      setSeconds(0);
    } else {
      setCountdownSeconds(0);
    }
  };

  const handleSwitchCounter = (isNormal) => {
    setIsNormalCounter(isNormal);
    setIsRunning(false);
    setSeconds(0);
    setCountdownSeconds(0);
    setAlertTime('');
  };

  const handleCreateAlert = () => {
    const time = prompt('Introduce los segundos para la alerta:');
    if (time !== null) {
      setAlertTime(time);
    }
  };

  const handleCreateInterval = () => {
    const interval = prompt('Introduce los segundos para iniciar la cuenta regresiva:');
    if (interval !== null && !isNaN(parseInt(interval, 10)) && parseInt(interval, 10) >= 0) {
      setCountdownSeconds(parseInt(interval, 10));
      setIsNormalCounter(false);
      setIsRunning(false);
    } else {
      alert('POR FAVOR, INTRODUCE UN NÚMERO VÁLIDO DE SEGUNDOS.');
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-dark p-3">
      <div className="container" style={{ maxWidth: '500px' }}>
      <div className="w-100 d-flex justify-content-center">
      <div
        className=" d-flex justify-content-center w-100"
        style={{
          width: '25%',
          marginTop: '-8px',
          zIndex: 1,
          position: 'relative'
        }}
      >
        <button
          className={`${normalButtonClass} me-sm-2 w-50`}
          onClick={() => handleSwitchCounter(true)}
          style={{ borderBottom: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}
        >
          Normal
        </button>

        <button
          className={`${regresivoButtonClass} w-50`}
          onClick={() => handleSwitchCounter(false)}
          style={{ borderBottom: 'none', fontWeight: 'bold', textTransform: 'uppercase' }}
        >
          <span className="text-dark">Regresivo</span>
        </button>
      </div>
      </div>

      <div className={`col-12 p-4 rounded-top-0 rounded-bottom shadow ${counterColorClass} text-center`}>
        <div className={`display-4 fw-bold text-uppercase ${counterTextColorClass}`}>
          {isNormalCounter ? formatTime(seconds) : formatTime(countdownSeconds)}
        </div>
        <div className="d-flex justify-content-around mt-3 flex-wrap">
          <button className={controlButtonClass} onClick={handlePlay}>Play</button>
          <button className={controlButtonClass} onClick={handlePause}>Pausa</button>
          <button className={controlButtonClass} onClick={handleStop}>Stop</button>
          <button
            className={controlButtonClass}
            onClick={isNormalCounter ? handleCreateAlert : handleCreateInterval}
          >
            {isNormalCounter ? 'Crear Alerta' : 'Crear Intervalo'}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default SecondsCounter;

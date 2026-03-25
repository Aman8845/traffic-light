import { useState, useEffect, useRef } from 'react';
import TrafficLight from './components/TrafficLight';
import Controls from './components/Controls';
import './index.css';

function App() {
  const [activeLight, setActiveLight] = useState('red');
  const [queueLength, setQueueLength] = useState(25);
  const [approachDensity, setApproachDensity] = useState(25);
  const [calculatedTime, setCalculatedTime] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const timerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const startSimulation = async () => {
    setIsSimulating(true);
    // Fetch calculation from backend
    try {
      const response = await fetch('http://127.0.0.1:8000/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queue_length: queueLength,
          approach_density: approachDensity
        })
      });
      const data = await response.json();
      
      const durationSecs = Math.round(data.green_duration);
      setCalculatedTime(durationSecs);
      
      // Sequence: Green -> Yellow -> Red
      // 1. Switch to Green immediately
      setActiveLight('green');
      startCountdown(durationSecs);
      
      // 2. Schedule Yellow
      timerRef.current = setTimeout(() => {
        setActiveLight('yellow');
        startCountdown(3); // 3 seconds for Yellow
        
        // 3. Schedule Red and reset
        timerRef.current = setTimeout(() => {
          setActiveLight('red');
          setCountdown(0);
          setIsSimulating(false);
        }, 3000);
        
      }, durationSecs * 1000);
      
    } catch (error) {
      console.error('Failed to communicate with backend', error);
      alert('Error: Could not connect to API backend. Ensure it is running on port 8000.');
      setIsSimulating(false);
    }
  };

  const startCountdown = (secs) => {
    clearInterval(countdownIntervalRef.current);
    setCountdown(secs);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    // Cleanup timers on unmount
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(countdownIntervalRef.current);
    }
  }, []);

  return (
    <div>
      <h1 className="title">Smart Traffic Controller</h1>
      
      <div className="dashboard">
        <TrafficLight activeLight={activeLight} />
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <Controls 
            queueLength={queueLength}
            setQueueLength={setQueueLength}
            approachDensity={approachDensity}
            setApproachDensity={setApproachDensity}
            isSimulating={isSimulating}
            onStartSimulation={startSimulation}
          />
          
          <div className="status-panel">
            <h3>System Status</h3>
            {calculatedTime !== null ? (
              <div>
                <p>Calculated Green Time: <strong style={{color: '#e2e8f0'}}>{calculatedTime} seconds</strong></p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '15px' }}>
                  <span style={{color: '#94a3b8'}}>Phase: <strong style={{textTransform:'capitalize', color: activeLight==='red'?'#ef4444':activeLight==='yellow'?'#eab308':'#10b981'}}>{activeLight}</strong></span>
                  {countdown > 0 && <span className="status-value">{countdown}s</span>}
                </div>
              </div>
            ) : (
              <p>Ready to deploy AI simulation.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

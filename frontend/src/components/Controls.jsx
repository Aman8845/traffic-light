import React from 'react';

export default function Controls({ 
  queueLength, 
  setQueueLength, 
  approachDensity, 
  setApproachDensity, 
  isSimulating, 
  onStartSimulation 
}) {
  return (
    <div className="controls-card">
      <h2>Traffic Sensors</h2>
      
      <div className="control-group">
        <label>
          <span>Waiting Queue (Red Light)</span>
          <span>{queueLength} cars</span>
        </label>
        <input 
          type="range" 
          min="0" max="50" 
          value={queueLength} 
          onChange={(e) => setQueueLength(parseInt(e.target.value))}
          disabled={isSimulating}
        />
        <small style={{color: '#64748b'}}>Number of cars waiting at the currently red light.</small>
      </div>

      <div className="control-group">
        <label>
          <span>Approaching Traffic (Green Light)</span>
          <span>{approachDensity} cars/min</span>
        </label>
        <input 
          type="range" 
          min="0" max="50" 
          value={approachDensity} 
          onChange={(e) => setApproachDensity(parseInt(e.target.value))}
          disabled={isSimulating}
        />
        <small style={{color: '#64748b'}}>Traffic density of the road that gets the green light.</small>
      </div>

      <button 
        className="btn-simulate" 
        onClick={onStartSimulation}
        disabled={isSimulating}
      >
        {isSimulating ? 'Simulating...' : 'Calculate & Run Simulation'}
      </button>

    </div>
  );
}

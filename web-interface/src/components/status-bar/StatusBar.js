import React from 'react';
import './StatusBar.scss';

const StatusBar = (connections) => {
  return (
    <div className="component__status-bar">
      <div className="component__status-bar-entry">
        <div className={
          `component__status-bar-indicator ${connections.piConnected ? 'on' : 'off'}`}></div>
        <p>Pi Online</p>
      </div>
      <div className="component__status-bar-entry">
        <div className={
          `component__status-bar-indicator ${connections.socketConnected ? 'on' : 'off'}`}></div> 
        <p>Socket Connected</p>
      </div>
    </div>
  );
}

export default StatusBar;
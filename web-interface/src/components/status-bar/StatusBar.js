import React from 'react';
import './StatusBar.scss';

const StatusBar = (props) => {
  const { connection, setconnection } = props;

  return (
    <div className="component__status-bar">
      { connection.tries < connection.maxRetries
        ? null
        : <button type="button" className="component__status-bar-connect-btn" onClick={
          () => { setconnection({ ...connection, tries: -1 }) } }>Connect to Pi</button>
      }
      <div className="component__status-bar-entry">
        <div
          id="pi-online" 
          className={
            `component__status-bar-indicator ${connection.piConnected ? 'on' : 'off'}`}></div>
        <p>Pi Online</p>
      </div>
      <div className="component__status-bar-entry">
        <div className={
          `component__status-bar-indicator ${connection.socketConnected ? 'on' : 'off'}`}></div> 
        <p>Socket Connected</p>
      </div>
    </div>
  );
}

export default StatusBar;
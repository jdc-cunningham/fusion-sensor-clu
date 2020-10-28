import React, { useState, useEffect } from 'react';
import './LeftPanel.scss';
import StatusBar from '../../components/status-bar/StatusBar';
import axios from 'axios';

const LeftPanel = () => {
  const [connections, setConnections] = useState({
    piConnected: false,
    socketConnected: false
  });

  // tries to connect every second
  const connectToPi = () => {
    const piLocalIp = process.env.REACT_APP_PI_LOCAL_IP;
    
    if (!connections.piConnected) {
      setTimeout(() => {
        axios.get(
          piLocalIp,
          { timeout: 3000 }
          )
          .then((res) => {
            if (res.data === 200) {
              setConnections({
                ...connections,
                piConnected: true
              });
            }
          })
          .catch((err) => {
            connectToPi(); // keep trying can stop with max tries
          });
      }, 1000);
    } else {

    }
  };

  // on load try to establish connection by poll
  useEffect(() => {
    connectToPi();
  }, []);

  return (
    <div className="layout__left-panel">
      <StatusBar connections={connections} />
    </div>
  );
}

export default LeftPanel;
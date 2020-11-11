import React, { useState, useEffect } from 'react';
import './LeftPanel.scss';
import StatusBar from '../../components/status-bar/StatusBar';
import SweepSample from '../../components/data-gathering/sweep-sample/SweepSample';
import FullSweep from '../../components/data-gathering/full-sweep/FullSweep';
import axios from 'axios';

const LeftPanel = () => {
  const [connection, setconnection] = useState({
    piConnected: false,
    socketConnected: false,
    tries: 0,
    maxRetries: 10,
    socket: null,
  });

  // tries to connect every second
  const connectToPi = () => {
    const piLocalIp = process.env.REACT_APP_PI_LOCAL_IP_PORT;
    
    if (!connection.piConnected) {
      if (connection.tries < connection.maxRetries) {
        axios.get(
          `http://${piLocalIp}`,
          { timeout: 3000 }
          )
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              setconnection({
                ...connection,
                piConnected: true
              });
            }
          })
          .catch((err) => {
            setconnection({
              ...connection,
              tries: connection.tries += 1
            });
            setTimeout(() => {
              connectToPi(); // keep trying can stop with max tries
            }, 1000);
          });
      } else {
        alert('Max connection retries reached');
      }
    }
  };

  // on load try to establish connection by poll
  useEffect(() => {
    connectToPi();
  }, []);

  useEffect(() => {
    if (connection.tries === -1) { // technically adds an extra try
      connectToPi(); // try again from connect btn
    }
  }, [connection.tries]);

  // try to connect to websocket, this only happens once here due to redundant code, handled in dpad
  useEffect(() => {
    if (connection.piConnected) {
      const piSocketIp = process.env.REACT_APP_PI_SOCKET_IP_PORT;
      const piSocket = new WebSocket(`ws://${piSocketIp}`);

      piSocket.onopen = (event) => {
        setconnection({
          ...connection,
          socketConnected: true,
          socket: piSocket
        })
      };
    }
  }, [connection.piConnected]);

  return (
    <div className="layout__left-panel">
      <StatusBar
        connection={connection}
        setconnection={setconnection}
      />
      <SweepSample connection={connection} />
      <FullSweep connection={connection} />
    </div>
  );
}

export default LeftPanel;
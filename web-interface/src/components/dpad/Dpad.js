import React, { useState, useEffect } from 'react';
import './Dpad.scss';
// can just use one rotate these
import ChevronLeft from '../../assets/icons/uxwing-chevron-left.svg';
import ChevronRight from '../../assets/icons/uxwing-chevron-right.svg';
import ChevronDown from '../../assets/icons/uxwing-chevron-down.svg';
import ChevronUp from '../../assets/icons/uxwing-chevron-up.svg';
import axios from 'axios';

const Dpad = () => {

  // I can't think of a global/re-usable state manager at the moment
  // will build with servos in mind
  // for the visuals I think sliders would be nice so can immediatley see the intent
  // ability to center, set initial states

  const [increment, setIncrement] = useState(10); // in the future can change eg. 5
  const [panServoPos, setPanServoPos] = useState(105); // 0 - 180, 90 is expected, manualy set per device
  const [tiltServoPos, setTiltServoPos] = useState(88);
  const [piSocket, setPiSocket] = useState(false)

  // redundant/bad code since connection state not shared between panels
  const connectedToPi = () => document.getElementById('pi-online').classList.contains('on');

  const handleClick = (dir) => {
    switch (dir) {
      case 'left':
        updatePan('left');
        break;
      case 'right':
        updatePan('right');
        break;
      case 'down':
        updateTilt('down');
        break;
      case 'up':
        updateTilt('up');
        break;
    }
  }

  const updatePan = (dir) => {
    if (dir === 'left') {
      if (panServoPos - increment >= 0) {
        setPanServoPos(panServoPos - increment);
      } else {
        alert('Max range');
      }
    } else {
      if (panServoPos + increment <= 180) {
        setPanServoPos(panServoPos + increment);
      } else {
        alert('Max range');
      }
    }
  }

  const updateTilt = (dir) => {
    if (dir === 'up') {
      if (tiltServoPos - increment >= 0) {
        setTiltServoPos(tiltServoPos - increment);
      } else {
        alert('Max range');
      }
    } else {
      if (tiltServoPos + increment <= 180) {
        setTiltServoPos(tiltServoPos + increment);
      } else {
        alert('Max range');
      }
    }
  }

  const piComMoveServo = (servo, pos) => {
    console.log(connectedToPi());
  }

  const connectToPiSocket = () => {
    const piSocket = new WebSocket(`ws://${process.env.REACT_APP_PI_SOCKET_IP_PORT}`);

    piSocket.onopen = (event) => {
      console.log('dpad connected');
      // center servos on refresh
      piSocket.send(`p_${panServoPos}`);
      piSocket.send(`t_${tiltServoPos}`);
      setPiSocket(piSocket);
    };

    piSocket.onmessage = (event) => {
      console.log('msg from piSocket:', event);
    };
  }

  const updateIncrement = (event) => {
    const newIncr = event.target.value;
    if (newIncr > 90) {
      alert('exceeded max increment of 90 deg');
    } else {
      setIncrement(newIncr);
    }
  }

  useEffect(() => {
    if (piSocket) {
      piSocket.send(`p_${panServoPos}`);
    }
  }, [panServoPos]);

  useEffect(() => {
    if (piSocket) {
      piSocket.send(`t_${tiltServoPos}`);
    }
  }, [tiltServoPos]);

  // redundant code
  useEffect(() => {
    connectToPiSocket();
  }, []);

  return (
    <div className="component__dpad">
      {/* this is lazy */}
      <div className="component__dpad-settings">
        increment:
        <input className="dpad-settings__increment" type="number" onChange={ (e) => updateIncrement(e) } value={increment} />
        deg
      </div>
      <div className="component__dpad-top">
        <button
          type="button"
          className="component__dpad-top-button dpad-button"
          onClick={ () => handleClick('up') }>
          <img src={ ChevronUp } alt="up arrow"/>
        </button>
      </div>
      <div className="component__dpad-middle">
        <button
          type="button"
          className="component__dpad-left-button dpad-button"
          onClick={ () => handleClick('left') }>
          <img src={ ChevronLeft } alt="left arrow"/>
        </button>
        <div className="component__dpad-display">
          { `pan pos ${panServoPos} tilt pos ${tiltServoPos}` }
        </div>
        <button
          type="button"
          className="component__dpad-right-button dpad-button"
          onClick={ () => handleClick('right') }>
          <img src={ ChevronRight } alt="right arrow"/>
        </button>
      </div>
      <div className="component__dpad-bottom">
        <button
          type="button"
          className="component__dpad-bottom-button dpad-button"
          onClick={ () => handleClick('down') }>
          <img src={ ChevronDown } alt="down arrow"/>
        </button>
      </div>
    </div>
  );
}

export default Dpad;
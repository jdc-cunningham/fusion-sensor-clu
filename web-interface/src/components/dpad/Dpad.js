import React, { useState, useEffect } from 'react';
import './Dpad.scss';
// can just use one rotate these
import ChevronLeft from '../../assets/icons/uxwing-chevron-left.svg';
import ChevronRight from '../../assets/icons/uxwing-chevron-right.svg';
import ChevronDown from '../../assets/icons/uxwing-chevron-down.svg';
import ChevronUp from '../../assets/icons/uxwing-chevron-up.svg';

const Dpad = () => {

  // I can't think of a global/re-usable state manager at the moment
  // will build with servos in mind
  // for the visuals I think sliders would be nice so can immediatley see the intent
  // ability to center, set initial states

  const [increment, setIncrement] = useState(1); // in the future can change eg. 5
  const [panServoPos, setPanServoPos] = useState(90); // 0 - 180
  const [tiltServoPos, setTiltServoPos] = useState(90);

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
      if (panServoPos - 1 >= 0) {
        setPanServoPos(panServoPos - 1);
      } else {
        alert('Max range');
      }
    } else {
      if (panServoPos + 1 <= 180) {
        setPanServoPos(panServoPos + 1);
      } else {
        alert('Max range');
      }
    }
  }

  const updateTilt = (dir) => {
    if (dir === 'down') {
      if (tiltServoPos - 1 >= 0) {
        setTiltServoPos(tiltServoPos - 1);
      } else {
        alert('Max range');
      }
    } else {
      if (tiltServoPos + 1 <= 180) {
        setTiltServoPos(tiltServoPos + 1);
      } else {
        alert('Max range');
      }
    }
  }

  return (
    <div className="component__dpad">
      {/* this is lazy */}
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
import React, { useState, useEffect } from 'react';
import ThreeJsVisualizer from '../../three-js-visualizer/ThreeJsVisualizer.js';
import './FullSweep.scss';

const FullSweep = (props) => {

  const { socket, socketConnected } = props.connection;
  const [panRanges, setPanRanges] = useState({
    min: -10, // max either direction should be 30
    max: 10
  });
  const [tiltRanges, setTiltRanges] = useState({
    min: -10,
    max: 10
  });
  const [increment, setIncrement] = useState(10);
  const [meshValues, setMeshValues] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [delay, setDelay] = useState(500); // default is 0.5sec

  const handleValueUpdate = (field, newValue, which) => {
    console.log(newValue);
    if (field === 'pan') {
      if (which === 'min') {
        setPanRanges((prevState) => ({
          min: newValue,
        }));
      } else {
        setPanRanges((prevState) => ({
          max: newValue,
        }));
      }
    }

    if (field === 'tilt') {
      if (which === 'min') {
        setTiltRanges((prevState) => ({
          min: newValue,
        }));
      } else {
        setTiltRanges((prevState) => ({
          max: newValue,
        }));
      }
    }

    if (field === 'increment') {
      setIncrement(newValue);
    }

    if (field === 'delay') {
      setDelay(newValue);
    }
  }

  // duplicate code can be utility
  const servoCharMap = (servo) => (servo === "pan" ? "p" : "t");

  const addZeros = (servoInc) => {
    const servoIncStr = servoInc.toString();
    const servoIncLen = servoIncStr.length;
    if (servoIncLen >= 2) {
      if (servoIncStr.indexOf('-') !== -1) {
        return servoIncStr[0] + '0' + servoIncStr.substr(1, servoIncLen);
      }
      return '0' + servoInc;
    }

    if (servoIncLen === 1) {
      return '00' + servoInc;
    }

    // any other values probably invalid
  }

  const sendCmd = () => {
    // 0 padding is for known lengths/cmd position as parsing through each char, it's ugly
    // cmd pattern sample: s_p-010,010_t-010,010_i010_500
    // this pattern is terrible, I'm having to parse char individually
    if (socketConnected) {
      // space is for sign
      const cmdStr = `s_p${addZeros(panRanges.min)},${addZeros(panRanges.max)}_t${addZeros(tiltRanges.min)},${addZeros(tiltRanges.max)}_i${addZeros(increment)}_${delay}`;
      console.log(cmdStr);
      socket.send(cmdStr)
    }
  }

  const generateMesh = () => {
    /**
     * there is no callback from the Arduino side yet and in the end the servos have no external position feedback anyway
     * the intent would be to make sure the servo/sensor assembly is done moving before getting a measurement
     * at the moment just assumed within a second(per increment) it's done moving
     * the increment values here divided by 60 deg(max pan/tilt travel) are multiplied against seconds to consider it done
     * the python side collects data as the Arduino code sweeps and this data is written to a file
     * after a certain time the data is collected(file read) and exposed to pi web server
     * then pulled into web interface and the math is done/threejs rendered
     * this is clunky I realize but trying to do websockets in python/mixing python versions while possible was not on my priority to deal with
     * the robot in the end will do all of this on the pi/in memory but will also have this data output for tracking/visualizing
     * the world the robot sees/maps
     */

    setInProgress(true);

    // sample command string: s_p-20,20_t-10,30_i10_1000
    // sweep, pan range, tilt range, increment, increment delay in ms

    // determine delay to wait and set timeout then call cmd

    sendCmd();
  }

  return (
    <div className="component__full-sweep">
      <h2 className="full-sweep-title">Full sweep</h2>
      <div className="full-sweep-wrapper">
        <span className="full-sweep-wrapper-row">
          pan range
          <input type="number" min="-30" value={panRanges.min}
            onChange={(e) => handleValueUpdate('pan', e.target.value, 'min')} />
          deg,
          <input type="number" max="30" value={panRanges.max}
            onChange={(e) => handleValueUpdate('pan', e.target.value, 'max')} />
        </span>
        <span className="full-sweep-wrapper-row">
          tilt range
          <input type="number" min="-30" value={tiltRanges.min}
            onChange={(e) => handleValueUpdate('tilt', e.target.value, 'min')} />
          deg,
          <input type="number" max="30" value={tiltRanges.max}
            onChange={(e) => handleValueUpdate('tilt', e.target.value, 'max')} />
        </span>
        <span className="full-sweep-wrapper-row">
          increment
          <input type="number" min="1" max="30" value={increment}
            onChange={(e) => handleValueUpdate('increment', e.target.value)} />
          delay
          <input className="full-sweep-delay-input" type="number" min="1" value={delay}
            onChange={(e) => handleValueUpdate('delay', e.target.value)} />
        </span>
        <span className="full-sweep-wrapper-row">
          {
            !meshValues ? <button className="full-sweep-run-btn" type="button"
              disabled={!socketConnected || inProgress}
              onClick={ () => generateMesh() }>Run sweep</button>
              : <ThreeJsVisualizer values={meshValues} />
          }
        </span>
      </div>
    </div>
  )
}

export default FullSweep;
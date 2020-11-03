import React, { useState, useEffect } from 'react';
import './SweepSample.scss';

const SweepSample = (props) => {
  const { connection } = props;

  // skipping validation for now, trying to get to fully functioning thing with plot

  const [increment, setIncrement] = useState(1); // deg
  const [delay, setDelay] = useState(500); // ms units, servos have base 1s delay on Arduino side
  const [servo, setServo] = useState("pan");

  const servoCharMap = (servo) => (servo === "pan" ? "p" : "t");

  const addZeros = (servoInc) => {
    const servoIncLen = servoInc.toString().length;
    if (servoIncLen === 2) {
      return '0' + servoInc;
    }

    if (servoIncLen === 1) {
      return '00' + servoInc;
    }

    // any other values probably invalid
  }

  const sendCmd = () => {
    // cmd pattern sample: s179t1000 or s179p1000 -> sweep cmd, increment 000, servo, delay in ms
    // this pattern is terrible, I'm having to parse char individually
    console.log(connection.socketConnected, connection.socket);
    if (connection.socketConnected) {
      const cmdStr = `s${addZeros(increment)}${servoCharMap(servo)}${delay}`;
      console.log(cmdStr);
      connection.socket.send(cmdStr)
    }
  }

  // useEffect(() => {
  //   connection.socket.onopen = (event) => {

  //   };
  // }, [connection.socket]);

  return (
    <div className="component__sweep-sample">
      <button
        className="sweep-sample-btn"
        disabled={ !connection.socketConnected }
        onClick={() => sendCmd()}>Run Sweep</button>
      <p>select servo</p>
      <select onChange={ (e) => setServo(e.target.value) } value={servo}>
        <option value="pan">pan</option>
        <option value="tilt">tilt</option>
      </select>
      <p>increment</p>
      <input type="number" value={increment} min="1" onChange={ (e) => setIncrement(e.target.value) }/>
      <p>(deg) delay</p>
      <input type="number" value={delay} min="1" onChange={ (e) => setDelay(e.target.value) } className="sweep-sample-delay"/>
      <p>(ms)</p>
    </div>
  );
}

export default SweepSample;
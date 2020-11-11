import React, { useState, useEffect } from 'react';
import ThreeJsVisualizer from '../../three-js-visualizer/ThreeJsVisualizer.js';
import './FullSweep.scss';

const FullSweep = (props) => {

  const { socketConnected } = props.connection;

  console.log(props);

  const [panRanges, setPanRanges] = useState({
    min: -30,
    max: 30
  });

  const [tiltRanges, setTiltRanges] = useState({
    min: -30,
    max: 30
  });

  const [increment, setIncrement] = useState(10);

  const [meshValues, setMeshValues] = useState(false);

  const [inProgress, setInProgress] = useState(false);

  const handleValueUpdate = (field, newValue, which) => {
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
        </span>
        <span className="full-sweep-wrapper-row">
          {
            !meshValues ? <button className="full-sweep-run-btn" type="button"
              disabled={!socketConnected || inProgress}>Run sweep</button>
              : <ThreeJsVisualizer values={meshValues} />
          }
        </span>
      </div>
    </div>
  )
}

export default FullSweep;
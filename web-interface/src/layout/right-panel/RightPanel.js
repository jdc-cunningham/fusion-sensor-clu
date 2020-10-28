import React from 'react';
import './RightPanel.scss';
import CameraOutput from '../../components/camera-output/CameraOutput';
import Dpad from '../../components/dpad/Dpad';

const RightPanel = () => {
  return (
    <div className="layout__right-panel">
      <CameraOutput />
      <Dpad />
    </div>
  );
}

export default RightPanel;
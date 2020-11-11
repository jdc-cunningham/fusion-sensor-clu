import React, { useEffect } from 'react';
import './ThreeJsVisualizer.scss';

const ThreeJsVisualizer = (props) => {
  const { coordinates } = props;

  const renderThreejs = (threejsCoordinates) => {
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    scene.background = new THREE.Color( 0xffffff );
    
    renderer.setSize(window.innerWidth, window.innerHeight); // add false for lower resolution after dividing x/y values
    document.getElementById('threejs-container').appendChild(renderer.domElement);

    // add orbit controls
    const controls = new THREE.OrbitControls( camera, renderer.domElement );
    const axesHelper = new THREE.AxesHelper(15);
    // const controls = new OrbitControls( camera, renderer.domElement );

    // add axes helper
    // x = red, y = green, z = blue
    scene.add(axesHelper);

    // add grid overlay
    const size = 10;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    controls.update();

    function animate() {
      requestAnimationFrame( animate );

      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update();
      renderer.render( scene, camera );
    }

    // camera
    camera.position.set( 0, 0, 100 );
    camera.lookAt( 0, 0, 0 );

    // line material
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // working code
    // vertices
    let points = [];

    // plot lines from points
    threejsCoordinates.map((row, index) => {
      row.map((measurement, rowIndex) => {
        points.push(new THREE.Vector3( measurement[0], measurement[1], measurement[2] ));
      })

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const line = new THREE.Line( geometry, material );

      scene.add(line);

      points = [];
    });

    renderer.render(scene, camera);
    animate();
  }

  const get3dCoordinates = (inclineAngle, sweepAngle, measurement, flip) => {
    const xCoord = measurement * Math.sin(sweepAngle);
    const yCoord = inclineAngle === 0 ? 0 : (measurement * Math.cos(inclineAngle) * (flip ? -1 : 1));
    const zCoord = measurement * Math.cos(sweepAngle);
    return [xCoord, yCoord, zCoord];
  };

  const angleMap = [
    -10,
    0,
    10,
  ];

  useEffect(() => {
    console.log(coordinates);
    const coordinatesArr = Object.keys(coordinates).map(key => coordinates[key]);
    const threejsCoordinates = coordinatesArr.map((row, index) => {
      console.log(row);
      return row.map((measurement, rowIndex) => get3dCoordinates(
        angleMap[index],
        angleMap[rowIndex],
        measurement,
         index > 1,
      ));
    });

    renderThreejs(threejsCoordinates);
  });

  return (
    <div id="threejs-container" className="component__three-js-visualizer"></div>
  )
}

export default ThreeJsVisualizer;
import React, { useEffect } from 'react';
import './ThreeJsVisualizer.scss';
import generateMeshCoordinates from './ThreeJsVisualizerUtils.js';

const ThreeJsVisualizer = (props) => {
  const { coordinates } = props;

  const renderThreeJs = (threejsCoordinates) => {
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
    threejsCoordinates["10"].map((row, index) => { // tmp
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

  useEffect(() => {
    console.log(coordinates);
    const coordinatesArr = Object.keys(coordinates).map(key => coordinates[key]);
    // const threejsCoordinates = coordinatesArr.map((row, index) => {
    //   return row.map((measurement, rowIndex) => get3dCoordinates(
    //     angleMap[index],
    //     angleMap[rowIndex],
    //     measurement,
    //      index > 1,
    //   ));
    // });

    // const threeJsCoordinates = generateMeshCoordinates(coordinates, 10);

    const threeJsCoordinates = generateMeshCoordinates({
      "10": [22.67, 22.34, 22.67],
      "0": [22.34, 22, 22.34],
      "-10": [22.67, 22.34, 22.67]
    }, 10);

    renderThreeJs(threeJsCoordinates);
  });

  return (
    <div id="threejs-container" className="component__three-js-visualizer"></div>
  )
}

export default ThreeJsVisualizer;
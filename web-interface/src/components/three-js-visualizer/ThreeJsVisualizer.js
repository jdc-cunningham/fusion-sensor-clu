import React, { useEffect } from 'react';
import './ThreeJsVisualizer.scss';
import generateMeshCoordinates from './ThreeJsVisualizerUtils.js';

const ThreeJsVisualizer = (props) => {
  const { coordinates } = props;

  const renderThreeJs = (threeJsCoordinates) => {
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    scene.background = new THREE.Color( 0xffffff );

    // terrible non-react use a ref or other way to clear dom
    document.getElementById('threejs-container').innerHTML = '';
    
    renderer.setSize(window.innerWidth, window.innerHeight); // add false for lower resolution after dividing x/y values
    document.getElementById('threejs-container').appendChild(renderer.domElement);

    // add orbit controls
    const controls = new THREE.OrbitControls( camera, renderer.domElement );
    const axesHelper = new THREE.AxesHelper(15);

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

    // sort by tilt angle
    const tiltAngles = [];

    Object.keys(threeJsCoordinates).forEach((tilt) => {
      tiltAngles.push(parseInt(tilt));
    });

    tiltAngles.sort();

    tiltAngles.forEach((tilt) => {
      threeJsCoordinates[tilt].forEach((xyzCoordinates) => {
        console.log(xyzCoordinates);
        points.push(new THREE.Vector3(xyzCoordinates[0], xyzCoordinates[1], xyzCoordinates[2]));
      });
    });

    const meshGeometry = new THREE.ConvexGeometry( points ); // points = vertices array
    const mesh = new THREE.Mesh(meshGeometry, material);
    scene.add(mesh);
    points = [];

    renderer.render(scene, camera);
    animate();
  }

  useEffect(() => {
    const threeJsCoordinates = generateMeshCoordinates(coordinates); // 10 has to come from UI
    renderThreeJs(threeJsCoordinates);
  });

  return (
    <div id="threejs-container" className="component__three-js-visualizer"></div>
  )
}

export default ThreeJsVisualizer;
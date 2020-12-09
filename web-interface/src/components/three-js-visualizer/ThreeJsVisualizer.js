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

    // to make distinguishable panels, will eventually add a nice color pallete/ranging
    const getRandomHex = () => {
      // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
      var result           = '';
      var characters       = 'abcdef0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < 6; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return parseInt(`0x${result}`, 16);
    }

    console.log(coordinates);

    const coordinateSets = threeJsCoordinates;
    const step = 1;
    const coordinateSetKeys = Object.keys(coordinateSets).sort();
    let points = [];
    let material = new THREE.LineBasicMaterial({ color: getRandomHex() });
    let meshGeometry;
    let meshMaterial;
    let mesh;

    const getNeighborCoordinates = (rowCoordinates, nextRowKey, colIndex, step) => {
      return [
        rowCoordinates[colIndex],
        rowCoordinates[colIndex + step],
        coordinateSets[nextRowKey][colIndex],
        coordinateSets[nextRowKey][colIndex + step]
      ];
    };

    coordinateSetKeys.forEach((coordinateSetKey, rowIndex) => {
      coordinateSets[coordinateSetKey].forEach((coordinate, colIndex) => {
        if (rowIndex < coordinateSetKeys.length - 1 && colIndex < coordinateSets[coordinateSetKey].length - step) {
          const panelPointsFromCoordinates = getNeighborCoordinates(coordinateSets[coordinateSetKey], coordinateSetKeys[rowIndex + 1], colIndex, step);
          panelPointsFromCoordinates.forEach((panelPoint) => {
            points.push(new THREE.Vector3(panelPoint[0], panelPoint[1], panelPoint[2]));
          });
          material = new THREE.LineBasicMaterial({ color: getRandomHex() });
          meshGeometry = new THREE.ConvexGeometry( points ); // points = vertices array
          mesh = new THREE.Mesh(meshGeometry, material);
          scene.add(mesh);
          points = [];
        }
      });
    });


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
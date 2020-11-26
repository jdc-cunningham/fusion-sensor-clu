const generateMeshCoordinates = (cluMeasurements, increment) => {
  // coordinate system is x, y, z where z faces user

  // sweep goes from top-left to top-right
  // A B C
  // D E F
  // G H I

  // end result will be four planes/meshes comprised of:
  // A  B   B  C
  //
  // D  E   E  F
  // 
  // D  E   E  F
  //
  // G  H   H  I

  // key is the tilt angle, values are at sweep
  // center is not skipped and measurements are mirrored so values are in pattern of 3, 5, 7, etc...
  // const sampleCluSensorValues = {
  //   "10": [22.67, 22.34, 22.67],
  //   "0": [22.34, 22, 22.34],
  //   "-10": [22.67, 22.34, 22.67]
  // };

  // https://www.w3resource.com/javascript-exercises/javascript-math-exercise-33.php
  const degreesToRadians = (degrees) => {
    const pi = Math.PI;
    return degrees * (pi/180);
  }

  const getXCoordinate = (sweepAngle, distance) => {
    const distanceRadians = degreesToRadians(Math.abs(parseInt(sweepAngle)));
    const xCoordinate = parseFloat((distance * Math.sin(distanceRadians)).toFixed(2));
    return sweepAngle > 0
      ? xCoordinate
      : xCoordinate * -1;
  }

  const getYCoordinate = (tiltAngle, distance) => {
    const distanceRadians = degreesToRadians(Math.abs(parseInt(tiltAngle)));
    const yCoordinate = parseFloat((distance * Math.sin(distanceRadians)).toFixed(2));
    return tiltAngle > 0
      ? yCoordinate
      : yCoordinate * -1;
  }

  const getZCoordinate = (sweepAngle, distance) => {
    const distanceRadians = degreesToRadians(Math.abs(parseInt(sweepAngle)));
    return parseFloat((distance * Math.cos(distanceRadians)).toFixed(2));
  }

  // end result would be a plottable plane
  // @param {object} cluSensorMEeasurements - object with tilt angle as key and
  // array of sweep sample ToF measurements
  // @param {int} increment - increment angle, should match tilt
  const getCoordinates = (cluSensorMeasurements, increment) => {
    const meshCoordinateSets = {}; // use object to force order
    const sweepAngles = Array.from(Object.keys(cluSensorMeasurements).map(tiltAngle => parseInt(tiltAngle))).sort();
    
    Object.keys(cluSensorMeasurements).forEach((tilt) => {
      const tiltAngle = parseInt(tilt);
      const sweepMeasurements = cluSensorMeasurements[tilt];
      const sweepMidpointValue = (Math.floor(sweepMeasurements.length/2));
      const innerMeshSet = [];
      
      sweepMeasurements.forEach((measurement, index) => {
        innerMeshSet.push([
          getXCoordinate(sweepAngles[index], measurement),
          getYCoordinate(tilt, measurement),
          getZCoordinate(sweepAngles[index], measurement)
        ]);
      });
      
      meshCoordinateSets[tilt] = [...innerMeshSet, [...innerMeshSet[0]]]; // first copy closes mesh
    });
    
    return meshCoordinateSets;
  }

  getCoordinates(cluMeasurements, increment);
}

export default generateMeshCoordinates;
// sample coordiantes facing a wall
// 10 - [39.86, 33.91, 34.12, 33.91, 33.87, 34.11, 34.25, 34.59, 34.47, 35.24, 35.68, 39.99, 41.19]
// 0 - [24.38, 34.18, 33.98, 34.19, 33.99, 34.29, 34.15, 34.35, 34.66, 34.89, 39.42, 39.49, 39.63]
// -10 - [35.44, 34.29, 34.07, 34.45, 34.08, 34.25, 34.25, 34.35, 34.81, 35.79, 39.71, 40.01, 39.86]
// -20 - [40.24, 34.72, 34.97, 34.5, 34.84, 34.99, 34.71, 34.82, 35.44, 39.61, 40.73, 40.45, 41.13]

// inclineAngle - abs value
// sweepAngle 
// inches
// flip in case of values measured below sensor horizon
// x, y, z coordinate system where z faces user
const get3dCoordinates = (inclineAngle, sweepAngle, measurement, flip) => {
	const xCoord = Math.sin(sweepAngle) * measurement;
  const yCoord = Math.sin(inclineAngle) * measurement * (flip ? -1 : 1);
  const zCoord = Math.cos(sweepAngle) * measurement;
  return [xCoord, yCoord, zCoord];
};

// since pan/tilt ranges limited by 30 deg in either dir
const angleMap = [
  10,
  0,
  10,
  20,
];

// center, center of pan, tilt is technically 0,0 but it is above the horizon regarding the sensor/robot position
const measuredCoordinates =  [
  [39.86, 33.91, 34.12, 33.91, 33.87, 34.11, 34.25, 34.59, 34.47, 35.24, 35.68, 39.99, 41.19], // 10 deg
  [24.38, 34.18, 33.98, 34.19, 33.99, 34.29, 34.15, 34.35, 34.66, 34.89, 39.42, 39.49, 39.63], // 0 deg
  [35.44, 34.29, 34.07, 34.45, 34.08, 34.25, 34.25, 34.35, 34.81, 35.79, 39.71, 40.01, 39.86], // -10 deg
  [40.24, 34.72, 34.97, 34.5, 34.84, 34.99, 34.71, 34.82, 35.44, 39.61, 40.73, 40.45, 41.13], // -20 deg
];

const coordinates = measuredCoordinates.map((row, index) => {
  return row.map((measurement, rowIndex) => get3dCoordinates(
    angleMap[index],
    angleMap[rowIndex],
    measurement,
   	index > 3,
  ));
});

/* console.log(coordinates.join(",")); */
console.log(coordinates);
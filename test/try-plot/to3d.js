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
	30,
  20,
  10,
  0,
  10,
  20,
  30
];

const measuredCoordinates =  [
  [17.62, 36.23, 58.89, 44.22, 59.2, 58.88, 54.89, 17.99, 18.13, 17.65, 18.2, 17.78, 18.01], // 30
  [17.5, 18.11, 17.7, 17.89, 17.52, 17.36, 17.39, 17.52, 17.58, 17.41, 17.33, 17.33, 17.55], // 20
  [17.39, 17.39, 17.57, 17.8, 17.45, 17.6, 17.2, 17.39, 17.22, 17.22, 17.05, 17.39, 17.35], // 10 deg
  [17.31, 17.67, 17.51, 17.54, 17.47, 17.38, 18.28, 17.26, 17.31, 17.33, 17.33, 17.45, 17.27], // 0 deg
  [17.46, 17.98, 17.91, 17.76, 17.6, 17.6, 17.6, 17.76, 17.62, 17.58, 17.39, 17.42, 17.63], // what to do with these "negative degrees"
  [17.85, 18.06, 18.16, 18.39, 18.16, 18.0, 18.18, 18.07, 17.99, 17.87, 17.86, 17.86, 18.03],
  [19.15, 133.03, 132.53, 132.63, 132.7, 20.73, 20.06, 19.08, 19.01, 18.82, 18.75, 18.83, 18.84] // this angle too steep until mounted to frame
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

// add to end \r\n
let pasteCsv = "";

const xSet = [];
const ySet = [];
const zSet = [];

measuredCoordinates.forEach((row, index) => {
  row.forEach((measurement, rowIndex) => {
  	const coordinateSet = get3dCoordinates(
      angleMap[index],
      angleMap[rowIndex],
      measurement,
      index > 3
    );
    xSet.push(coordinateSet[0]);
    ySet.push(coordinateSet[1]);
    zSet.push(coordinateSet[2]);
  });
});

console.log(xSet);
console.log(ySet);
console.log(zSet);

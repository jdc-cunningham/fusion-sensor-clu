### Pan/tilt sampling

I've been stuck on this for a while just because it doesn't look right on ThreeJS.
Maybe I'm getting the right values but I'm not plotting them in the right order.
I should be seeing a plane which I have plotted before with test coordinates.

I'm cheating with 3D modeling vs. raw math to visually view stuff/get coordinates.

This is a visual example of a 10 deg sample at [10, 0, -10] tilt samples with [10, 0, -10] deg pan samples per tilt angle.

![sketchup mock of 10 deg pan tilt sample](./repo-images/sketchup-10deg-10deg-10deg-sample.png)

The red is the plane that should get plotted in ThreeJS.

Each vertice of the polygon is an ultrasonic/lidar sample distance. The vertice length for each side of the "pyramid" is 22.67" which the center one is 22"

I have written math for this already/prototyped it in JS fiddle. It's a mix of sine/cosine.

This is the set of coordinates grabbed from sketchup that my function should generate.

Coordinate system is [x, y, z] z being red axis in image

Units in inches(sorry metric people)

```
[-3.88, 3.88, 0], [0, 3.88, 0], [3.88, 3.88, 0]
[-3.88, 0, 0], [0, 0, 0], [3.88, 0, 0]
[-3.88, -3.88, 0], [0, -3.88, 0], [3.88, -3.88, 0]
```

function is of the form `function getCoordinates(distance, sweep, tilt)`


### These have to be done for it to work
- [ ] Vision
  - [ ] process that can find/draw bounds around everything
  - [ ] ability to target the sensor bed at something and hit it due to the offset from cam/sensor bed center points
- [ ] World coordinate system
  - [ ] store the points
  - [ ] rotate them as the robot moves from IMU data
- [ ] IMU interface
  - [ ] have to get accel, position, rotation, etc... and plug into world coordinate system
  - [ ] determine no longer moving
  - [ ] heading hold regarding servo speed differential
- [ ] Control robot
  - [ ] this should be easy once the above is met, just tells the robot to stop/go/turn

### Future
- [ ] object recognition
  - right now the bounds are basic boxes, but if viewed from other angles should be able to tell it's the same thing seen before
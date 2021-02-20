- [ ] Robot on
- [ ] Turn system logging on(threads/imu)
  - [ ] IMU data sampled by ADC via thread with interrupts
- [ ] Camera takes initial image of environment
  - [ ] OpenCV processing
    - do 2D histogram
    - do contour bounding box and iterate through samples
    - determine box locations
- [ ] do physical samples
  - based on samples above do measurements
  - store/emit
- [ ] Initialize 3D world
  - based on values/points above setup world with robot at center
- [ ] Move/update 3D world
  - do point translation/kinematics/collision detection

end goal is to navigate my entire apartment eg. 5 "rooms" and 1 hallway

### Nice to have features
- [ ] light detection/in relation to 2D HSV histogram
- [ ] basic object recognition after tagging element for updating map "seen it before"
  - particularly since initially will just do lazy approach of "everything is a cube"

### Main tests
- [ ] should be able to tell a wall
  - flat
  - corner
    - away/towards
- [ ] basic boxes
- [ ] complex shapes like a plastic bag
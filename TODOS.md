- ### updates
  - [ ] dpad
    - [ ] add bars/slider
    - [ ] add quick center
    - [ ] add setup of major/minor ticks eg. increment by 1 vs. 5
  - [ ] move servo code
    - [ ] add callback when seharvo is done moving, or add matching delay before buttons enabled/able to move again
      - callback from Arduino i2c probably better in case comm delay

- ### reminders
  - socket service user specified is pi to have access to smbus2

### 11/02/2020
- crash course in lobotomy
- time to perform my magic trick of making a rock absorb blood
  - super burnt
- [x] going to try a boosted single cell battery for the first time
  - damn I soldered first one backwards in polarity, magic smoke... glad I have several
  - working now pretty cool first 18650 cell this one is 3.4Ah
- [x] add real time increment input to adjust
- [x] will determine max pan/tilt ranges
- [x] add wrapper to servo calls in Arduino that checks against max pos
  - printing out write degrees is a good idea before actually talkign to servos turns out
    - sent in 5557 (deg) haha
- [ ] create first polling/measurement set that runs from web all the way down
- [ ] plot 3d points in webgl (may be tough have watched some videos, skimmed MDN tutorial)
- at this time I am super burnt so we'll see, I won't give up till I'm crying or something happens
- crap did a download for VS Code/suggested after opening ino file and now touchpad/keyboard doesn't work ha
- this thing is trash in the long run, does not reposition, no position callback(encoder), cross language calls... ehh
- hit a wall delay in dynamic loop is ignored so sweep doesn't work
- guhh still stuck, monkey brain me trying to pry the end of a battery, so it starts smoking/getting warm as the walls are crushed/making contact. I got lucky it didn't get worst, but I commemorate this project to the 18650 which I had to drain, send back to the underverse.
- wow... that was a time sync... dumb dumb dumb. So you're not supposed to call delay and serial and shit inside a handler for i2c... I think shared clocks or something... anyway I have to refactor my code then I am closer to getting the 3d coordinates and plotting them in webgl. After that bridging OpenCV as the primary "brain/driver" in conjunction with the physical measurements to generate essentially a slower/more piece of crap real time map from an RGBD camera... but... it's on a Pi Zero(kinda).
- so I kinda failed... I know what I have to do, have to rework the code so the events are flags, will look at [this i2c guide](https://forum.arduino.cc/index.php?topic=683181) so I can get data back from Arduino on demand if I need to

### 11/01/2020
- [x] try out node i2c
  - see if it works
    - stop systemd code
    - try node i2c examples, check serial monitor
      - had to add new lines to stuff
      - doesn't work... write runs, Arduino receives nothing, error callback happens but says null
      - did have problems with the gcc install stuff(paths/package don't exist)
  - try to use it with websocket so Arduino response goes back up to web interface
- [ ] other alternatives
  - get websocket to work in Python, issue is Python version mixing
- well... I think I'm done with messing around with that, I still have not gotten the hard part, there may be a minor disconnect between servo motion and reading sensor data but I can just do batch sweeping/waiting/assumptions. I still need to get to the actual hard parts of this project eg. the basic 3d mapping from image/physical sensor data sampling
- thought about using a "signal" wire for events, it would be get a start/end pulse from Arduino and read by the pi through ADC, but it would introduce a lot of complexity.
  - main reason may not be worth it is the servos don't have tracking so can only assume they're done moving
  - still having an end signal come from Arduino is something
- [ ] get panning points
  - add pan code
  - do intermittent sampling, issue is syncing commands between Arduino and Python without a bridge

### 10/29/2020
- ### web interface
  - [ ] get feedback from Arduino after servos move
    - just echoes back command, front end uses to decide if next commands can go
    - just occurred to me, I need to be continuously listening to the Pi i2c to get anything back from the Arduino
    - which more than likely means some kind of thread and regarding communication between websocket/web interface...
      - probably have to write the socket in python instead vs. node, then the i2c listener thread can be started and ping the websocket that's running in python
      - no need to figure out how to communicate between python/node in real  time
      - so... when reading i2c the servos twitch... looks like it's a known problem, had a thought. I can just read out variables stored in Arduino by calling it(down send i2c)
    
  - [ ] trigger camera and display photo
  - [ ] get measurements from us and lidar by button click

### 10/27/2020
- ### web interface
  - [x] basic layout
  - [x] add basic servo control input
      - arrows and display of value
  - [x] add pi online status
      - [x] make this not hardcoded, possibly scannable by front end
  - [x] add websocket connected status
- ### pi
  - [x] setup basic node websocket
  - [x] send controls to arduino by system calls to python scripts
- ### arduino
  - [x] make basic servo state manager
  - [x] add accept capability to command servo from i2c and set state
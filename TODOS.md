- ### updates
  - [ ] dpad
    - [ ] add bars/slider
    - [ ] add quick center
    - [x] add setup of major/minor ticks eg. increment by 1 vs. 5
      - only one input but variable
  - [ ] move servo code
    - [ ] add callback when seharvo is done moving, or add matching delay before buttons enabled/able to move again
      - callback from Arduino i2c probably better in case comm delay

- ### reminders
  - socket service user specified is pi to have access to smbus2

### 11/03/2020
- I think I may have a self-sustaining drive to finish this project now, where I will, "will" it into existence
  even if it's a piece of crap
- I'm thinking about how the scanner will work
  "brought to you by X1 Carbon 3rd gen" ha always wanted this laptop though I hate the left-most fn key
- scanning process, Arduino is still disconnected from Pi/Python in real time due to i2c interrupt being brief/prefer batching
  also ultimately any sort of "position/is-it-done" kind of stuff with a servo is pointless without a measurement eg. ADC on Pi side measuring spikes on servo by pot hack or something
  eg. quit using crayons and get a motor with an encoder or something
  - websocket sends command to sweep(x,y)
  - python code that talks to i2c to send simple string command sends command but also starts python sensor measurement gathering
    - all under pretense 1 second apart delays per servo motion or whatever delay sent down by websocket is honored(flaw)
  - the data is just stored, no math is performed
  - after the scan the math is performed to get the x,y,z coordinates for the 3d plotting from angle/arcs
  - these values will get read however the process is initiated from front end as part of parent event(sucks because socket is using node then talking to python)
    - some kind of bus between node/pyton I think is possible too, right now I'm using `exec` which is one directional in a full linux board at some point, the type that has mixed my use case
    - not impossible to use python socket but a PITA and having to mix python versions(also not impossible)
  - values received by webgl plotter on front end, then I can visualize it, ooh pretty the skewed piece of crap
  - next would be some world modeling/translation based on motion(IMU interface/attached to wheels)
- at some point will actually use OpenCV as the main driver
  - takes image
  - scans image for objects
  - do process above however with override to not sweep but pick specific points to probe or partially sweep
  - all based on the pan/tilt, camera fov, etc... in other words probably will suck, but once I have a full system can improve upon it
- I think I will use something like a Beaglebone in the future, try to keep the "language" a single stack, except for the web part, may go for desktop just for experience/learning
- added a `SCANNING_PROCESS.md` and `FUTURE.md`

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
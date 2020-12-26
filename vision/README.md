### Notes
- prioritize finding/scanning of nearest objects from an initial depth probe

- scanning process
  - [ ] do sensor sweep
    - anything in the way?
      - [ ] send command down from web(manual testing)
        - unfortunately no feedback from servo so just have to do some stepped sampling and  match pulses like us sensor
          concern is how fine(angle steps), since the farther away the larger the horizontal/vertical distances
  - take image
  - apply histograms/get bounds
  - point sensor bed to get measurements, hopefully hit targets
  - report to internal world coordinate system and to ThreeJS web interface

### ~~12/24/2020~~ 12/25/2020
~~I'm not as "fresh" as I'd like to be, I had to deal with some stuff hours ago. I'm hoping I can still be productive.
Been up about 5 hours already and between now and then have eaten... I usually try not to eat/only partake in caffeine to be "pure" optimal~~

Well... scratch that, wasted that day, here I am now next day. Already ate though.

I did have a thought, I should be able to just re-use the panning code from the ultrasonic sensor for lidar, just change the sensor call.
Need to establish some boundaries too. Robot dimensions 8.5" x 10" x 11" these are upwardly approximated.
Overall nothing is square, minor irregularities here and there... ideally that's fine. The device adapts/recalibrates.
Camera height when mounted on robot platform: 8.5"
Sensor bed center point height: 5" 5/8"

You know... I don't want to do this it turns out haha. But I gotta finish it.

I'm gonna focus on coming up with some kind of sampling algorithm. The depth probing is a way to narrow down what to look for that matters.
Since as a human you can easily be like "there's an object, there's an object" etc... but camera/pixels no idea what's what.
Can just do boundary detection/find blobs of things.


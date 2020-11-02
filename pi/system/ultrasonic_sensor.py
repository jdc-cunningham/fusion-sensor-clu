# sensor HC-SR04
# code sourced here
# https://thepihut.com/blogs/raspberry-pi-tutorials/hc-sr04-ultrasonic-range-sensor-on-the-raspberry-pi

import RPi.GPIO as GPIO
import time

class UltrasonicSensor:
  def __init__(self):
    self.unit = 'in'
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)
  
  # supports cm or in
  def set_unit(self, unit):
    if (unit == 'in' or unit == 'cm'):
      self.unit = unit
    else:
      raise ValueError('wrong unit')

  def get_measurement(self):
    TRIG = 27
    ECHO = 22

    GPIO.setup(TRIG, GPIO.OUT)
    GPIO.setup(ECHO, GPIO.IN)

    GPIO.output(TRIG, False)
    time.sleep(0.05)

    GPIO.output(TRIG, True)
    time.sleep(0.00001)
    GPIO.output(TRIG, False)

    while GPIO.input(ECHO) == 0:
      pulse_start = time.time()

    while GPIO.input(ECHO) == 1:
      pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start

    if (self.unit == 'in'):
      distance = pulse_duration * 17150 * 0.3937
    else:
      distance = pulse_duration * 17150

    distance = round(distance, 2)
    GPIO.cleanup()

    return distance

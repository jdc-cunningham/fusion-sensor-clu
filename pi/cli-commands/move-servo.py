# this code uses I2C and python cli args to move the servos in real time from a socket connection in node
# the I2C code referenced two tutorials, the python args referenced the last resource
# https://dronebotworkshop.com/i2c-arduino-raspberry-pi/
# https://www.aranacorp.com/en/communication-between-raspberry-pi-and-arduino-with-i2c
# https://stackoverflow.com/a/43234054/2710227

import os, sys, getpass, logging, time, json
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(CURRENT_DIR))

from smbus2 import SMBus
import time
from system.ultrasonic_sensor import *

addr = 0x8 # bus address, what does this mean
bus = SMBus(1) # indicates /dev/i2c-1

def ConvertStringToBytes(src):
  converted = []
  for b in src:
    converted.append(ord(b))
  return converted

def get_cli_args(name='default', first='servo', second='position'):
  return first, second

# intent is to write plain strings or json
def write_to_file(str):
  logging.info("write fcn")
  f = open("/home/pi/sensor-fusion-clu/pi/cli-commands/coordinates/values.txt", "w+") # dir set by systemd service
  f.write(str)
  f.close()

# @params {int} new angle
# @params {int} delay in ms, divide this by 2 for loop delay
def gather_sweep_measurements(incr, delay):
  usensor = UltrasonicSensor()
  cur_loop = 0
  measurements = []

  while cur_loop <= (60/incr): # double sample seems bad for us, maybe for lidar
    measurements.append(usensor.get_measurement())
    cur_loop += 1
    time.sleep((delay/2) * 0.001)

  write_to_file(json.dumps(measurements))

servo, pos = get_cli_args(*sys.argv)

bus.write_i2c_block_data(addr, 0x00, ConvertStringToBytes(servo + pos));

# this parsing is wrong, no two commands anymore
# also multifunctional
# ex cmd. s001p500 where s is for sweep, increment is 1 deg, pan servo, 500ms
if ("s" in servo):
  cmdParts = servo.split("p")
  incr = cmdParts[0].split("s")[1]
  delay = cmdParts[1]
  gather_sweep_measurements(int(incr), int(delay))

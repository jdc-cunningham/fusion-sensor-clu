# this code uses I2C and python cli args to move the servos in real time from a socket connection in node
# the I2C code referenced two tutorials, the python args referenced the last resource
# https://dronebotworkshop.com/i2c-arduino-raspberry-pi/
# https://www.aranacorp.com/en/communication-between-raspberry-pi-and-arduino-with-i2c
# https://stackoverflow.com/a/43234054/2710227

import os, sys, getpass, logging
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(CURRENT_DIR))

LOG_LEVEL = logging.INFO
LOG_FILE = "%s/log/pilog" % CURRENT_DIR
LOG_FORMAT = "%(asctime)s %(levelname)s %(message)s"
logging.basicConfig(filename=LOG_FILE, format=LOG_FORMAT, level=LOG_LEVEL)

print(CURRENT_DIR)

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

servo, pos = get_cli_args(*sys.argv)

# actually it would be more like cmd, this became dual purpose
# if (servo == "s"): # sweep
print(getpass.getuser())
write_to_file(getpass.getuser())
# write_to_file(os.getegid())
logging.info(getpass.getuser())

bus.write_i2c_block_data(addr, 0x00, ConvertStringToBytes(servo + pos));

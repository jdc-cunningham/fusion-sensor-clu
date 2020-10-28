# this code uses I2C and python cli args to move the servos in real time from a socket connection in node
# the I2C code referenced two tutorials, the python args referenced the last resource
# https://dronebotworkshop.com/i2c-arduino-raspberry-pi/
# https://www.aranacorp.com/en/communication-between-raspberry-pi-and-arduino-with-i2c
# https://stackoverflow.com/a/43234054/2710227

from smbus2 import SMBus
import time

addr = 0x8 # bus address, what does this mean
bus = SMBus(1) # indicates /dev/i2c-1

def ConvertStringToBytes(src):
  converted = []
  for b in src:
    converted.append(ord(b))
  return converted

def get_cli_args(name='default', first='servo', second='position'):
  return first, int(second)

servo, pos = get_args(*sys.argv)

bus.write_i2c_block_data(addr, 0x00, ConvertStringToBytes(servo + '_' + pos));

<<<<<<< HEAD
# references
# https://websockets.readthedocs.io/en/stable/intro.html
# https://www.aranacorp.com/en/communication-between-raspberry-pi-and-arduino-with-i2c/

import threading
from threading import Thread
from smbus2 import SMBus
import time
# import asyncio
# import websockets

# this allows the Arduino to talk back up to the web interface in real time
# by i2c and then through the websocket


addr = 0x8 # bus address, what does this mean
bus = SMBus(1) # indicates /dev/i2c-1

def listenToI2c():
  while True:
    try:
        data=bus.read_i2c_block_data(addr,0x00,16)
        print("recieve from slave:")
        print(str(data))
    except:
        print("remote i/o error")
        time.sleep(0.5)

=======
# references
# https://websockets.readthedocs.io/en/stable/intro.html
# https://www.aranacorp.com/en/communication-between-raspberry-pi-and-arduino-with-i2c/

import threading
from threading import Thread
from smbus2 import SMBus
import time
# import asyncio
# import websockets

# this allows the Arduino to talk back up to the web interface in real time
# by i2c and then through the websocket


addr = 0x8 # bus address, what does this mean
bus = SMBus(1) # indicates /dev/i2c-1

def listenToI2c():
  while True:
    try:
        data=bus.read_i2c_block_data(addr,0x00,16)
        print("recieve from slave:")
        print(str(data))
    except:
        print("remote i/o error")
        time.sleep(0.5)

>>>>>>> 4887fd796afedb14074fdb630fcf75f0cfabc397
listenToI2c()
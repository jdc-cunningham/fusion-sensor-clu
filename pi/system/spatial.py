import math

class Spatial:
  def __init__(self, param):
    # self.param = param
    self.units = "in"

  def get_3d_coordinates(self, inclineAngle, sweepAngle, measurement):
    xCoord = math.sin(sweepAngle) * measurement
    yCoord = math.sin(inclineAngle) * measurement
    zCoord = math.cos(sweepAngle) * measurement
    return [xCoord, yCoord, zCoord]

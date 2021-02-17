import numpy as np
import cv2
import time
import numpy as np
from operator import itemgetter
import json
from matplotlib import pyplot as plt

# overall the goal is find objects using find contours
# in order to adapt to the environment histograms(1D/2D) are used
# to define the ranges to apply for the HSV mask which the contour finder
# uses to find borders

# this is used to figure out the light/intensity ranges (V in HSV)
# imgPath - {string} to be used for histogram
# returns list of lists (x - range values for V) from histogram plot where Y is positive
def histogram1D(imgPath):
  img = cv2.imread(imgPath, 0) # grayscale
  counts, bins, bars = plt.hist(img.ravel(), 256, [0, 256])
  positiveBounds = [] # regarding x-values on plot
  activeIndex = 0

  for i in range(counts.size):
    print i, counts[i]

    if counts[i] > 0:
      if len(positiveBounds) > 0:
        if len(positiveBounds[activeIndex]) == 2:
          activeIndex += 1
          positiveBounds.append([i])
      else:
        positiveBounds.append([i])
    else:
      if len(positiveBounds) > 0:
        if len(positiveBounds[activeIndex]) == 1:
          positiveBounds[activeIndex].append(i - 1)

  return positiveBounds

# this is used to figure out the colors to use (HS in HSV)
# imgPath - {string} to be used for histogram
def histogram2D(imgPath):
  img = cv2.imread(imgPath)
  hsv = cv2.cvtColor(img,cv.COLOR_BGR2HSV)
  hist2D = cv2.calcHist([hsv], [0, 1], None, [180, 256], [0, 180, 0, 256])
  return hist2D

# preps the image for findContours
# cv2Img - image read with cv2.imread
def applyMask(cv2Img):
  print "yes"

# uses the masked image to find and draw bounds around an image
# minArea - minimum area to filter out from found contour areas
def findContours(minArea):
  print "yes"


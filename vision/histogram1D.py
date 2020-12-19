# this tells you the available light (V in HSV)
# this is straight up from the docs
import numpy as np
import cv2
from matplotlib import pyplot as plt

img = cv2.imread('./images/test_light.jpg', 0) # grayscale
plt.hist(img.ravel(), 256, [0, 256])
plt.show()
from PIL import Image
import math
import numpy

im1 = Image.open("../../img/o_01/distort.png")
p1 = im1.load()
w, h = im1.size
im2 = Image.new(im1.mode, im1.size)
p2 = im2.load()

r_arr = [40, 70, 120, 170, 220, 300]
omega_arr = [-3.2, -2.5, -2.0,  -1.5, -0.7, 0]
def omega(r_):
    return numpy.interp(r_, r_arr, omega_arr)

xo, yo = (560, 300)
y_scale = 0.55
for x in range(w):
    for y in range(h):
        r = math.sqrt((x - xo)**2 + (y - yo)**2 / y_scale**2)
        if r_arr[-1] < r < r_arr[-1] + 1:
            p2[x, y] = (0, 0, 0)
        elif r < r_arr[-1]:
            x_twirl = xo + (x - xo) * math.cos(omega(r)) - (y - yo) / y_scale * math.sin(omega(r))
            y_twirl = yo + (y - yo) * math.cos(omega(r)) + (x - xo) * y_scale * math.sin(omega(r))
            y_twirl = min(y_twirl, h-1)
            p2[x,y] = p1[int(x_twirl),int(y_twirl)]
        else:
            p2[x,y] = p1[x,y]
im2.show()
im2.save("../../img/o_01/py_untwirl.png")



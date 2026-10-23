"""Render the 16-bit giraffe portrait used on the Main tab.

Usage: python tools/make_giraffe.py assets/img/giraffe-16bit
Writes <prefix>.svg (the site asset) and <prefix>_preview.png (10x, for eyeballing).
Needs numpy and Pillow.
"""
import math, sys
import numpy as np
from PIL import Image

N = 48
H = W = N

def hexc(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

img = np.zeros((H, W, 3), dtype=np.uint8)
ys, xs = np.mgrid[0:H, 0:W]

# ---------- sky with ordered-dither bands ----------
sky = ['#160f2b', '#1d1438', '#261a49', '#33205c', '#46276b', '#5e2e75', '#7c3878', '#a04673', '#c95c62', '#ec8250']
bayer = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0
band_h = 40 / (len(sky) - 1)
for y in range(H):
    for x in range(W):
        t = min(y, 39.99) / band_h
        i = int(t); f = t - i
        j = min(i + 1, len(sky) - 1)
        c = sky[j] if f > bayer[y % 4, x % 4] else sky[i]
        img[y, x] = hexc(c)

# stars
for (sx, sy, c) in [(4, 3, '#ffffff'), (13, 6, '#cbbdf5'), (40, 4, '#ffffff'), (45, 10, '#cbbdf5'), (35, 2, '#cbbdf5'), (8, 12, '#9d8fd0'), (44, 18, '#9d8fd0'), (2, 20, '#9d8fd0')]:
    img[sy, sx] = hexc(c)
img[3, 3] = img[3, 5] = img[2, 4] = img[4, 4] = hexc('#8f7fd0')

# sun on horizon (left)
cx, cy, r = 9, 38, 6
for y in range(H):
    for x in range(W):
        d = math.hypot(x - cx, y - cy)
        if d <= r:
            c = '#ffd27a' if d < r - 2 else '#ffb25c'
            # retro scanline gaps on the sun
            if y in (35, 37):
                c = '#f08a4b'
            img[y, x] = hexc(c)

# ground
ground_top = 41
for y in range(ground_top, H):
    for x in range(W):
        img[y, x] = hexc('#1e1233' if y > ground_top else '#2b1840')
for gx in range(0, W, 3):
    img[ground_top - 1, gx] = hexc('#2b1840')

# acacia tree silhouette (right)
tree = '#120a22'
for y in range(31, 34):
    for x in range(37, 48):
        if not ((y == 31 and (x < 39 or x > 46)) or (y == 33 and (x < 38))):
            img[y, x] = hexc(tree)
for y in range(34, ground_top):
    img[y, 42] = hexc(tree)
img[34, 41] = img[35, 41] = img[34, 43] = hexc(tree)

# ---------- giraffe masks ----------
def ellipse(cx, cy, rx, ry, ang):
    a = math.radians(ang)
    dx, dy = xs - cx, ys - cy
    u = dx * math.cos(a) + dy * math.sin(a)
    v = -dx * math.sin(a) + dy * math.cos(a)
    return (u / rx) ** 2 + (v / ry) ** 2 <= 1.0

def poly(pts):
    from PIL import ImageDraw
    m = Image.new('L', (W, H), 0)
    ImageDraw.Draw(m).polygon(pts, fill=1)
    return np.array(m).astype(bool)

neck = poly([(18, 48), (38, 48), (33, 30), (31, 20), (24, 19), (23, 30)])
head = ellipse(20.5, 16.5, 10, 5.4, -34)
skull = poly([(23, 9), (30, 11), (33, 21), (25, 22), (21, 14)])
muzzle = ellipse(13, 22, 4.8, 3.8, -34)
ear = ellipse(33, 11.5, 3.6, 1.5, -18)
oss1 = (xs >= 24) & (xs <= 25) & (ys >= 5) & (ys <= 10)
oss2 = (xs >= 28) & (xs <= 29) & (ys >= 4) & (ys <= 10)
knob1 = (xs >= 23) & (xs <= 26) & (ys >= 4) & (ys <= 5)
knob2 = (xs >= 27) & (xs <= 30) & (ys >= 3) & (ys <= 4)
mane = poly([(31, 19), (34, 19), (38.5, 44), (36, 44)]) & ~neck

face = head | muzzle | skull
body = neck | face | ear
horns = oss1 | oss2 | knob1 | knob2
allm = body | horns | mane

# ---------- palettes ----------
TAN = ['#ffe3a6', '#f4bf63', '#cf8f3e']
PATCH = ['#c46f2c', '#9f5422', '#76391a']
LINE = ['#fcebc4', '#f6dca8', '#d9b47a']
MUZ = ['#fbead0', '#e9cfa3', '#c4a374']
EAR = ['#ffe3a6', '#f4bf63', '#cf8f3e']
OUT = '#2b140c'

# reticulated pattern via voronoi seeds (neck + back of skull)
rng = np.random.default_rng(7)
seeds = []
for gy in range(8, 50, 5):
    for gx in range(14, 42, 5):
        seeds.append((gx + rng.uniform(-1.6, 1.6) + (2.5 if (gy // 5) % 2 else 0), gy + rng.uniform(-1.4, 1.4)))
seeds = np.array(seeds)
d = np.sqrt((xs[..., None] - seeds[:, 0]) ** 2 + (ys[..., None] - seeds[:, 1]) ** 2)
ds = np.sort(d, axis=2)
is_line = (ds[..., 1] - ds[..., 0]) < 1.25

def tone(mask, y, x):
    # light from upper-left: highlight where left/up is outside, shadow where right/down is outside
    left = x - 1 < 0 or not mask[y, x - 1]
    up = y - 1 < 0 or not mask[y - 1, x]
    r1 = x + 1 >= W or not mask[y, x + 1]
    r2 = x + 2 >= W or not mask[y, x + 2]
    dn = y + 1 >= H or not mask[y + 1, x]
    if r1 or r2 or dn:
        return 2
    if left or up:
        return 0
    return 1

patterned = (neck | (skull & ~head & ~muzzle))
for y in range(H):
    for x in range(W):
        if not allm[y, x]:
            continue
        if mane[y, x]:
            c = '#6e3416' if (y % 3) else '#8f4a1c'
        elif horns[y, x]:
            c = '#3d2012' if (knob1[y, x] or knob2[y, x]) else ('#a8693a' if x in (24, 28) else '#7a4421')
        elif ear[y, x] and not face[y, x]:
            c = EAR[tone(ear, y, x)]
            if 32 <= x <= 35 and y == 11:
                c = '#e39a7a'  # inner ear
        elif muzzle[y, x] and not head[y, x] or (muzzle[y, x] and x < 15):
            c = MUZ[tone(face, y, x)]
        elif patterned[y, x] and not head[y, x]:
            t = tone(body, y, x)
            c = LINE[t] if is_line[y, x] else PATCH[t]
        else:
            t = tone(face, y, x)
            c = TAN[t]
        img[y, x] = hexc(c)

# small face spots
for (sx, sy) in [(25, 13), (26, 14), (19, 12), (28, 17), (29, 16), (23, 18)]:
    if face[sy, sx]:
        img[sy, sx] = hexc('#b8692a')

# eye with highlight + lash
img[14, 21] = img[14, 22] = img[15, 21] = img[15, 22] = hexc('#1a0b06')
img[14, 21] = hexc('#ffffff')
img[13, 20] = img[13, 21] = img[13, 22] = hexc('#5a2c14')
# nostril + mouth
img[21, 11] = hexc('#5a2c14'); img[20, 11] = hexc('#8a5a34')
for mx in range(11, 16):
    my = 24 + (1 if mx > 13 else 0)
    if muzzle[my, mx]:
        img[my, mx] = hexc('#8a5a34')

# outline: mask pixels touching outside
for y in range(H):
    for x in range(W):
        if not allm[y, x]:
            continue
        edge = False
        for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            yy, xx = y + dy, x + dx
            if 0 <= yy < H and 0 <= xx < W and not allm[yy, xx]:
                edge = True
        if edge:
            img[y, x] = hexc(OUT)

Image.fromarray(img).resize((W * 10, H * 10), Image.NEAREST).save(sys.argv[1] + '_preview.png')

# ---------- SVG (horizontal run-length rects, one path per color) ----------
runs = {}
for y in range(H):
    x = 0
    while x < W:
        c = tuple(img[y, x]); x0 = x
        while x < W and tuple(img[y, x]) == c:
            x += 1
        runs.setdefault(c, []).append(f'M{x0} {y}h{x - x0}v1h-{x - x0}z')
parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W*8}" height="{H*8}" shape-rendering="crispEdges" role="img" aria-labelledby="t">',
         '<title id="t">16-bit pixel-art portrait of a giraffe at dusk</title>']
for c, ds_ in sorted(runs.items(), key=lambda kv: -len(kv[1])):
    parts.append(f'<path fill="#{c[0]:02x}{c[1]:02x}{c[2]:02x}" d="{"".join(ds_)}"/>')
parts.append('</svg>')
open(sys.argv[1] + '.svg', 'w').write('\n'.join(parts) + '\n')
print('colors:', len(runs))

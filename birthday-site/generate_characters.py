import os, math
from PIL import Image, ImageDraw

OUTPUT_DIR = 'public/assets/characters'
os.makedirs(OUTPUT_DIR, exist_ok=True)

def circle(d, cx, cy, r, fill, outline=None, w=1):
    d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=fill, outline=outline, width=w)

def eye(d, cx, cy):
    circle(d, cx, cy, 5, '#2d1b14')
    circle(d, cx+2, cy-1, 2, '#fff')

def blush(d, cx, cy):
    circle(d, cx, cy, 6, (255,150,150,60))

def mouth(d, x1, y1, x2, y2):
    d.arc([x1, y1, x2, y2], 0, 180, fill='#c0392b', width=2)

def make_char(idx, p):
    sz = 512
    img = Image.new('RGBA', (sz,sz), (0,0,0,0))
    d = ImageDraw.Draw(img)
    skin = p.get('s','#FFDAB9')
    hc = p.get('h','#8B4513')
    oc = p.get('o','#FF69B4')
    o2 = p.get('o2',oc)
    sc = p.get('sc','#333')
    hs = p.get('hs','short')
    os_ = p.get('os','dress')
    hand = p.get('hand')
    gl = p.get('gl',False)
    ext = p.get('ext')

    cx, cy_ = sz//2, sz//2
    bt, bb =260, 420

    # Body
    if os_ == 'dress':
        d.polygon([(cx-50,bt),(cx+50,bt),(cx+65,bb-10),(cx+55,bb+20),(cx-55,bb+20),(cx-65,bb-10)], fill=oc)
        d.polygon([(cx-50,bt),(cx+50,bt),(cx+60,bt+20),(cx-60,bt+20)], fill=o2)
        d.polygon([(cx-60,bt+15),(cx+60,bt+15),(cx+30,bt+30),(cx-30,bt+30)], fill=o2)
    elif os_ == 'tshirt':
        d.rectangle([cx-55,bt,cx+55,bb-20], fill=oc)
        d.polygon([(cx-55,bt),(cx-80,bt-20),(cx-55,bt+10)], fill=oc)
        d.polygon([(cx+55,bt),(cx+80,bt-20),(cx+55,bt+10)], fill=oc)
        d.rectangle([cx-25,bt,cx+25,bt+15], fill=o2)
    elif os_ == 'hoodie':
        d.rectangle([cx-58,bt,cx+58,bb], fill=oc)
        d.arc([cx-60,bt-25,cx+60,bt+15], 180, 0, fill=oc, width=8)
        d.rectangle([cx-30,bt+45,cx+30,bt+65], fill=o2)

    # Legs
    if os_ == 'dress':
        d.rectangle([cx-20,bb+10,cx-5,bb+60], fill=skin)
        d.rectangle([cx+5,bb+10,cx+20,bb+60], fill=skin)
    else:
        d.rectangle([cx-22,bb-10,cx-8,bb+50], fill=skin)
        d.rectangle([cx+8,bb-10,cx+22,bb+50], fill=skin)
    d.rectangle([cx-24,bb+45,cx-6,bb+55], fill=sc)
    d.rectangle([cx+6,bb+45,cx+24,bb+55], fill=sc)

    # Arms
    at, ab = bt+10, bb-10
    if hand == 'wave':
        d.polygon([(cx-75,at),(cx-85,ab-20),(cx-70,ab-15),(cx-60,at)], fill=skin)
        d.polygon([(cx+75,at-15),(cx+95,at-40),(cx+85,at-50),(cx+65,at-10)], fill=skin)
    elif hand == 'gift':
        d.polygon([(cx-75,at+10),(cx-85,ab),(cx-70,ab),(cx-60,at+10)], fill=skin)
        d.polygon([(cx+75,at+10),(cx+85,ab),(cx+70,ab),(cx+60,at+10)], fill=skin)
    elif hand == 'thumbsup':
        d.polygon([(cx-75,at+5),(cx-88,ab-20),(cx-73,ab-15),(cx-58,at+5)], fill=skin)
        d.polygon([(cx+75,at+5),(cx+88,ab-20),(cx+73,ab-15),(cx+58,at+5)], fill=skin)
    elif hand == 'heart':
        d.polygon([(cx-75,at+5),(cx-88,ab-25),(cx-73,ab-20),(cx-58,at+5)], fill=skin)
        d.polygon([(cx+75,at+5),(cx+88,ab-25),(cx+73,ab-20),(cx+58,at+5)], fill=skin)
    elif hand == 'balloon':
        d.polygon([(cx-75,at+5),(cx-88,ab-25),(cx-73,ab-20),(cx-58,at+5)], fill=skin)
        d.polygon([(cx+75,at-10),(cx+90,at-40),(cx+80,at-50),(cx+65,at-15)], fill=skin)
    else:
        d.polygon([(cx-75,at+5),(cx-85,ab-15),(cx-70,ab-10),(cx-60,at+5)], fill=skin)
        d.polygon([(cx+75,at+5),(cx+85,ab-15),(cx+70,ab-10),(cx+60,at+5)], fill=skin)

    # Head
    hx, hy = cx, 210
    circle(d, hx, hy, 72, skin)

    # Hair
    if hs == 'twintails':
        d.pieslice([hx-75,hy-75,hx+75,hy+75], 0, 180, fill=hc)
        d.rectangle([hx-75,hy-20,hx+75,hy+5], fill=hc)
        d.ellipse([hx-90,hy-55,hx-55,hy-10], fill=hc)
        d.ellipse([hx+55,hy-55,hx+90,hy-10], fill=hc)
        circle(d, hx-70, hy-30, 6, '#FF69B4')
        circle(d, hx+70, hy-30, 6, '#FF69B4')
    elif hs == 'bob':
        d.pieslice([hx-75,hy-75,hx+75,hy+75], 180, 0, fill=hc)
        d.rectangle([hx-75,hy-15,hx+75,hy+20], fill=hc)
        d.rectangle([hx-75,hy-40,hx-60,hy+25], fill=hc)
        d.rectangle([hx+60,hy-40,hx+75,hy+25], fill=hc)
    elif hs == 'long':
        d.pieslice([hx-75,hy-75,hx+75,hy+75], 0, 180, fill=hc)
        d.rectangle([hx-75,hy-20,hx+75,hy+5], fill=hc)
        d.rectangle([hx-75,hy-30,hx-62,hy+40], fill=hc)
        d.rectangle([hx+62,hy-30,hx+75,hy+40], fill=hc)
    elif hs == 'curly':
        d.pieslice([hx-75,hy-75,hx+75,hy+75], 0, 180, fill=hc)
        d.rectangle([hx-75,hy-20,hx+75,hy+10], fill=hc)
        for i in range(6):
            a = -60 + i * 30
            rx = hx + int(68 * math.cos(math.radians(a)))
            ry = hy + int(68 * math.sin(math.radians(a))) + 5
            circle(d, rx, ry, 10, hc)
    elif hs == 'cap':
        d.pieslice([hx-75,hy-75,hx+75,hy+75], 0, 180, fill=hc)
        d.rectangle([hx-75,hy-25,hx+75,hy], fill=hc)
        d.rectangle([hx-85,hy-15,hx+85,hy-5], fill=hc)
    elif hs == 'short':
        d.pieslice([hx-75,hy-75,hx+75,hy+75], 0, 180, fill=hc)
        d.rectangle([hx-75,hy-20,hx+75,hy+5], fill=hc)
        d.polygon([(hx-40,hy-70),(hx-35,hy-85),(hx-30,hy-70)], fill=hc)
        d.polygon([(hx-10,hy-72),(hx-5,hy-88),(hx+5,hy-72)], fill=hc)
        d.polygon([(hx+30,hy-70),(hx+35,hy-85),(hx+40,hy-70)], fill=hc)
    elif hs == 'bangs':
        d.pieslice([hx-75,hy-75,hx+75,hy+75], 0, 180, fill=hc)
        d.rectangle([hx-75,hy-20,hx+75,hy+12], fill=hc)
        d.rectangle([hx-55,hy+5,hx+55,hy+20], fill=hc)
        d.ellipse([hx-30,hy-30,hx+30,hy+30], fill=hc)

    # Eyes
    eye(d, hx-18, hy-5)
    eye(d, hx+18, hy-5)

    # Eyebrows
    d.arc([hx-26,hy-22,hx-10,hy-10], 200, 340, fill='#5D4037', width=2)
    d.arc([hx+10,hy-22,hx+26,hy-10], 200, 340, fill='#5D4037', width=2)

    # Blush
    blush(d, hx-28, hy+5)
    blush(d, hx+28, hy+5)

    # Mouth
    mouth(d, hx-8, hy+8, hx+8, hy+20)

    # Glasses
    if gl:
        d.rectangle([hx-28,hy-12,hx-8,hy+3], outline='#666', width=2)
        d.rectangle([hx+8,hy-12,hx+28,hy+3], outline='#666', width=2)
        d.line([hx-8,hy-5,hx+8,hy-5], fill='#666', width=2)

    # Extra
    if ext == 'bow':
        d.polygon([(hx-15,hy-68),(hx-5,hy-78),(hx+5,hy-68),(hx-5,hy-58)], fill='#FF69B4')
        d.polygon([(hx+15,hy-68),(hx+5,hy-78),(hx-5,hy-68),(hx+5,hy-58)], fill='#FF69B4')
        circle(d, hx, hy-68, 5, '#FF69B4')
    elif ext == 'flower':
        for a in [0,72,144,216,288]:
            fx = hx + int(12*math.cos(math.radians(a)))
            fy = hy - 72 + int(12*math.sin(math.radians(a)))
            circle(d, fx, fy, 6, '#FF69B4')
        circle(d, hx, hy-72, 5, '#FFD600')
    elif ext == 'crown':
        d.polygon([(hx-25,hy-68),(hx-20,hy-85),(hx-12,hy-72),(hx,hy-88),(hx+12,hy-72),(hx+20,hy-85),(hx+25,hy-68)], fill='#FFD700')
        d.polygon([(hx-25,hy-68),(hx+25,hy-68),(hx+25,hy-60),(hx-25,hy-60)], fill='#FFD700')

    # Hand props
    if hand == 'gift':
        bx, by = hx, bb + 50
        d.rectangle([bx-40,by-20,bx+40,by+30], fill='#FF5722')
        d.rectangle([bx-5,by-20,bx+5,by+30], fill='#FFD600')
        d.rectangle([bx-40,by+2,bx+40,by+8], fill='#FFD600')
        d.polygon([(bx-20,by-25),(bx,by-40),(bx+20,by-25)], fill='#FFD600')
    elif hand == 'balloon':
        bx, by = hx+85, bt-25
        circle(d, bx, by, 20, '#E91E63')
        d.polygon([(bx-3,by+18),(bx+3,by+18),(bx,by+28)], fill='#E91E63')
        d.line([bx,by+28,bx+5,bt+10], fill='#999', width=1)
    elif hand == 'heart':
        hx2, hy2 = hx+30, bt+35
        d.polygon([(hx2,hy2),(hx2+12,hy2-15),(hx2+25,hy2-5),(hx2+12,hy2+10)], fill='#FF1744')

    fp = os.path.join(OUTPUT_DIR, f'char_{idx+1}.png')
    img.save(fp, 'PNG')
    print(f'  Saved {fp}')
    return fp

chars = [
    {'s':'#FFDAB9','h':'#8B4513','hs':'twintails','o':'#FF69B4','o2':'#FFB6C1','os':'dress','sc':'#FF69B4','hand':'wave','ext':'bow'},
    {'s':'#F5D0A9','h':'#4A2800','hs':'cap','o':'#2196F3','o2':'#1565C0','os':'tshirt','sc':'#333','hand':'thumbsup'},
    {'s':'#FFE0BD','h':'#2E1A0F','hs':'long','o':'#FFD600','o2':'#FFB300','os':'dress','sc':'#FFB300','hand':'gift','ext':'flower'},
    {'s':'#F5D0A9','h':'#333','hs':'short','o':'#4CAF50','o2':'#2E7D32','os':'hoodie','sc':'#333','gl':True},
    {'s':'#FFE0BD','h':'#9C27B0','hs':'bob','o':'#9C27B0','o2':'#CE93D8','os':'dress','sc':'#9C27B0','hand':'balloon','ext':'bow'},
    {'s':'#F5D0A9','h':'#D32F2F','hs':'curly','o':'#F44336','o2':'#B71C1C','os':'tshirt','sc':'#333','hand':'wave'},
    {'s':'#FFE0BD','h':'#FF6F00','hs':'bangs','o':'#FF9800','o2':'#FFB74D','os':'hoodie','sc':'#FF9800','hand':'heart','ext':'crown'},
    {'s':'#F5D0A9','h':'#00897B','hs':'short','o':'#00897B','o2':'#004D40','os':'tshirt','sc':'#333','hand':'thumbsup'},
]

print(f'Generating {len(chars)} characters...')
for i, p in enumerate(chars):
    make_char(i, p)
print(f'\nDone! All characters saved to {OUTPUT_DIR}/')
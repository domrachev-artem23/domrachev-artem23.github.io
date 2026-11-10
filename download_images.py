
import os
import urllib.request

BASE = "https://images.unsplash.com/photo-"
PHOTOS = [  
    ("hero",           "1504674900247-0877df9cc836", 2070),
    ("promo",          "1504674900247-0877df9cc836", 300),
    ("mamma-mia",      "1513104890138-7c749659a591", 600),
    ("sushi-house",    "1579871494447-9811cf80d66c", 600),
    ("burger-club",    "1568901346375-23c9450c58cd", 600),
    ("green-bowl",     "1512621776951-a57141f2eefd", 600),
    ("pepperoni",      "1574071318508-1cdbab80d002", 600),
    ("philadelphia",   "1611143669185-af224c5e3252", 600),
    ("caesar",         "1546069901-ba9599a7e63c",    600),
    ("burger-classic", "1550547660-d9450f859349",    600),
    ("cola",           "1622483767028-3f66f32aef97", 300),
]

folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), "img")
os.makedirs(folder, exist_ok=True)

ok = 0
for name, photo_id, width in PHOTOS:
    url = f"{BASE}{photo_id}?q=80&w={width}&auto=format&fit=crop"
    path = os.path.join(folder, name + ".jpg")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r, open(path, "wb") as f:
            f.write(r.read())
        print("OK     ", name + ".jpg")
        ok += 1
    except Exception as e:
        print("ОШИБКА ", name + ".jpg", "-", e)

print(f"\nСкачано {ok} из {len(PHOTOS)}. Папка: {folder}")

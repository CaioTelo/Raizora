"""Operate only the active Chromium Save File dialog on the local QA desktop."""
import ctypes
import json
import sys
import time

xlib = ctypes.CDLL('libX11.so.6')
xtest = ctypes.CDLL('libXtst.so.6')
xlib.XOpenDisplay.restype = ctypes.c_void_p
display = xlib.XOpenDisplay(None)
assert display, 'X11 display unavailable'
for function in ['XGetInputFocus', 'XFetchName', 'XQueryTree', 'XFlush', 'XCloseDisplay']:
    getattr(xlib, function).argtypes = [ctypes.c_void_p] + {
        'XGetInputFocus': [ctypes.POINTER(ctypes.c_ulong), ctypes.POINTER(ctypes.c_int)],
        'XFetchName': [ctypes.c_ulong, ctypes.POINTER(ctypes.c_char_p)],
        'XQueryTree': [ctypes.c_ulong, ctypes.POINTER(ctypes.c_ulong), ctypes.POINTER(ctypes.c_ulong), ctypes.POINTER(ctypes.POINTER(ctypes.c_ulong)), ctypes.POINTER(ctypes.c_uint)],
        'XFlush': [], 'XCloseDisplay': [],
    }[function]
xlib.XStringToKeysym.argtypes = [ctypes.c_char_p]
xlib.XStringToKeysym.restype = ctypes.c_ulong
xlib.XKeysymToKeycode.argtypes = [ctypes.c_void_p, ctypes.c_ulong]
xtest.XTestFakeKeyEvent.argtypes = [ctypes.c_void_p, ctypes.c_uint, ctypes.c_int, ctypes.c_ulong]
focus, revert = ctypes.c_ulong(), ctypes.c_int()
xlib.XGetInputFocus(display, ctypes.byref(focus), ctypes.byref(revert))
window = focus.value
titles = []
for _ in range(10):
    name = ctypes.c_char_p()
    if xlib.XFetchName(display, window, ctypes.byref(name)) and name.value:
        titles.append(name.value.decode(errors='replace'))
    root, parent, children, count = ctypes.c_ulong(), ctypes.c_ulong(), ctypes.POINTER(ctypes.c_ulong)(), ctypes.c_uint()
    if not xlib.XQueryTree(display, window, ctypes.byref(root), ctypes.byref(parent), ctypes.byref(children), ctypes.byref(count)):
        break
    if parent.value in [0, window]:
        break
    window = parent.value
is_shortcut = sys.argv[1] == '--ctrlp'
def matches(title):
    return ('Chromium' in title or 'RAIZORA' in title) if is_shortcut else ('Save File' in title or 'Save As' in title or 'Save as' in title)

if not any(matches(title) for title in titles):
    # This QA desktop has no window manager; Playwright bringToFront does not
    # set X11 input focus. Locate only the explicitly named QA browser/dialog.
    xlib.XDefaultRootWindow.argtypes = [ctypes.c_void_p]
    xlib.XDefaultRootWindow.restype = ctypes.c_ulong
    xlib.XSetInputFocus.argtypes = [ctypes.c_void_p, ctypes.c_ulong, ctypes.c_int, ctypes.c_ulong]
    class Attributes(ctypes.Structure):
        _fields_ = [(name, kind) for name, kind in [
            ('x',ctypes.c_int),('y',ctypes.c_int),('width',ctypes.c_int),('height',ctypes.c_int),('border',ctypes.c_int),('depth',ctypes.c_int),('visual',ctypes.c_void_p),('root',ctypes.c_ulong),('window_class',ctypes.c_int),('bit_gravity',ctypes.c_int),('win_gravity',ctypes.c_int),('backing_store',ctypes.c_int),('backing_planes',ctypes.c_ulong),('backing_pixel',ctypes.c_ulong),('save_under',ctypes.c_int),('colormap',ctypes.c_ulong),('map_installed',ctypes.c_int),('map_state',ctypes.c_int),('all_event_masks',ctypes.c_long),('your_event_mask',ctypes.c_long),('do_not_propagate_mask',ctypes.c_long),('override_redirect',ctypes.c_int),('screen',ctypes.c_void_p)]]
    xlib.XGetWindowAttributes.argtypes = [ctypes.c_void_p,ctypes.c_ulong,ctypes.POINTER(Attributes)]
    root_window = xlib.XDefaultRootWindow(display)
    pending = [root_window]
    for _ in range(100):
        if not pending:
            break
        candidate = pending.pop()
        name = ctypes.c_char_p()
        if xlib.XFetchName(display, candidate, ctypes.byref(name)) and name.value:
            title = name.value.decode(errors='replace')
            attributes=Attributes()
            xlib.XGetWindowAttributes(display,candidate,ctypes.byref(attributes))
            if matches(title) and attributes.map_state == 2:
                xlib.XSetInputFocus(display, candidate, 1, 0)
                xlib.XFlush(display)
                titles = [title]
                break
        root, parent, children, count = ctypes.c_ulong(), ctypes.c_ulong(), ctypes.POINTER(ctypes.c_ulong)(), ctypes.c_uint()
        if xlib.XQueryTree(display, candidate, ctypes.byref(root), ctypes.byref(parent), ctypes.byref(children), ctypes.byref(count)):
            pending.extend(children[i] for i in range(count.value))
assert any(('Chromium' in title or 'RAIZORA' in title) if is_shortcut else ('Save File' in title or 'Save As' in title or 'Save as' in title) for title in titles), f'Unexpected active window: {titles}'

def key(symbol, pressed):
    code = xlib.XKeysymToKeycode(display, xlib.XStringToKeysym(symbol.encode()))
    assert code, symbol
    xtest.XTestFakeKeyEvent(display, code, pressed, 0)
    xlib.XFlush(display)

if is_shortcut:
    key('Control_L', 1)
    key('p', 1)
    key('p', 0)
    key('Control_L', 0)
    xlib.XCloseDisplay(display)
    print(json.dumps({'nativeWindowTitles': titles, 'shortcut': 'Ctrl+P'}))
    sys.exit(0)

key('Control_L', 1)
key('a', 1)
key('a', 0)
key('Control_L', 0)
for char in sys.argv[1]:
    symbol = {'/': 'slash', '.': 'period', '-': 'minus', '_': 'underscore'}.get(char, char)
    key(symbol, 1)
    key(symbol, 0)
key('Return', 1)
key('Return', 0)
time.sleep(1)
xlib.XCloseDisplay(display)
print(json.dumps({'nativeDialogTitles': titles, 'savedPath': sys.argv[1]}))

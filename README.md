# LED Scroller

A simple full-screen LED-style text scroller for iPhone (and any mobile browser). Pure HTML, CSS, and vanilla JavaScript — no build step.

## Features

- Custom scrolling text
- Text and background color pickers (defaults: green on black)
- Adjustable scroll speed
- Auto font size based on portrait/landscape orientation
- Manual font size override (slider; 0 = auto)
- Settings saved in `localStorage`

## Run on iPhone

### Option 1: Local dev server (same Wi‑Fi)

```bash
cd js-led-scroller
python3 -m http.server 8080
```

On your Mac, find your local IP (`ipconfig getifaddr en0`), then open on iPhone:

`http://<your-mac-ip>:8080`

### Option 2: Add to Home Screen

Open the page in Safari → Share → **Add to Home Screen** for a full-screen app-like experience.

## Usage

- Tap the **⚙** button to open settings
- Edit text, colors, speed, and font size
- Tap **Done** to return to the display
- Rotate the phone to see auto font sizing (when font size is set to Auto)
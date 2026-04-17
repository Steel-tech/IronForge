# IronForge Icons

The canonical brand icon is `icon.svg` — a neon-cyan I-beam on a dark background.

## PNG Generation

Browsers that don't support SVG manifest icons (mostly older Android shells)
will request `icon-192.png` and `icon-512.png`. These need to be generated from
`icon.svg` at build time. Two easy options:

### With `rsvg-convert` (librsvg)
```bash
brew install librsvg
rsvg-convert -w 192 -h 192 public/icons/icon.svg -o public/icons/icon-192.png
rsvg-convert -w 512 -h 512 public/icons/icon.svg -o public/icons/icon-512.png
```

### With ImageMagick
```bash
magick -background "#0a0a0f" -resize 192x192 public/icons/icon.svg public/icons/icon-192.png
magick -background "#0a0a0f" -resize 512x512 public/icons/icon.svg public/icons/icon-512.png
```

Until the PNGs exist, installable-PWA checks in Chrome may warn; iOS/Safari
and Chrome desktop will fall back to the SVG.

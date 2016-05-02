#!/bin/sh

# concatenate all scripts
cat src/three.js src/DeviceOrientationControls.js src/MouseControls.js src/stats.min.js src/gldomelib.js > release/gldomelib_latest.js

# minify
uglify -s release/gldomelib_latest.js -o release/gldomelib_latest.min.js

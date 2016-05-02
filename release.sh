#!/bin/sh

# concatenate all scripts
cat src/DeviceOrientationControls.js src/gldomelib.js src/MouseControls.js src/stats.min.js src/three.js > release/gldomelib_latest.js

# minify
uglify -s release/gldomelib_latest.js -o release/gldomelib_latest.min.js

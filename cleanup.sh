#!/bin/bash

# Remove duplicate root files (electron files are in /electron, types in src/types)
rm -f main.ts preload.ts global.d.ts

# Remove duplicate/misplaced source folders
rm -rf src/main
rm -rf src/renderer

# Remove unused css file (using src/styles/index.css instead)
rm -f src/index.css

echo "Project structure cleaned up."
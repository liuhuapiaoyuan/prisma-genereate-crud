#!/bin/bash
START_TIME=$SECONDS

echo "Buidling package..."
rm -r dist
npm run build
rm -r package
mkdir package

echo "Copying files..."
cp -r dist package/dist
cp package.json README.md LICENSE package

echo "Making package.json public..."
sed -i 's/"private": true/"private": false/' ./package/package.json

ELAPSED_TIME=$(($SECONDS - $START_TIME))
echo "Done in $ELAPSED_TIME seconds!"

#!/bin/bash

FILE='IEE_ElectivePickerAngular'
EXT='zip'

# remove old zip file if it exists
if [ -f $FILE.$EXT ]; then
   rm $FILE.$EXT;
   echo -e "removed old version of $FILE.$EXT\n"
else
   echo -e "$FILE.$EXT does not exist\n"
fi

cd dist

# compress new version
echo -e "Compressing files to $FILE.$EXT"
zip -r "../$FILE" *

echo -e "\nFinished creating $FILE.$EXT\n"

#!/bin/bash

mkdir badges

# Update badges pre-build
echo "https://img.shields.io/badge/Build-In_progress-orange.svg"
curl -s "https://img.shields.io/badge/Build-In_progress-orange.svg" > badges/build.svg

echo "https://img.shields.io/badge/Version-1.0.0-orange.svg"
curl -s "https://img.shields.io/badge/Version-1.0.0-orange.svg" > badges/version.svg

echo "https://img.shields.io/badge/Unit_Tests-Pending-orange.svg"
curl -s "https://img.shields.io/badge/Unit_Tests-Pending-orange.svg" > badges/unit-test.svg

# Sync with S3
aws s3 cp badges s3://endeavour-codebuild-output/badges/IMViewer/ --recursive --acl public-read

# Build
{ #try
    ./gradlew assemble
    buildresult=0
} || { #catch
    buildresult=1
}

# Build
if [[ "$buildresult" -gt "0" ]] ; then
        badge_status=failing
        badge_colour=red
else
        badge_status=passing
        badge_colour=green
fi
echo "https://img.shields.io/badge/Build-$badge_status-$badge_colour.svg"
curl -s "https://img.shields.io/badge/Build-$badge_status-$badge_colour.svg" > badges/build.svg

echo "https://img.shields.io/badge/Version-$version-$badge_colour.svg"
curl -s "https://img.shields.io/badge/Version-$version-$badge_colour.svg" > badges/version.svg

# Unit tests
{ #try
    ./gradlew check
    testresult=0
} || { #catch
    testresult=1
}

if [[ "$testresult" -gt "0" ]] ; then
        badge_status=failing
        badge_colour=red
else
        badge_status=passing
        badge_colour=green
fi

echo "Generating badge 'https://img.shields.io/badge/Unit_Tests-$badge_status-$badge_colour.svg'"
curl -s "https://img.shields.io/badge/Unit_Tests-$badge_status-$badge_colour.svg" > badges/unit-test.svg

# Sync with S3
aws s3 cp badges s3://endeavour-codebuild-output/badges/IMViewer/ --recursive --acl public-read

exit ${buildresult}

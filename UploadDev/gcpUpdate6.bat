@echo off

REM Build the Docker image
docker build --no-cache -t electronicbackenddev .
docker tag electronicbackenddev gcr.io/electronicswebsite/electronicbackenddev:latest



pause

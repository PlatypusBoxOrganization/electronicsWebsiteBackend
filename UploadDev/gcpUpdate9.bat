@echo off

REM Deploy the image to Google Cloud Run
gcloud run deploy electronicbackenddev --image gcr.io/electronicswebsite/electronicbackenddev --platform managed --region asia-east1 --allow-unauthenticated


pause

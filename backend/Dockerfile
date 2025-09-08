FROM python:3.10-slim

# Install required packages
RUN pip install matplotlib numpy pandas

WORKDIR /app

COPY stars_brightness.csv .
COPY exoplanets_full.csv .
COPY nearby_stars.csv .
COPY temp_santiago.csv .
COPY temp_ciudad_2024.csv .

# Set environment variables
ENV PYTHONUNBUFFERED=1 

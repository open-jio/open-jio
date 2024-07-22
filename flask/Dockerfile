# syntax=docker/dockerfile:1

FROM python:3.10-slim-buster
FROM tensorflow/tensorflow:2.13.0

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN pip3 install -r requirements.txt

COPY . .

CMD ["python3", "recommender.py"]
FROM python:3.10

WORKDIR /scraper

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "scrapper.py"]

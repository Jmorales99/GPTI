FROM python:3.9

WORKDIR /scraper

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["python", "scrapper.py"]

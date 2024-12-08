import re
import requests
from bs4 import BeautifulSoup
import os
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
import time
import random
from fake_useragent import UserAgent

ua = UserAgent()

def clean_text(text):
    """Limpia el texto eliminando saltos de línea, espacios redundantes y caracteres no deseados."""
    if text:
        # Eliminar saltos de línea y reemplazar múltiples espacios por uno solo
        text = re.sub(r'\s+', ' ', text.strip())
        return text
    return ''

def scrape_static_page():
    categories = ['administracion', 'arte', 'asistenteadministrativo', 'economia', 'educacion']

    for category in categories:
        url = f"https://www.chiletrabajos.cl/trabajos/{category}/"
        headers = {"User-Agent": ua.random}
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            print(f"Error fetching {url}: {response.status_code}")
            continue

        soup = BeautifulSoup(response.text, 'html.parser')
        jobs = soup.find_all('div', class_='job-item with-thumb destacado no-hover')
        job_data = []
        for job in jobs:
            job_section = job.find('h2').find('a')
            job_data.append({
                "title": clean_text(job_section.text),
                "link": job_section['href']
            })
        for job in job_data:
            job_url = job['link']
            job_response = requests.get(job_url, headers=headers)
            job_soup = BeautifulSoup(job_response.text, 'html.parser')
            job_info = job_soup.findAll('div', class_="job-item no-hover with-thumb pb-2 detalle")
            job_title = clean_text(job_info[0].find('h2', class_='title font-weight-bold mb-2 heading-2').find('a').text)
            job_description = clean_text(job_info[0].find('p', class_= 'mb-0').text)
            other_job_info = job_soup.find('table', class_="table table-sm")
            all_other_job_info = other_job_info.find_all('td')
            employer = ""
            city = ""
            job_type = ""
            for e in range(len(all_other_job_info)):
                if "Buscado" in all_other_job_info[e]:
                    employer = clean_text(all_other_job_info[e+1].find('a').text)
                if "Ubica" in all_other_job_info[e].text:
                    city = clean_text(all_other_job_info[e+1].find('a').text)
                if "Tipo" in all_other_job_info[e]:
                    job_type = clean_text(all_other_job_info[e+1].find('a').text)
            job['title'] = job_title
            job['description'] = job_description
            job['company'] = employer
            job['city'] = city
            job['type'] = job_type
            time.sleep(random.uniform(1, 3))  # Random delay
        print(f"Scraped {len(job_data)} jobs from {category}")
        endpoint_url = os.getenv("API_URL", "http://localhost:3000/jobs/add")
        payload = {
            "category": category,
            "jobs": job_data
        }
        requests.post(endpoint_url, json=payload)
        time.sleep(random.uniform(1, 3))  # Random delay

def start_server():
    port = int(os.getenv("PORT", 8080))
    server = HTTPServer(("0.0.0.0", port), SimpleHTTPRequestHandler)
    print(f"HTTP server running on port {port}")
    server.serve_forever()

if __name__ == "__main__":
    scraper_thread = threading.Thread(target=scrape_static_page)
    scraper_thread.start()
    start_server()

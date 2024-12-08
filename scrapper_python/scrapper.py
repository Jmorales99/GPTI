import requests
from bs4 import BeautifulSoup
import json
import os
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
import time
import random
from fake_useragent import UserAgent

ua = UserAgent()

def scrape_static_page():
    categories = ['administracion', 'arte', 'asistenteadministrativo', 'economia', 'educacion']

    data = {}
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
                "title": job_section.text,
                "link": job_section['href']
            })
        data[category] = job_data

        for job in job_data:
            job_url = job['link']
            job_response = requests.get(job_url, headers=headers)
            job_soup = BeautifulSoup(job_response.text, 'html.parser')
            job_info = job_soup.findAll('div', class_="job-item no-hover with-thumb pb-2 detalle")
            job_title = job_info[0].find('h2', class_='title font-weight-bold mb-2 heading-2').find('a').text
            job_description = job_info[0].find('p', class_= 'mb-0').text
            other_job_info = job_soup.find('table', class_="table table-sm")
            all_other_job_info = other_job_info.find_all('td')
            job_id = 0
            employer = ""
            city = ""
            job_type = ""
            for e in range(len(all_other_job_info)):
                if "ID" in all_other_job_info[e]:
                    job_id = all_other_job_info[e+1].find('a').text.strip()
                if "Buscado" in all_other_job_info[e]:
                    employer = all_other_job_info[e+1].find('a').text.strip()
                if "Ubica" in all_other_job_info[e].text:
                    city = all_other_job_info[e+1].find('a').text.strip()
                if "Tipo" in all_other_job_info[e]:
                    job_type = all_other_job_info[e+1].find('a').text.strip()
            job['title'] = job_title
            job['description'] = job_description
            job['company'] = employer
            job['city'] = city
            job['type'] = job_type
            time.sleep(random.uniform(1, 3))  # Random delay
        print(f"Scraped {len(job_data)} jobs from {category}")
        endpoint_url = os.getenv("API_URL", "http://localhost:3000/jobs/add")
        info = json.dumps({category: job_data})
        requests.post(endpoint_url, data=info)
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







# def run_scraper():
#     url = 'https://www.chiletrabajos.cl/'
#     response = requests.get(url)
#     soup = BeautifulSoup(response.text, 'html.parser')
#     categories = soup.find_all('li', class_='mt10 mb10')
#     for category in categories:
#         cat = category.find('a')
#         if "/trabajos"in cat['href']:
#             category = cat.text.strip().split("  ")[0]
#             print (category + " con link: "+ cat['href'])
#             response = requests.get(cat['href'])
#             soup = BeautifulSoup(response.text, 'html.parser')
#             pages = soup.find('ul', class_='pagination m-0 float-right')
#             next_page_url = pages.find('a', rel="next")
#             jobs = soup.find_all('div', class_='job-item with-thumb destacado no-hover')

#             while next_page_url != None:
#                 print(next_page_url)
#                 jobs_data = []
#                 for job in jobs:
#                     job_section = job.find('h2').find('a')
#                     # print(job_section['href'])
#                     job_data = requests.get(job_section['href'])
#                     job_data_parsed = BeautifulSoup(job_data.text, 'html.parser')
#                     # print(job_data_parsed)
#                     job_info = job_data_parsed.findAll('div', class_="job-item no-hover with-thumb pb-2 detalle")
#                     job_title = job_info[0].find('h2', class_='title font-weight-bold mb-2 heading-2').find('a').text
#                     job_description = job_info[0].find('p', class_= 'mb-0').text
#                     other_job_info = job_data_parsed.find('table', class_="table table-sm")
#                     all_other_job_info = other_job_info.find_all('td')
#                     job_id = 0

#                     employer = ""
#                     city = ""
#                     job_type = ""
#                     for e in range(len(all_other_job_info)):
#                         # print(all_other_job_info[e])
#                         if "ID" in all_other_job_info[e]:
#                             job_id = all_other_job_info[e+1].find('a').text.strip()
#                         if "Buscado" in all_other_job_info[e]:
#                             employer = all_other_job_info[e+1].find('a').text.strip()
#                         if "Ubica" in all_other_job_info[e].text:
#                             city = all_other_job_info[e+1].find('a').text.strip()
#                         if "Tipo" in all_other_job_info[e]:
#                             job_type = all_other_job_info[e+1].find('a').text.strip()

#                     link = job_section['href']
#                     job_json = {
#                         "title":job_title if job_title != "" else "UNKNOWN",
#                         "description":job_description if job_description != "" else "UNKNOWN",
#                         "link": link,
#                         "company":employer if employer != "" else "UNKNOWN",
#                         "category":category if category != "" else "UNKNOWN",
#                         "city":city if city != "" else "UNKNOWN",
#                     }

#                     endpoint_url = os.getenv("API_URL", "http://api:3000/jobs/add")
#                     info = json.dumps(job_json)
#                     requests.post(endpoint_url,data=job_json)

#                 headers = {
#                     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
#                 }
#                 response = requests.get(next_page_url['href'], headers=headers)
#                 soup = BeautifulSoup(response.text, 'html.parser')
#                 pages = soup.find('ul', class_='pagination m-0 float-right')
#                 next_page_url = pages.find('a', rel="next")
#                 jobs = soup.find_all('div', class_='job-item with-thumb destacado no-hover')


# cat = categories[0].find('a')
# if "/trabajos"in cat['href']:
#     print (cat.text.strip().split("  ")[0] + " con link: "+ cat['href'])
#     data[cat.text.strip().split("  ")[0]] = cat['href']
#     response = requests.get(cat['href'])
#     soup = BeautifulSoup(response.text, 'html.parser')
#     jobs = soup.find_all('div', class_='job-item with-thumb destacado no-hover')
#     job_section = jobs[0].find('h2').find('a')
#     print(job_section['href'])
#     job_data = requests.get(job_section['href'])
    
#     

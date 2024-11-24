import requests
from bs4 import BeautifulSoup
import json

url = 'https://www.chiletrabajos.cl/'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')
categories = soup.find_all('li', class_='mt10 mb10')

for category in categories:
    cat = category.find('a')
    if "/trabajos" in cat['href']:
        category_name = cat.text.strip().split("  ")[0]
        
        # Saltar la categoría "Administración"
        if category_name == "Administración":
            continue

        print(category_name + " con link: " + cat['href'])
        response = requests.get(cat['href'])
        soup = BeautifulSoup(response.text, 'html.parser')
        pages = soup.find('ul', class_='pagination m-0 float-right')
        next_page_url = pages.find('a', rel="next") if pages else None
        jobs = soup.find_all('div', class_='job-item with-thumb destacado no-hover')

        job_count = 0  # Contador para limitar a 10 trabajos por categoría
        while next_page_url is not None and job_count < 10:
            jobs_data = []
            for job in jobs:
                if job_count >= 10:  # Detener si ya se procesaron 10 trabajos
                    break

                job_section = job.find('h2').find('a')
                job_data = requests.get(job_section['href'])
                job_data_parsed = BeautifulSoup(job_data.text, 'html.parser')
                job_info = job_data_parsed.find_all('div', class_="job-item no-hover with-thumb pb-2 detalle")
                job_title = job_info[0].find('h2', class_='title font-weight-bold mb-2 heading-2').find('a').text if job_info else "UNKNOWN"
                job_description = job_info[0].find('p', class_='mb-0').text if job_info else "UNKNOWN"
                other_job_info = job_data_parsed.find('table', class_="table table-sm")
                all_other_job_info = other_job_info.find_all('td') if other_job_info else []

                job_id = "UNKNOWN"
                employer = "UNKNOWN"
                city = "UNKNOWN"
                job_type = "UNKNOWN"

                # Procesar información adicional
                for e in range(len(all_other_job_info)):
                    if e + 1 < len(all_other_job_info):  # Verificar que e+1 no exceda el índice máximo
                        if "ID" in all_other_job_info[e].text:
                            job_id = all_other_job_info[e+1].find('a').text.strip() if all_other_job_info[e+1] and all_other_job_info[e+1].find('a') else "UNKNOWN"
                        if "Buscado" in all_other_job_info[e].text:
                            employer = all_other_job_info[e+1].find('a').text.strip() if all_other_job_info[e+1] and all_other_job_info[e+1].find('a') else "UNKNOWN"
                        if "Ubica" in all_other_job_info[e].text:
                            city = all_other_job_info[e+1].find('a').text.strip() if all_other_job_info[e+1] and all_other_job_info[e+1].find('a') else "UNKNOWN"
                        if "Tipo" in all_other_job_info[e].text:
                            job_type = all_other_job_info[e+1].find('a').text.strip() if all_other_job_info[e+1] and all_other_job_info[e+1].find('a') else "UNKNOWN"
                
                link = job_section['href']
                job_json = {
                    "title": job_title,
                    "description": job_description,
                    "link": link,
                    "company": employer,
                    "category": category_name,
                    "city": city,
                }

                # Enviar al endpoint
                endpoint_url = "http://localhost:3000/jobs/add"
                requests.post(endpoint_url, json=job_json)
                
                job_count += 1  # Incrementar el contador de trabajos procesados

            if job_count >= 10:  # Detener el bucle si ya se procesaron 10 trabajos
                break
            
            # Siguiente página
            response = requests.get(next_page_url['href'])
            soup = BeautifulSoup(response.text, 'html.parser')
            pages = soup.find('ul', class_='pagination m-0 float-right')
            next_page_url = pages.find('a', rel="next") if pages else None
            jobs = soup.find_all('div', class_='job-item with-thumb destacado no-hover')

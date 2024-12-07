import requests
from bs4 import BeautifulSoup
import json
url = 'https://www.chiletrabajos.cl/'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')
categories = soup.find_all('li', class_='mt10 mb10')
for category in categories:
    cat = category.find('a')
    if "/trabajos"in cat['href']:
        category = cat.text.strip().split("  ")[0]
        print (category + " con link: "+ cat['href'])
        response = requests.get(cat['href'])
        soup = BeautifulSoup(response.text, 'html.parser')
        pages = soup.find('ul', class_='pagination m-0 float-right')
        next_page_url = pages.find('a', rel="next")
        jobs = soup.find_all('div', class_='job-item with-thumb destacado no-hover')

        while next_page_url != None:
            print(next_page_url)
            jobs_data = []
            for job in jobs:
                job_section = job.find('h2').find('a')
                # print(job_section['href'])
                job_data = requests.get(job_section['href'])
                job_data_parsed = BeautifulSoup(job_data.text, 'html.parser')
                # print(job_data_parsed)
                job_info = job_data_parsed.findAll('div', class_="job-item no-hover with-thumb pb-2 detalle")
                job_title = job_info[0].find('h2', class_='title font-weight-bold mb-2 heading-2').find('a').text
                job_description = job_info[0].find('p', class_= 'mb-0').text
                other_job_info = job_data_parsed.find('table', class_="table table-sm")
                all_other_job_info = other_job_info.find_all('td')
                job_id = 0

                employer = ""
                city = ""
                job_type = ""
                for e in range(len(all_other_job_info)):
                    # print(all_other_job_info[e])
                    if "ID" in all_other_job_info[e]:
                        job_id = all_other_job_info[e+1].find('a').text.strip()
                    if "Buscado" in all_other_job_info[e]:
                        employer = all_other_job_info[e+1].find('a').text.strip()
                    if "Ubica" in all_other_job_info[e].text:
                        city = all_other_job_info[e+1].find('a').text.strip()
                    if "Tipo" in all_other_job_info[e]:
                        job_type = all_other_job_info[e+1].find('a').text.strip()

                link = job_section['href']
                job_json = {
                    "title":job_title if job_title != "" else "UNKNOWN",
                    "description":job_description if job_description != "" else "UNKNOWN",
                    "link": link,
                    "company":employer if employer != "" else "UNKNOWN",
                    "category":category if category != "" else "UNKNOWN",
                    "city":city if city != "" else "UNKNOWN",
                }

                endpoint_url = "http://api:3000/jobs/add"
                info = json.dumps(job_json)
                requests.post(endpoint_url,data=job_json)

            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            response = requests.get(next_page_url['href'], headers=headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            pages = soup.find('ul', class_='pagination m-0 float-right')
            next_page_url = pages.find('a', rel="next")   
            jobs = soup.find_all('div', class_='job-item with-thumb destacado no-hover')


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

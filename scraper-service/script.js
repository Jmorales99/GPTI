const axios = require('axios');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const {executablePath} = require('puppeteer');

async function scrape(url) {
  let categories_and_jobs = [];
  try {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: executablePath(),
        timeout: 60000,
    });
    const page = await browser.newPage();
    await page.goto(url);

    const categories = await page.evaluate(() => {
      const categories = [];
      const categories_container = document.querySelector('#categoria');
      const categories_list = categories_container.querySelectorAll('li');

      categories_list.forEach(node => {
        let category = node.querySelector('a').innerText;
        category = category.replace(/\s+/g, ' ').trim();
        category = category.replace(/ \(\d+\)/g, '');
        const url = node.querySelector('a').href;
        categories.push({ category, url });
      });

      return categories;
    });

    for (const category of categories) {
      let all_jobs = [];
      try {
        console.log(`Scraping ${category.category}...`);
        await page.goto(category.url);
        let i = 0;
        while (true)
        {
            await page.setCacheEnabled(false);
            const jobs = await page.evaluate(() => {
              const jobs_array = [];
              const jobNodes = document.querySelectorAll('.job-item');
              jobNodes.forEach(node => {
                const title = node.querySelector('h2')?.innerText || 'No Title';
                const [companyAndCity, date] = [...node.querySelectorAll('h3')].map(h3 => h3.innerText);
                const link = node.querySelector('a')?.href || 'No Link';
                const [company, city] = companyAndCity ? companyAndCity.split(', ') : ['No Company', 'No City'];
                jobs_array.push({ title, company, city, date, link });
              });
              return jobs_array;
            });
            all_jobs.push(...jobs);
            const nextButtons = await page.evaluate(() => {
                const links = document.querySelectorAll('.pagination li');
                const lastButton = links[links.length - 1];
                if (lastButton.querySelector('b')) {
                    return [];
                }
                const buttons = document.querySelectorAll('.pagination a');
                return [...buttons].map(button => button.href);
            });
            if (nextButtons.length === 0) {
                break;
            }
            const lastButton = nextButtons[nextButtons.length - 1];
            await page.goto(lastButton);
        }

        sendCategoryJobs(category.category, all_jobs);
        console.log(`Scraped ${category.category} with ${all_jobs.length} jobs`);
        await new Promise(resolve => setTimeout(resolve, 3000));

      } catch (err) {
        sendCategoryJobs(category.category, all_jobs);
        console.log(`Scraped ${category.category} with ${all_jobs.length} jobs`);
        console.error(`Error scraping category ${category.category}:`, err.message);
      }
    }

    await browser.close();
    console.log('Scraping finished');
    sendJobs(categories_and_jobs);
  } catch (error) {
    console.error(`Error during scraping: ${error.message}`);
  }
}


async function sendCategoryJobs(category, jobs) {
  try {
    const response = await axios.post('http://localhost:3000/jobs', {
      category,
      jobs,
    });
    if (response.status === 200) {
      console.log(`Category ${category} received correctly`);
    }
  } catch (error) {
    console.error(`Error sending jobs: ${error.message}`);
  }
}

scrape('https://www.chiletrabajos.cl/');

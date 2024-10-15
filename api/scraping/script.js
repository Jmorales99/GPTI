// scraping/script.js
const puppeteer = require('puppeteer');
const { Job } = require('../models'); // Asegúrate de que la ruta sea correcta

module.exports = async function scrape(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const jobs = await page.evaluate(() => {
      const jobs = [];
      const jobNodes = document.querySelectorAll('.job-item');

      jobNodes.forEach(node => {
        const title = node.querySelector('h2').innerText;
        const [companyAndCity, date] = [...node.querySelectorAll('h3')].map(h3 => h3.innerText);
        const link = node.querySelector('a').href;
        const [company, city] = companyAndCity.split(', ');

        jobs.push({ title, company, city, date, link });
      });

      return jobs;
    });

    await browser.close();

    // Guardar los trabajos en la base de datos, ignorando duplicados
    await Job.bulkCreate(jobs, { ignoreDuplicates: true });

    return jobs;
  } catch (error) {
    throw new Error(`Error during scraping: ${error}`);
  }
};

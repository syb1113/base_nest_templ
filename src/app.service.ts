import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

interface JobInfo {
  job: {
    name: string | null;
    area: string | null;
    salary: string | null;
  };
  link: string;
  company: {
    name: string | null;
  };
  desc?: string | null;
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async startSpider() {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: {
        width: 0,
        height: 0,
      },
    });

    const page = await browser.newPage();
    await page.goto(
      'https://www.zhipin.com/web/geek/job?query=前端&city=100010000',
    );

    await page.waitForSelector('.job-list-box');

    const totalPageElement = await page.$('.options-pages a:nth-last-child(2)');
    let totalPage = 1;

    if (totalPageElement) {
      const textContent = await page.$eval(
        '.options-pages a:nth-last-child(2)',
        (e) => e.textContent?.trim() || '1',
      );
      totalPage = parseInt(textContent) || 1;
    }

    const allJobs: JobInfo[] = [];
    for (let i = 1; i <= totalPage; i++) {
      await page.goto(
        `https://www.zhipin.com/web/geek/job?query=前端&city=100010000&page=${i}`,
      );

      await page.waitForSelector('.job-list-box');

      const jobs = await page.$eval('.job-list-box', (el) => {
        return [...el.querySelectorAll('.job-card-wrapper')].map((item) => {
          return {
            job: {
              name: item.querySelector('.job-name')!.textContent,
              area: item.querySelector('.job-area')!.textContent,
              salary: item.querySelector('.salary')!.textContent,
            },
            link: item.querySelector('a')!.href,
            company: {
              name: item.querySelector('.company-name')!.textContent,
            },
          };
        });
      });

      allJobs.push(...jobs);
    }
    for (let i = 0; i < allJobs.length; i++) {
      await page.goto(allJobs[i].link);

      try {
        await page.waitForSelector('.job-sec-text');

        const jd = await page.$eval('.job-sec-text', (el) => {
          return el.textContent;
        });
        allJobs[i].desc = jd;

        console.log(allJobs[i]);
      } catch (e) {
        console.log(e);
      }
    }
  }
}

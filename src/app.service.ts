import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { Observable, Subscriber } from 'rxjs';
import pptxgen from 'pptxgenjs';

export interface UniversityData {
  name: string;
  img: string;
  link: string;
  desc: string;
}
let cache: UniversityData[];

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getUniversityData() {
    if (cache) {
      return cache;
    }
    async function getData(observer: Subscriber<Record<string, any>>) {
      const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: {
          width: 0,
          height: 0,
        },
      });

      const page = await browser.newPage();

      await page.goto('https://www.icourse163.org/university/view/all.htm');

      await page.waitForSelector('.u-usitys');

      const universityList = await page.$eval('.u-usitys', (el) => {
        return [...el.querySelectorAll('.u-usity')].map((item) => {
          return {
            name: item.querySelector('img')!.alt,
            img: item.querySelector('img')!.src,
            link: item.getAttribute('href')!,
            desc: '',
          };
        });
      });

      const ppt = new pptxgen();

      for (const item of universityList) {
        await page.goto(`https://www.icourse163.org${item.link}`);
        await page.waitForSelector('.m-cnt');
        const content = await page.$eval('.m-cnt', (el) => {
          return el.textContent || '';
        });
        item.desc = content;
        item.img = await page.$eval(
          '.g-doc img',
          (el) => el.getAttribute('src')!,
        );

        observer.next({ data: item });
        const slide = ppt.addSlide();

        slide.addText(item.name, {
          x: '10%',
          y: '10%',
          color: '#ff0000',
          fontSize: 30,
          align: ppt.AlignH.center,
        });

        slide.addImage({
          path: item.img,
          x: '42%',
          y: '25%',
        });

        slide.addText(item.desc, {
          x: '10%',
          y: '60%',
          color: '#000000',
          fontSize: 14,
        });
      }
      await browser.close();

      await ppt.writeFile({
        fileName: '中国所有大学.pptx',
      });

      cache = universityList;
    }

    return new Observable((observer) => {
      getData(observer);
    });
  }
}

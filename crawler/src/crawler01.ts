import superagent from 'superagent';
import cheerio from 'cheerio';

interface Couse {
  title: string;
  count: number;
}

class Crawler {
  // private _url = 'https://dianducs.mypep.cn/3.12/h5/CH_new_word.html';
  private _url = 'http://m.tunxue.com/guangzhou/kcyasi';
  private _html = '';

  getInfo(html: string) {
    const $ = cheerio.load(html);
    const couses = $('.media');

    const couseArr: Couse[] = [];

    //
    couses.map((index, ele) => {
      const title = $(ele).find('.media-heading').text();
      const popular = $(ele).find('p').text();
      const count = parseInt(popular.split('： ')[1]);
      couseArr.push({
        title,
        count,
      });
    });
    console.log(couseArr);

    const finalData = {
      time: new Date().getTime(),
      data: couseArr,
    };

    console.log(finalData);
    // console.log(couses.length);
  }

  async getHtml() {
    const htmlCode = await superagent.get(this._url);
    // console.log(htmlCode.text);
    this.getInfo(htmlCode.text);
  }

  constructor() {
    this.getHtml();
  }
}

const crawler = new Crawler();

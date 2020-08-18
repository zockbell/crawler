import fs from "fs";
import path from "path";
import superagent from "superagent";
import cheerio from "cheerio";

interface Course {
  title: string;
  count: number;
}

interface Content {
  [propName: number]: Course[];
}

class Crawler {
  private _url = "http://m.tunxue.com/guangzhou/kcyasi";
  private _html = "";

  getInfo(html: string) {
    const $ = cheerio.load(html);
    const couses = $(".media");

    const couseArr: Course[] = [];

    // 课程遍历
    couses.map((index, ele) => {
      const title = $(ele).find(".media-heading").text();
      const popular = $(ele).find("p").text();
      const count = parseInt(popular.split("： ")[1]);
      couseArr.push({
        title,
        count,
      });
    });
    // console.log(couseArr);

    const finalData = {
      time: new Date().getTime(),
      data: couseArr,
    };

    // console.log(finalData);
    // 爬取数据调用（最终数据，存放文件目录名）
    this.getCourseData(finalData, "data");
  }

  // 最终数据遍历存储
  getCourseData(finalData: any, dirName: string) {
    // 存放目录(先判断是否存在)
    // const fileDir = fs.existsSync("data");
    // console.log(fileDir);
    const createDir = (dir: any) =>
      !fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined;
    createDir(dirName); // 执行一次

    // 存放路径
    const filepath = path.resolve(
      __dirname,
      "../" + dirName + "/getCourse.json"
    );
    let fileContent: Content = {};
    if (fs.existsSync(filepath)) {
      fileContent = JSON.parse(fs.readFileSync(filepath, "utf-8"));
      console.log(fileContent);
    }
    fileContent[finalData.time] = finalData.data;
    fs.writeFileSync(filepath, JSON.stringify(fileContent));
  }

  async getHtml() {
    const htmlCode = await superagent.get(this._url);
    // console.log(htmlCode.text);
    return htmlCode.text;
  }

  // 方法统一调用
  async crawlerInit() {
    const html = await this.getHtml();
    const couseResult = this.getInfo(html);
  }

  constructor() {
    this.crawlerInit();
  }
}

const crawler = new Crawler();

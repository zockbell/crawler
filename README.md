## 使用typescript写一个爬虫系统

#### 一、基础环境配置

> 会让代码自动格式化，团队协作代码规范、格式统一。

1. 安装插件 `prettier` -- 此插件为自动格式化代码

2. 进入 首选项--设置 输入 `save` 然后找到 `Editor: Format On Save` 勾选即可

#### 二、项目工程搭建和配置

1. 使用命令 `npm init -y` 创建 `package.json`文件
2. 使用命令 `tsc --init` 创建 `tsconfig.json` 文件
3. 使用命令 `npm install typescript -D` 安装 `typescript`
4. 使用命令 `npm install ts-node -D` 安装 `ts-node`可以运行 `.ts` 文件
5. 在 `package.json` 文件中配置`"dev": "ts-node ./src/crowller.ts"`

#### 三、项目编写

1. 入口文件

   1. 创建 `src/crawler.ts` 入口文件，开始编写脚本代码
   2. 声明要爬取的网页，本例以一个教育网站为例，不会对原网站造成任何影响，只是为了实现数据展示，还可以为网站增加访问流量

2. 插件安装

   1. 安装 `superagent` 插件。SuperAgent是一个轻量级、灵活的、易读的、低学习曲线的客户端请求代理模块，使用在NodeJS环境中。可以在node中发送ajax请求。[具体使用参考官网](https://visionmedia.github.io/superagent/)

   2. 这里封装一个抓取页面内容的方法 ：

      ```typescript
      async getHtml() {
          const htmlCode = await superagent.get(this._url);
          // console.log(htmlCode.text);
          return htmlCode.text;
        }
      ```

      c. 内容分析，要对上面获取的html代码进行分析，需要安装 `cheerio` 这里可以封装一个方法 ：

      ```typescript
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
          this.getCourseData(finalData);
        }
      ```

3. 代码格式遍历转换，最终的爬取数据格式为：

   ```json
   {
     "1597479193275": [
       { "title": "雅思6分封闭直通车A计划", "count": 963 },
       { "title": "雅思6.5分钻石导师课程", "count": 1090 },
       { "title": "雅思6分钻石导师课程", "count": 1068 },
       { "title": "雅思预备6分培训班", "count": 1086 },
       { "title": "雅思7分VIP班", "count": 1076 },
       { "title": "英语雅思培训班", "count": 2132 }
     ],
     "1597479335423": [
       { "title": "雅思6分封闭直通车A计划", "count": 963 },
       { "title": "雅思6.5分钻石导师课程", "count": 1090 },
       { "title": "雅思6分钻石导师课程", "count": 1068 },
       { "title": "雅思预备6分培训班", "count": 1086 },
       { "title": "雅思7分VIP班", "count": 1076 },
       { "title": "英语雅思培训班", "count": 2132 }
     ],
     ......
   ```

#### 四、TypesSript的编译运转过程

以上我们全用`TS`成功爬取到了想要的数据，但是我们要把编译过的`js`文件拿给别人使用。

1. 修改 `tsconfig.json` 文件，修改：`"outDir": "./build",`
2. 修改 `package.json 中的 "scripts"` 在此项中添加 `"build": "tsc"`
3. 运行 `npm run build` 将会在 `build` 目录中生成相应的 `.js` 文件，此文件可以提供给别人使用。

#### 五、进一步简化开发流程

我们希望代码自动感知变化并自动运行生成，自我监控，我们需要安装 `nodemon`插件，运行 `npm install nodemon -D`

1. `package.json` 文件需要修改两处：

   * `"main": "./build/crawler.js",` 默认为 `index.js` 因为我们没有创建 `index.js` 所以要指定为：`"./build/crawler.js"`

   * `"scripts"` 配置

     ```json
     "scripts": {
         "build": "tsc -w",
         "start": "nodemon node ./build/crawler.js"
       },
     ```

2. 此时安装了 `nodemon` 当修改 `.js`文件时，控制台将时时监听并更新，控制台如下图：

   ![](D:\zock\crawler-github\crawler\crawler_chart\src\assets\1.png)

   > 需要注意，当修改.ts文件时，nodemon是不会监听变化的，需要修改它的配置。

3. 我们现在需要开两个命令行工具，先是运行 `npm run build` 将 `.ts`文件编译成 `./build/js` 文件。然后再运行 `npm run start` 监听 `./build/js` 文件下有没有发生变化。因为我们最终提供出去的就是 `./build/` 文件夹下的 `crawler.js` 文件，引用它就可以生成爬取数据内容。

4. 安装插件 `concurrently` 支持同时开启多个监听服务，修改 `package.json` 配置如下，并运行 `npm run dev`即可 启动：

   ```json
   "scripts": {
       "dev:build": "tsc -w",
       "dev:start": "nodemon node ./build/crawler.js",
       "dev": "concurrently npm:dev:*"
     },
   ```

   ![](D:\zock\crawler-github\crawler\crawler_chart\src\assets\2.png)

#### 六、前端使用vue-echarts对爬取的数据进行展示

1. 这里使用 `vue create crawler-chart` 创建一个 `vue` 项目，将爬取到的 `getCourse.json` 放在项目的 `./public/js/` 中。

2. 安装  `vue-echarts` 进行数据图表展示

   * ```vue
     import 'echarts/theme/dark';
     import ECharts from 'vue-echarts';
     ```

   * ```
     components: {
         'v-chart': ECharts,
       },
     ```

3. 效果图展示：

   ![](D:\zock\crawler-github\crawler\crawler_chart\src\assets\3.png)

#### 七、总结：

此项目是一个较轻的爬虫脚本系统，后期可以使用node以接口的形式输出，前端进行接口请求。
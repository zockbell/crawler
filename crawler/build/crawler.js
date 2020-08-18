"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var superagent_1 = __importDefault(require("superagent"));
var cheerio_1 = __importDefault(require("cheerio"));
var Crawler = /** @class */ (function () {
    function Crawler() {
        this._url = "http://m.tunxue.com/guangzhou/kcyasi";
        this._html = "";
        this.crawlerInit();
    }
    Crawler.prototype.getInfo = function (html) {
        var $ = cheerio_1.default.load(html);
        var couses = $(".media");
        var couseArr = [];
        // 课程遍历
        couses.map(function (index, ele) {
            var title = $(ele).find(".media-heading").text();
            var popular = $(ele).find("p").text();
            var count = parseInt(popular.split("： ")[1]);
            couseArr.push({
                title: title,
                count: count,
            });
        });
        // console.log(couseArr);
        var finalData = {
            time: new Date().getTime(),
            data: couseArr,
        };
        // console.log(finalData);
        // 爬取数据调用（最终数据，存放文件目录名）
        this.getCourseData(finalData, "data");
    };
    // 最终数据遍历存储
    Crawler.prototype.getCourseData = function (finalData, dirName) {
        // 存放目录(先判断是否存在)
        // const fileDir = fs.existsSync("data");
        // console.log(fileDir);
        var createDir = function (dir) {
            return !fs_1.default.existsSync(dir) ? fs_1.default.mkdirSync(dir) : undefined;
        };
        createDir(dirName); // 执行一次
        // 存放路径
        var filepath = path_1.default.resolve(__dirname, "../" + dirName + "/getCourse.json");
        var fileContent = {};
        if (fs_1.default.existsSync(filepath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filepath, "utf-8"));
            console.log(fileContent);
        }
        fileContent[finalData.time] = finalData.data;
        fs_1.default.writeFileSync(filepath, JSON.stringify(fileContent));
    };
    Crawler.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            var htmlCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, superagent_1.default.get(this._url)];
                    case 1:
                        htmlCode = _a.sent();
                        // console.log(htmlCode.text);
                        return [2 /*return*/, htmlCode.text];
                }
            });
        });
    };
    // 方法统一调用
    Crawler.prototype.crawlerInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var html, couseResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getHtml()];
                    case 1:
                        html = _a.sent();
                        couseResult = this.getInfo(html);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Crawler;
}());
var crawler = new Crawler();

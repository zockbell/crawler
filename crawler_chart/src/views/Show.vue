<template>
  <div>
    <h2>深色模式适配</h2>
    <v-chart :options="orgOptions" />
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import 'echarts/theme/dark';
import ECharts from 'vue-echarts';

export default {
  components: {
    'v-chart': ECharts,
  },
  data() {
    return {
      orgOptions: {}, // 图表配置
      courseData: {}, // 课程数据
      courseName: [], // 课程名称
      courseTime: [], // 课程时间
      tempData: {}, // 图表临时数据
      seriesData: [], // 图表详细数据
    };
  },
  created() {
    // 数据请求
    axios
      .get('/js/getCourse.json')
      .then((res) => {
        this.courseData = res.data;
        console.log(this.courseData);
        for (let i in this.courseData) {
          const item = this.courseData[i];
          this.courseTime.push(moment(Number(i)).format('YYYY-MM-DD HH:mm:ss'));
          item.forEach((innerItem) => {
            const { title, count } = innerItem;
            if (this.courseName.indexOf(title) == -1) {
              this.courseName.push(title);
            }
            this.tempData[title]
              ? this.tempData[title].push(count)
              : (this.tempData[title] = [count]);
          });
        }
        console.log(this.tempData);
        for (let i in this.tempData) {
          this.seriesData.push({
            name: i,
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              position: 'insideRight',
            },
            data: this.tempData[i],
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {},
  mounted() {
    // 图表配置项
    this.orgOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      legend: {
        data: this.courseName,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: this.courseTime,
      },
      series: this.seriesData,
    };
  },
};
</script>

<style>
.echarts {
  width: 100%;
  height: 600px;
}
</style>

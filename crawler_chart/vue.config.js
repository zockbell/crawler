module.exports = {
  devServer: {
    host: '0.0.0.0',        // 设置主机地址
    port: 9080,             // 设置默认端口
    open: true,             // 启动项目自动打开浏览器
  },
  transpileDependencies: ['vue-echarts', 'resize-detector'],
};

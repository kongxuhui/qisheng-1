import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
var Chart = null;
var Chart1 = null;

var xdata = [];
var xdata2 = [];

var ydata1 = [];
var ydata2 = [];

Page({
  data: {
    selectData: [],
    current_mon: '',
    index: '4',
    ec1: {
      lazyLoad: true
    },
    ec2: {
      lazyLoad: true
    },
  },
  onLoad() {
    if (!app.globalData.userInfo) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '用户暂未登录，请登录',
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '../login/login',
            })
          } else if (res.cancel) {
            _this.onShow();
          }
        }
      })
    } else if (app.globalData.userInfo.state == '1') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '用户已冻结，请联系管理员',
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '../login/login',
            })
          }
        }
      })
    } else if (app.globalData.userInfo.state == '2') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '用户待审核，请等待',
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '../personCenter/personCenter',
            })
          }
        }
      })
    } else if (app.globalData.userInfo.state == '4') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '用户审核不通过，请重新完善资料',
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '../personCenter/personCenter',
            })
          }
        }
      })
    } else {
      this.setData({
        selectData: this.getVersion()
      });
      this.setData({
        current_mon: this.getVersion()[4].replace(/年/, "-")
      });
      this.setData({
        current_mon: this.data.current_mon.replace(/月/, "")
      });
      this.echartsComponnet1 = this.selectComponent('#mychart-dom-multi-bar');
      this.echartsComponnet2 = this.selectComponent('#mychart-dom-pie');
      app.wxRequest('qisheng/Customerprograme/power_money.html', 'post', { company_id: '1' }, this.getData2, this.error)
      app.wxRequest('qisheng/Customerprograme/power_consist.html', 'post', { company_id: '1', month_data: this.data.current_mon }, this.getData3, this.error)
    } 
  },
  getVersion: function () {
    //创建现在的时间
    var data = new Date();
    //获取年
    var year = data.getFullYear();
    //获取月
    var mon = data.getMonth() + 2;
    var arry = new Array();
    // debugger
    for (var i = 0; i < 6; i++) {
      mon = mon - 1;
      if (mon <= 0) {
        year = year - 1;
        mon = mon + 12;
      }
      if (mon < 10) {
        mon = "0" + mon;
      }

      arry[i] = year + "年" + mon + '月';
    }

    return arry.reverse(); 
  },
  Change: function (e) {
    var _this = this
    _this.setData({
      index: e.detail.value,
      current_mon: _this.data.selectData[e.detail.value]
    })
    _this.setData({
      current_mon: _this.data.current_mon.replace(/年/, "-")
    });
    _this.setData({
      current_mon: _this.data.current_mon.replace(/月/, "")
    });
    app.wxRequest('qisheng/Customerprograme/power_consist.html', 'post', { company_id: '1', month_data: _this.data.current_mon }, this.getData3, this.error)
  },
  onReady() {
  },
  getData2: function (data) {
    xdata2 = [];
    ydata2 = [];
    data.data.obj.forEach((item) => {
      xdata2.push(item.forecast_date.substr(item.forecast_date.length - 8))
      ydata2.push(item.power_count_money)
    })
    this.getData1()
  },
  getData3: function (data) {
    xdata = [];
    var arr;

    for (var s in data.data.obj) {
      arr = data.data.obj.map(item => {
        return {
          value: item[Object.keys(item)[3]],
          name: item[Object.keys(item)[2]]
        }
      })
    }
    xdata = arr;
    this.getData()
  },
  getData: function () {
    //如果是第一次绘制
    // if (!Chart) {
    this.init_echarts(); //初始化图表
    // } else {
    //   this.setOption(Chart); //更新数据
    // }
  },
  init_echarts: function () {
    this.echartsComponnet2.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      // Chart.setOption(this.getOption());
      this.setOption(Chart);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function (Chart) {
    Chart.clear();  // 清除
    Chart.setOption(this.getOption(xdata));  //获取新数据
  },
  getOption: function (xdata) {
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '每月电费构成饼状图',
        textStyle: {
          //字体大小
          fontSize: 12
        },
        x: 'center',
        y: 'bottom',
      },
      legend: {
        orient: 'horizontal',
        icon: "circle",
        itemWidth: 8,
        bottom: 20,
        left: 'center',
        data: ['政府收费', '企业用电', '其他杂费']
      },
      backgroundColor: "#ffffff",
      color: ["#37A2DA", "#32C5E9", "#67E0E3"],
      series: [{
        animationType: 'scale',
        silent: true,
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '40%'],
        radius: [0, '40%'],
        data: xdata
      }]
    };
    return option;
  },
  getData1: function () {
    //如果是第一次绘制
    // if (!Chart) {
    this.init_echarts1(); //初始化图表
    // } else {
    //   this.setOption(Chart); //更新数据
    // }
  },
  init_echarts1: function () {
    this.echartsComponnet1.init((canvas, width, height) => {
      // 初始化图表
      Chart1 = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      // Chart.setOption(this.getOption());
      this.setOption1(Chart1);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart1;
    });
  },
  setOption1: function (Chart1) {
    Chart1.clear();  // 清除
    Chart1.setOption(this.getOption1(xdata2, ydata2));  //获取新数据
  },
  getOption1: function (xdata2, ydata2) {
    // 指定图表的配置项和数据
    var option = {
      color: ['#37a2da',],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      title: {
        text: '当月15分钟用电量',
        textStyle: {
          //字体大小
          fontSize: 12
        },
        x: 'center',
        y: 'bottom',
      },
      // legend: {
      //   data: ['热度',]
      // },
      grid: {
        left: 20,
        right: 20,
        bottom: 45,
        top: 40,
        containLabel: true
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: xdata2,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      series: [
        {
          name: '用电量',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true
            }
          },
          data: ydata2
        }
      ]
    };
    return option;
  },
});
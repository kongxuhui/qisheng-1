import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
function getDay(day){
  var today = new Date();
  var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  return tYear+"-"+tMonth+"-"+tDate;
}
function doHandleMonth(month){
  var m = month;
  if(month.toString().length == 1){
   m = "0" + month;
  }
  return m;
}
var Chart = null;
var Chart1 = null;

var xdata = [];
var xdata1 = [];
var xdataLegend = [];

var ydata1 = [];
var ydata2 = [];
var ydata3 = []; 
var name = '';
Page({
  data: {
    selectData: [
      { id: '1', name: '15分钟'},
      { id: '2', name: '每日' },
      { id: '4', name: '每月' },
      { id: '5', name: '每年' },
    ],
    index: 0,
    current_id: '',
    current_time: '',
    ec1: {
      lazyLoad: true
    },
    ec2: {
      lazyLoad: true
    },
    name: '15分钟',
    today_power: '',
    totall_power: ''
  },
  onLoad() {
    if (app.globalData.checkLogin){
      if(app.globalData.userInfo){
        if (app.globalData.userInfo.state == '1') {
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
          this.echartsComponnet1 = this.selectComponent('#mychart-dom-multi-bar');
          this.echartsComponnet2 = this.selectComponent('#mychart-dom-line');
          app.wxRequest('qisheng/Customerprograme/home_page.html', 'post', { company_id: app.globalData.userInfo.company_id }, this.getData3, this.error)
        }
      }
    }else{
      app.checkLoginReadyCallback = () => {
        if(app.globalData.userInfo){
          if (app.globalData.userInfo.state == '1') {
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
            this.echartsComponnet1 = this.selectComponent('#mychart-dom-multi-bar');
            this.echartsComponnet2 = this.selectComponent('#mychart-dom-line');
            app.wxRequest('qisheng/Customerprograme/home_page.html', 'post', { company_id: app.globalData.userInfo.company_id }, this.getData3, this.error)
          }
        }
      }
    }
    
  },
  onReady() {
  },
  // getData2: function (data) {
  //   var _this = this
  //   xdata2 = [];
  //   ydata2 = [];
  //   ydata3 = [];
  //   data.data.obj.forEach((item) => {
  //     xdata2.push(item.datat)
  //     ydata2.push(item.buy_electricity)
  //     ydata3.push(item.get_use_electricity)
  //   })
  //   this.getData1()
  // },
  getData3: function (data) {
    xdata = [];
    xdata1 = [];
    ydata1 = this.getDest(data.data.obj);
    xdataLegend = [];
    ydata2 = [];
    ydata3 = [];
    data.data.obj.buy_lst.forEach((item, index) => {
      // if(index != 5){
        xdata1.push(item.buy_date.substring(0, 7))
        ydata2.push(item.buy_count)
        ydata3.push(item.use_count)
      // }
    })
    data.data.obj.lst.forEach((item) => {
      ydata1.push(item.avg_electricity_load)
      xdata.push(item.forecast_date.substring(0, 10))
    })
    this.setData({
      today_power: data.data.obj.today_power,
      totall_power: data.data.obj.totall_power
    })
    // this.getDest(data.data.obj).forEach((item) => {
    //   xdataLegend.push(item.name)
    // })
    // this.getDestTime(data.data.obj).forEach((item) => {
    //   xdata.push(item.month_data)
    // })
    // xdata = xdata.reverse();
    this.getData()
    this.getData1()
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
    Chart.setOption(this.getOption(xdata, ydata1));  //获取新数据
  },
  getDest: function(arr){
    var map = {},
    dest = [];
    for (var i = 0; i < arr.length; i++) {
      var ai = arr[i];
      if (!map[ai.power_from_name]) {
        dest.push({
          // month_data: ai.month_data,
          type: 'line',
          smooth: true,
          name: ai.power_from_name,
          data: [ai.power_from_price],
          // data2: [ai.month_data]
        });
        map[ai.power_from_name] = ai;
      } else {
        for (var j = 0; j < dest.length; j++) {
          var dj = dest[j];
          if (dj.name == ai.power_from_name) {
            dj.data.push(ai.power_from_price);
            break;
          }
        }
      }
    }
    return dest
  },
  getDestTime: function (arr) {
    var map = {},
      dest = [];
    for (var i = 0; i < arr.length; i++) {
      var ai = arr[i];
      if (!map[ai.month_data]) {
        dest.push({
          month_data: ai.month_data,
        });
        map[ai.month_data] = ai;
      }
    }
    return dest
  },
  getOption: function (xdata, ydata1) {
    // 指定图表的配置项和数据
    var option = {
      backgroundColor: 'rgba(13,120,113,.1)',
      title: {
        text: '近7天用电负荷曲线',
        textStyle: {
          //字体大小
          fontSize: 12,
          color: '#0D7871'
        },
        x: 12,
        y: 14,
      },
      color: "#0D7871",
      // legend: {
      //   data: xdataLegend,
      //   top: 0,
      //   left: 'center',
      //   z: 100
      // },
      grid: {
        left: 10,
        right: 20,
        bottom: 20,
        top: 40,
        containLabel: true
      },
      tooltip: {
        show: true,
        backgroundColor: 'rgba(13,120,113,.5)',
        formatter: function(params) {
          const item = params[0];
          // var aa = getDay(item.dataIndex - 7)
          // console.log(aa)
          var aa = xdata[6 - item.dataIndex]
          return `${aa} \n 用电量： ${item.value}KWh`
        },
        position: function (point, params, dom, rect, size) {
          var x = 0; // x坐标位置
          var y = 28; // y坐标位置
          // 当前鼠标位置
          var pointX = point[0];
          var pointY = point[1];
          var boxWidth = size.contentSize[0];
          var boxHeight = size.contentSize[1];
          if (boxWidth > pointX) {
            x = pointX + 20;
          } else {
            x = pointX - boxWidth - 20;
          }
          return [x, y];
        },
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {    // 坐标轴标签
          color: '#0D7871'  // 默认取轴线的颜色 
        },
        axisPointer: {
            snap: true,
            lineStyle: {
                color: '#0D7871',
                opacity: 1,
                width: 1
            },
        },
        axisLine:{
          lineStyle:{
              color:'#fff',
              // width:8,//这里是为了突出显示加上的
          }
        },
        axisTick:{       //y轴刻度线
          show:false
        },
        // data: xdata,
        data: [1,2,3,4,5,6,7],
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: ['#fff']
          }
        },
        axisLine:{
          lineStyle:{
              color:'#fff',
              // width:8,//这里是为了突出显示加上的
          }
        },
        axisTick:{       //y轴刻度线
          show:false
        },
        axisLabel: {
            formatter: function(){
                  return "";
            }
        }
        // show: false
      },
      series: [
      {
        name: '用电量',
        type: 'line',
        smooth: true,
        data: ydata1
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
    Chart1.setOption(this.getOption1(xdata1, ydata2, ydata3));  //获取新数据
  },
  getOption1: function (xdata1, ydata2, ydata3) {
    // 指定图表的配置项和数据
    var option = {
      backgroundColor: 'rgba(13,120,113,.1)',
      tooltip: {
        show: true,
        backgroundColor: 'rgba(13,120,113,.5)',
        textStyle: {   // 提示框内容的样式
          color: '#fff',
          fontSize: 9
        },
        formatter: function(params) {
          const item0 = params[0];
          const item1 = params[1];
          var aa = xdata1[item0.dataIndex]
          return `${aa} \n 购电量： ${item0.value}KWh\n用电量： ${item1.value}KWh`
        },
        position: function (point, params, dom, rect, size) {
          var x = 0; // x坐标位置
          var y = 28; // y坐标位置
          // 当前鼠标位置
          var pointX = point[0];
          var pointY = point[1];
          var boxWidth = size.contentSize[0];
          var boxHeight = size.contentSize[1];
          if (boxWidth > pointX) {
            x = pointX + 20;
          } else {
            x = pointX - boxWidth - 20;
          }
          return [x, y];
        },
        trigger: 'axis'
      },
      title: {
        text: '近半年企业购电量和用电量对比',
        textStyle: {
          //字体大小
          fontSize: 12,
          color: '#0D7871'
        },
        x: 12,
        y: 12,
      },
      color: ["#0D7871", "#6CACA8"],
      legend: {
        top: '12',
        right: '12',
        textStyle: {  // 图列内容样式
          color: '#0D7871',  // 字体颜色
        },
        data: ['购电量', '用电量']
      },
      grid: {
        left: 10,
        right: 20,
        bottom: 20,
        top: 40,
        containLabel: true
      },
      yAxis: [
        {
          x: 'center',
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: ['#fff']
            }
          },
          axisLine:{
            lineStyle:{
                color:'#fff',
                // width:8,//这里是为了突出显示加上的
            }
          },
          axisTick:{       //y轴刻度线
            show:false
          },
          axisLabel: {
              formatter: function(){
                    return "";
              }
          }
        }
      ],
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          axisLabel: {    // 坐标轴标签
            color: '#0D7871'  // 默认取轴线的颜色 
          },
          boundaryGap: true,
          data: [1,2,3,4,5,6],
          // axisPointer: {
          //   snap: true,
          //   lineStyle: {
          //       color: '#0D7871',
          //       opacity: 1,
          //       width: 1
          //   },
          // },
          axisLine:{
            lineStyle:{
                color:'#fff',
                // width:8,//这里是为了突出显示加上的
            }
          },
        }
      ],
      series: [
        {
          name: '购电量',
          type: 'bar',
          barGap: 0,
          barWidth: 16,
          // stack: '总量',
          data: ydata2
        },
        {
          name: '用电量',
          type: 'bar',
          barWidth: 16,
          // stack: '总量',
          data: ydata3
        }
      ]
    };
    return option;
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0 //这个数是，tabBar从左到右的下标，从0开始
      })
    }
    if(app.globalData.open_id){
      var postData = {
        open_id: app.globalData.open_id
      }
      app.wxRequest('qisheng/User/detail.html', 'post', postData, (data) => {
        if(app.globalData.userInfo){
          if(data.data.obj.state != app.globalData.userInfo.state){
            app.globalData.userInfo = data.data.obj;
            wx.setStorage({
              key: "userInfo",
              data: data.data.obj
            })
          }
        }
      }, this.error)
    }
  }
});
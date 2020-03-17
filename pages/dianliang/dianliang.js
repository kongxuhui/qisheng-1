// pages/batchCar/batchCar.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingShow: false,
    showModalStatus: false,
    trainApprovalList: [],
    currentDate:　{},
    inputValue: '',
    hasMore: false,
    finish: false,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
          }
        }
      })
    } else if (app.globalData.userInfo.state == 1) {
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
    } else if (app.globalData.userInfo.state == 2) {
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
    } else if (app.globalData.userInfo.state == 4) {
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
      app.wxRequest('qisheng/Customerprograme/every_day.html', 'post', { company_id: app.globalData.userInfo.company_id, page: this.data.page }, this.getData2, this.error)
    }
  },
  getData2:function(data){
    if(!this.data.hasMore){
      this.setData({
        trainApprovalList: data.data
      });
    }else{
      if(data.data.length != 0){
        this.setData({
          hasMore: false,
          trainApprovalList: this.data.trainApprovalList.concat(data.data)
        });
      }else{
        this.setData({
          hasMore: false,
          finish: true
        });
      }
    }
  },
  loadMoreData: function(){
    var that = this;
    that.setData({
      hasMore: true
    });
    app.wxRequest('qisheng/Customerprograme/every_day.html', 'post', { company_id: app.globalData.userInfo.company_id, page: that.data.page +=1  }, this.getData2, this.error)
  },
  onReachBottom: function(){
    console.log(1)
    var that =this;
    that.loadMoreData();
  },
  handleLongPress: function (e) {
      this.setData({
        currentDate: e.currentTarget.dataset.id
      });
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  submit: function (e){
    var currentStatu = e.currentTarget.dataset.statu;
    const _this = this
    _this.util(currentStatu)
    app.wxRequest('qisheng/Customerprograme/customer_adjust_power.html', 'post', { id: _this.data.currentDate.id, use_electricity_adjust: _this.data.inputValue}, this.onLoad, this.error)
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1 //这个数是，tabBar从左到右的下标，从0开始
        })
      }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
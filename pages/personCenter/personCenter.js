
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: false,
    userInfo:{},
    getCodeBtnTxt:'设置密码',
    avatar: '',
    state: ['正常','冻结','待审核','审核通过','审核不通过']
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onShow();
    this.setData({
      avatar: wx.getStorageSync('avatar')
    })
    if (Boolean(wx.getStorageSync('userInfo'))){
      this.setData({
        login: true
      })
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }else{
      this.setData({
        login: false
      })
    }
  },
  tabWebview: function () {
    wx.navigateTo({
      url: '../webView/webView'
    })
  },
  sao: function(){
    wx.scanCode({
      success(res) {
        let url = encodeURIComponent(res.result)
        wx.navigateTo({
          url: '../equipmentView/equipmentView?url=' + url
        })
      }
    })
  },
  // 进入登录页面
  tabLogin: function(e){
    wx.navigateTo({
      url: '../phoneLogin/phoneLogin'
    })
  },
  tabPersonalInfo: () => {
    wx.navigateTo({
      url: '../editPersonInfo/editPersonInfo'
    })
  },
  goout: function() {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确定要退出么？',
      success(res) {
        if (res.confirm) {
          _this.setData({
            login: false
          })
          wx.clearStorage()
          wx.reLaunch({
            url: '../login/login'
          })
        } else if (res.cancel) {
          return false
        }
      }
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
          selected: 2 //这个数是，tabBar从左到右的下标，从0开始
        })
      }
    // if (Boolean(wx.getStorageSync('userInfo'))) {
    //   this.setData({
    //     login: true
    //   })
    //   this.setData({
    //     userInfo: wx.getStorageSync('userInfo')
    //   })
    //   if (this.data.userInfo.loginPwd !== ''){
    //     this.setData({
    //       getCodeBtnTxt: '修改密码'
    //     })
    //   }
    // } else {
    //   this.setData({
    //     login: false
    //   })
    // }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
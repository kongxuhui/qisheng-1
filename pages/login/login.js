//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    loadingShow: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../phoneLogin/phoneLogin'
    })
  },
  onLoad: function () {
    var _this = this;
    if (app.globalData.userInfo) {
      _this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (_this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        _this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          _this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function () {
    this.setData({
      loadingShow: false
    })
  },
  getUserInfo: function (e) {
    var _this = this;
    console.log(e)
    app.globalData.avatar = e.detail.userInfo.avatarUrl
    app.globalData.avatar = e.detail.userInfo.avatarUrl
    app.globalData.encryptedData = e.detail.encryptedData
    wx.setStorage({
      key: "avatar",
      data: app.globalData.avatar
    })
    app.globalData.iv = e.detail.iv
    var postData = {
      open_id: app.globalData.open_id
    }
    app.wxRequest('qisheng/User/detail.html', 'post', postData, _this.getDetail, _this.error)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.setData({
      loadingShow: true
    })
    // wx.navigateTo({
    //   url: '../phoneLogin/phoneLogin'
    // })
  },
  getDetail:function(data){
    var _this = this
    if(data.data.obj == null){
      wx.navigateTo({
        url: '../phoneLogin/phoneLogin'
      })
    } else if (data.data.obj.true_name == null){
      app.globalData.user_id = data.data.obj.user_id
      wx.navigateTo({
        url: '../completeMaterial/completeMaterial'
      })
    }else{
      // app.wxRequest('qisheng/User/temp_del.html', 'post', { user_id: data.data.obj.user_id }, _this.bindViewTap, _this.error)
      wx.setStorage({
        key: "userInfo",
        data: data.data.obj
      })
      app.globalData.userInfo = data.data.obj
      wx.switchTab({
        url: '../personCenter/personCenter',
      })
    }
  }
})

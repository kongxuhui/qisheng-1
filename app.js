//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // _this.globalData.userInfo = wx.getStorageSync('userInfo') || []
    var _this = this
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          _this.globalData.code = res.code;
          var postData = {
            code: _this.globalData.code
          }
          _this.wxRequest('qisheng/Customerprograme/get_unionid.html', 'post', postData, _this.getOpen_id, _this.error)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  globalData: {
    checkLogin: false,
    state: '',
    avatar: '',
    open_id: "",
    encryptedData: "",
    iv: "",
    sessionKey: "",
    wx_id: '',
    mobile: '',
    token: '',
    name: '',
    code: '',
    user_id: '',
    // URL: 'http://192.168.139.142:8080',
    URL: 'https://wx.sdkndsm.com/qishen/tp5/public/index.php/',
    userInfo: wx.getStorageSync('userInfo') || null
  },
  wxRequest(url, method, data, callback, errFun) {
    wx.request({
      url: this.globalData.URL + url,
      method: method,
      // data: JSON.parse((JSON.stringify(data) + JSON.stringify(this.globalData.paramData)).replace(/}{/, ',')),
      data: data,
      header: {
        'content-type': method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      dataType: 'json',
      success: function (res) {
        callback(res);
      },
      fail: function (err) {
        errFun(err);
      }
    })
  },
  getOpen_id: function (data) {
    var _this = this
    _this.globalData.open_id = data.data.obj.open_id;
    _this.globalData.sessionKey = data.data.obj.session_key;
    var postData = {
      open_id: _this.globalData.open_id
    }
    _this.globalData.checkLogin = true;
    if(wx.getStorageSync('userInfo')){
      if (_this.checkLoginReadyCallback){
        _this.checkLoginReadyCallback();
      }
    }
    _this.wxRequest('qisheng/User/detail.html', 'post', postData, _this.getDetail, _this.error)
  },
  getDetail: function(data){
    if(!wx.getStorageSync('userInfo')){
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
    }else if(data.data.obj.state != wx.getStorageSync('userInfo').state){
      this.globalData.userInfo = data.data.obj;
      wx.setStorage({
        key: "userInfo",
        data: data.data.obj
      })
    }
  }
})
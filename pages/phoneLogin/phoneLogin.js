// pages/phoneLogin/phoneLogin.js
var utils = require('../../utils/getCode.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,//默认按钮1显示，按钮2不显示
    sec: "30",//设定倒计时的秒数
    loadingShow: false,
    currentSessionKey: ''
  },
  getPhoneNumber: function (e) {
    var _this = this
    const { encryptedData, iv } = e.detail;
    const options = { encryptedData: encryptedData, iv: iv, sessionKey: _this.data.currentSessionKey };
    this.doGetPhone(options);
  },
  doGetPhone: function (options) {
    const {
      sessionKey,
      encryptedData,
      iv
    } = options;

    const here = this;
    // 向Python服务器请求解密
    wx.request({
      // 这里是解密用的接口，就不放出来了，按照文档去做一个就好
      url: 'https://wx.sdkndsm.com/qishen/tp5/public/index.php/qisheng/Customerprograme/decryptData.html',
      method: 'POST',
      data: {
        sessionKey: sessionKey,
        encryptedData: encryptedData,
        iv: iv
      },
      success(res) {
        // 最终获取到用户数据，国家代号前缀、不带前缀的手机号。默认是不带前缀
        const { countryCode, purePhoneNumber } = JSON.parse(res.data.obj.result);
        app.globalData.mobile = purePhoneNumber;
        here.pageForward(purePhoneNumber);
      },
      fail(error) {
        console.log(error);
      }
    })
  },
  pageForward: function(data){
    var _this = this
    var postData = {
      open_id: app.globalData.open_id,
      phone: data,
      user_type: 1
    }
    app.wxRequest('qisheng/User/add_or_save.html', 'post', postData, _this.getDetail, _this.error)
  },
  getPersonProtocol(){
    wx.navigateTo({
      url: '../personProtocol/personProtocol',
    })
  },
  getDetail(data){
    app.globalData.user_id = data.data.obj.user_id
    wx.navigateTo({
      url: '../completeMaterial/completeMaterial'
    })
  },
  reLogin: function () {
    const _this = this;
    wx.login({
      success(res) {
        if (res.code) {
          var postData = {
            code: res.code
          }
          app.wxRequest('qisheng/Customerprograme/get_unionid.html', 'post', postData, _this.getSessionKey, _this.error)
        }
      },
      error(error) {
        throw error;
      }
    });
  },
  getSessionKey: function (data) {
    const _this = this;
    if (data.data.obj) {
      app.globalData.open_id = data.data.obj.open_id
      const result = data.data.obj.session_key;
      // 刷新本次session_key
      _this.setData({ currentSessionKey: result });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reLogin();
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

  },
})
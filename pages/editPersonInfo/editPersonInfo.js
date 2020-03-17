// pages/personalInfo/personalInfo.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: ['山西省', '太原市', '小店区'],
    selectData: [],
    index: '',
    current_id: '',
    company_name: '',
    imgs: [],//本地图片地址数组
    picPaths: [],//网络路径
    area: '',
    avatar: '',
    flag:'',
    currentSessionKey: ''
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  formSubmit: function (e) {
    var _this = this
    var postData = {
      company_id: _this.data.current_id,
      company_name: _this.data.company_name,
      true_name: e.detail.value.true_name,
      user_id: _this.data.userInfo.user_id,
      common: e.detail.value.common,
    }
    app.wxRequest('qisheng/User/add_or_save.html', 'post', postData, _this.addPerson, _this.error)
  },
  getData: function (data) {
    this.setData({
      loadingShow: false
    })
    let _this = this;
    if (data.data.code === '000000') {
      wx.setStorage({
        key: "userInfo",
        data: data.data.user
      })
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1500,
        success: function () {
          setTimeout(function () {
            wx.hideLoading({
              success: function () {
                wx.switchTab({
                  url: '../personCenter/personCenter'
                })
              }
            })
          }, 1500)
        }
      })
    }
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
  pageForward: function (data) {
    var _this = this
    let phone = "userInfo.phone"
    _this.setData({
      [phone]: data
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
  addPerson: function (data) {
    app.globalData.userInfo = data.data.obj
    wx.setStorage({
      key: "userInfo",
      data: data.data.obj
    })
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('userInfo') == ''){
      
    }else{
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        avatar: wx.getStorageSync('avatar')
      })
      app.wxRequest('qisheng/Company/lst.html', 'post', {}, this.getData2, this.error)
      this.reLogin();
      console.log(wx.getStorageSync('userInfo'))

      if (this.data.userInfo.state == "3" || this.data.userInfo.state == "4") {
        this.setData({
          flag: true
        })
      } else {
        this.setData({
          flag: false
        })
      }
    }
  },
  getData2: function (data) {
    var arr;
    var obj1 = { name: '请选择企业', id: '' };
    for (var s in data.data.data) {
      arr = data.data.data.map(item => {
        return {
          name: item[Object.keys(item)[1]],
          id: item[Object.keys(item)[0]]
        }
      })
    }
    arr.unshift(obj1)
    this.setData({
      selectData: arr,
      current_id: app.globalData.userInfo.company_id
    });
    this.data.selectData.forEach((ele, index) => {
      if (ele.id == this.data.current_id){
        this.setData({
          index: index,
        });
      }
    })
    this.onShow();
  },
  Change: function (e) {
    var _this = this
    _this.setData({
      index: e.detail.value,
      current_id: _this.data.selectData[e.detail.value].id,
      company_name: _this.data.selectData[e.detail.value].name
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
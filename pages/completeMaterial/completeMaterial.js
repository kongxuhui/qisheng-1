// pages/personalInfo/personalInfo.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    id:'',
    selectData: [],
    index: 0,
    current_id: '',
    company_name: ''
  },
  formSubmit: function (e) {
    var _this = this
    var postData = {
      company_id: _this.data.current_id,
      company_name: _this.data.company_name,
      true_name: e.detail.value.true_name,
      user_id: app.globalData.user_id,
      common: e.detail.value.beizhu,
    }
    app.wxRequest('qisheng/User/add_or_save.html', 'post', postData, _this.addPerson, _this.error)
  },
  addPerson: function(data){
    app.globalData.userInfo = data.data.obj
    wx.setStorage({
      key: "userInfo",
      data: data.data.obj
    })
    wx.switchTab({
      url: '../personCenter/personCenter',
    })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.wxRequest('qisheng/Company/lst.html', 'post', {}, this.getData2, this.error)
  },
  getData2: function (data) {
    var arr;
    var obj1 = {name: '请选择企业', id: ''};
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
      selectData: arr
    });
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
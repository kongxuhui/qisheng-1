const app = getApp()
var utils = require('../../utils/getCode.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    mobile: '',
    code: '',
    isShow: false,//默认按钮1显示，按钮2不显示
    sec: "30",//设定倒计时的秒数
    isSee01: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindPhone: function (e) {
      this.setData({
        mobile: e.detail.value
      })
    },
    bindCode: function (e) {
      this.setData({
        code: e.detail.value
      })
    },
    //校验手机号
    checkphonenumber: function () {
      var _this = this;
      if (_this.data.mobile.length == 0) {
        wx.showToast({
          title: '请输入手机号！',
          icon: 'success',
          duration: 1500
        })
        return false;
      }
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})|(19[0-9]{1})|(16[0-9]{1}))+\d{8})$/;

      if (!myreg.test(_this.data.mobile)) {
        //验证码先注销

        wx.showToast({
          title: '手机号有误',
          icon: 'success',
          duration: 1500
        });
        return false;
      }
      return true;
    },
    //校验验证码
    checkPassword: function (mobile) {
      var password = mobile.password.trim();

      if (password.length <= 0) {
        wx.showToast({
          title: '验证码不能为空',
          icon: 'success',
          duration: 1500
        });
        return false;
      }
      else {
        return true;
      }
    },
    //获取验证码
    getCode: function (e) {
      var _this = this;
      _this.setData({
        loadingShow: true
      })
      var phonenumberCheck = _this.checkphonenumber();
      var val = _this.data.mobile; //通过这个传递数据
      var myEventDetail = {
        val: val
      } // detail对象，提供给事件监听函数
      _this.triggerEvent('compontpass', myEventDetail)
      if (phonenumberCheck) {
        let postNumber = {
          transCode: 'MVCL01',
          funType: 'sendMobileVelidate',
          phone: _this.data.mobile,
        }
        app.wxRequest('post', postNumber, this.noWork, this.error)
        utils.getCode(_this, _this.data.sec);//调用倒计时函数
      }
    }
  }
})
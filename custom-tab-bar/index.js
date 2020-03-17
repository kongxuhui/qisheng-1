Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#0D7871",
    list: [
      {
        selectedIconPath: "/assets/images/Battery_index_pressed@2x.png",
        iconPath: "/assets/images/Battery_index_normal@2x.png",
        pagePath: "/pages/index/index",
        text: "电量"
      },
      {
        selectedIconPath: "/assets/images/data_index_pressed@2x.png",
        iconPath: "/assets/images/data_index_normal@2x.png",
        pagePath: "/pages/dianliang/dianliang",
        text: "数据"
      },
      {
        selectedIconPath: "/assets/images/me_index_pressed@2x.png",
        iconPath: "/assets/images/me_index_normal@2x.png",
        pagePath: "/pages/personCenter/personCenter",
        text: "我的"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})
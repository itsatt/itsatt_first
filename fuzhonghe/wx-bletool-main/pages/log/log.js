Page({
  data: {
    scoreRange: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    showModal: false,
    todaySelectedIndex:0,
    headacheSelectedIndex: 0,
    sleepSelectedIndex: 0,
    dryEyesSelectedIndex: 0,
    tinnitusSelectedIndex: 0,
    // ...
  },
  // 点击头昏评分
  showPicker: function () {
    this.setData({
      showModal: true
    });
  },
  // 关闭底部弹窗
  hidePicker: function () {
    this.setData({
      showModal: false
    });
  },

  ontodayPickerChange: function (e) {
    this.setData({
      todaySelectedIndex: e.detail.value
    });
  },
  // 头昏picker change事件
  onHeadachePickerChange: function (e) {
    this.setData({
      headacheSelectedIndex: e.detail.value
    });
  },
  // 睡眠picker change事件
  onSleepPickerChange: function (e) {
    this.setData({
      sleepSelectedIndex: e.detail.value
    });
  },
  // 干眼picker change事件
  onDryEyesPickerChange: function (e) {
    this.setData({
      dryEyesSelectedIndex: e.detail.value
    });
  },
  // 耳鸣picker change事件
  onTinnitusPickerChange: function (e) {
    this.setData({
      tinnitusSelectedIndex: e.detail.value
    });
  },
  // ...
  naviMonitor(e){
    //const _id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'loglishi/loglishi',
     // url: 'lishi/lishi?id=' + _id
    })
  }
})
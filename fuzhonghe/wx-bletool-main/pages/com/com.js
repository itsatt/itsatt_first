// pages/com/com.js
var wxCharts = require("../../utils/wxcharts.js");//相对路径
import {
  sdBLE
} from "../../utils/sdBLE.js";
const app = getApp();
let sdBLEObj = new sdBLE();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiverText: '',
    receiverLength: 0,
    sendText: '',
    sendLength: 0,
    time: 1000,
    timeSend: false,
    showPop: false,
    devs: [],
    deviceId: null,
    deviceName: null,
    serviceId: null,
    imageWidth:0
  },
  customData: {
    _devs: [],
  },
  async startDiscovery() {
    sdBLEObj.onBluetoothAdapterStateChange();
    sdBLEObj.onBLEConnectionStateChange();
    await sdBLEObj.closeBluetoothAdapter();
    let res = await sdBLEObj.openBluetoothAdapter();
    console.log("获取蓝牙结果", res)
    console.log("蓝牙连接状态", app.globalData.connectState)
    console.log("sdBLEObj", sdBLEObj)
    if (res.ok) {
      const that = this
      sdBLEObj.startBluetoothDevicesDiscovery((name, RSSI, deviceId) => {
        console.log(`Name: ${name}, RSSI: ${RSSI}, DeviceId: ${deviceId}`); // 添加这一行
        if (!that.customData._devs) {
          that.customData._devs = []; // 如果 _devs 是 undefined，我们初始化它
        }
        that.customData._devs.push({
          name,
          RSSI,
          deviceId,
        });
        that.setData({
          devs: that.customData._devs
        });
      });
    }
  },

  /**
   * 自定义数据
   */
  customData: {
    sendText: '',
    deviceId: '',
    serviceId: '',
    characteristicId: '',
    canWrite: false,
    canRead: false,
    canNotify: false,
    canIndicate: false,
    time: 0
  },
  onPop() {
    this.setData({
      showPop: true
    })
  },
  onClosePop() {
    this.setData({
      showPop: false
    })
  },

  onDeviceConnected: function (data) {
    console.log('Device connected: ', data);
    // 更新数据
    this.setData({
      deviceId: data.deviceId,
      deviceName: data.deviceName,
    });
    this.startGetServices()
  },

  getCharacteristic() {
    console.log("获取特性")
    const deviceName = this.deviceName;
    const serviceId = this.data.firstServices.uuid;
    const deviceId = this.data.deviceId;
    this.setData({
      serviceId
    })
    this.startGetCharacteristics(deviceId, serviceId)
  },
  async startGetCharacteristics(deviceId, serviceId) {
    console.log("deviceId:", deviceId)
    console.log("serviceId", serviceId)
    let res = await sdBLEObj.getBLEDeviceCharacteristics(deviceId, serviceId);
    this.setData({
      characteristic: res.data,
      secondCharacteristic: res.data[0]
    });
    console.log("secondCharacteristic:", this.data.secondCharacteristic)
    this.operation()
  },
  /**
   * 跳转到操作页面
   */
  operation() {
    if (app.globalData.connectState) {
      const properties = []
      const _properties = this.data.secondCharacteristic.properties
      for (let key in _properties) {
        properties.push(`${key}=${_properties[key]}`)
      }
      const characteristicId = this.data.secondCharacteristic.uuid
      const deviceId = this.data.deviceId
      const serviceId = this.data.serviceId
      console.log("characteristicId：", characteristicId)
      console.log("deviceId：", deviceId)
      console.log("serviceId：", serviceId)
      wx.notifyBLECharacteristicValueChange({
        deviceId,
        serviceId,
        characteristicId,
        state: true,
        success: (res) => {
          // do something...
          console.log("do something..", res)
        }
      })
    } else {
      wx.showToast({
        title: '未连接蓝牙设备',
        icon: 'none'
      })
    }
  },

  async startGetServices() {
    let res = await sdBLEObj.getBLEDeviceServices(this.data.deviceId)
    console.log("获取服务：", res)
    this.customData.services = res.data
    this.setData({
      services: res.data,
      firstServices: res.data[0]
    })
    console.log("所有服务:", this.data.services)
    console.log("第一个服务:", this.data.services[0])
    this.getCharacteristic()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.startDiscovery()
    app.globalData.on('connectedDevice', this.onDeviceConnected);

  },
  connect(event) {
    console.log("event111111", event)
    this.setData({
      deviceId: null,
      deviceName: null,
    })
    if (sdBLEObj.globalData.bluetoothState) {
      const deviceId = event.currentTarget.dataset.dev.deviceId
      const deviceName = event.currentTarget.dataset.dev.name
      wx.showLoading({
        title: '正在连接...',
      })
      sdBLEObj.startConnect(deviceId, deviceName)
      wx.hideLoading({
        success: (res) => {},
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    sdBLEObj.onBLECharacteristicValueChange((receiverValue) => {
      // 假设接收到的数据格式为 "x y z"，各数值之间用空格隔开
      // 下面的代码读取 receiverValue 数组中的前三个元素作为三个方向上的数据
      let x = receiverValue[0];
      let y = receiverValue[1];
      let z = receiverValue[2];
  
      // 将数值保留 2 位小数后转换成字符串并更新到页面
      this.setData({
        valueX: x.toFixed(2).toString(),
        valueY: y.toFixed(2).toString(),
        valueZ: z.toFixed(2).toString(),
      });
    });
  },
  




  /**
   * 生命周期函数--监听页面显示
   */
  onShow:function(){
    new wxCharts({
      canvasId: 'columnCanvas1',
      type: 'column',
      categories: ['前五日', '前四日', '前三日', '前两日', '昨天', '今天'],
      series: [{
            name: '前屈',
            data: [30, 42, 55, 38, 45, 50],
            color:'#83c162'
        }],
      yAxis: {
          format: function (val) {
              return val + '°';
          },
          max:90,
      min:0
      },
      width: 350,
      height: 170,
      
  });
  new wxCharts({
    canvasId: 'columnCanvas2',
    type: 'column',
    categories: ['前五日', '前四日', '前三日', '前两日', '昨天', '今天'],
    series: [{
        name: '后倾',
        data: [30, 42, 55, 38, 45, 50],
        color:'#83c162'
    }],
    yAxis: {
        format: function (val) {
            return val + '°';
        },
        max:90,
      min:0
    },
    width: 350,
    height: 170,
    
});
new wxCharts({
  canvasId: 'columnCanvas3',
  type: 'column',
  categories: ['前五日', '前四日', '前三日', '前两日', '昨天', '今天'],
  series: [{
      name: '左侧屈',
      data: [30, 42, 55, 38, 45, 50],
      color:'#83c162'
  }],
  yAxis: {
      format: function (val) {
          return val + '°';
      },
      max:90,
      min:0
  },
  width: 350,
  height: 170,
  
});
new wxCharts({
  canvasId: 'columnCanvas4',
  type: 'column',
  categories: ['前五日', '前四日', '前三日', '前两日', '昨天', '今天'],
  series: [{
      name: '右侧屈',
      data: [30, 42, 55, 38, 45, 50],
      color:'#83c162'
  }],
  yAxis: {
      format: function (val) {
          return val + '°';
      },
      max:90,
      min:0
  },
  width: 350,
  height: 170,
  
});
new wxCharts({
  canvasId: 'columnCanvas5',
  type: 'column',
  categories: ['前五日', '前四日', '前三日', '前两日', '昨天', '今天'],
  series: [{
      name: '左旋',
      data: [30, 42, 55, 38, 45, 50],
      color:'#83c162'
  }],
  yAxis: {
      format: function (val) {
          return val + '°';
      },
      max:90,
      min:0
  },
  width: 350,
  height: 170,
  
});
new wxCharts({
  canvasId: 'columnCanvas6',
  type: 'column',
  categories: ['前五日', '前四日', '前三日', '前两日', '昨天', '今天'],
  series: [{
      name: '右旋',
      data: [30, 42, 55, 38, 45, 50],
      color:'#83c162'
  }],
  yAxis: {
      format: function (val) {
          return val + '°';
      },
      max:90,
      min:0
  },
  width: 350,
  height: 170,
  
});
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    getApp().globalData.listeners['connectedDevice'] = null;
  },

  /**
   * 更新发送框内容
   */
  updateSendText(event) {
    const value = event.detail.value
    this.customData.sendText = value
    this.setData({
      sendText: value
    })
  },

  /**
   * 更新定时发送时间间隔
   */
  updateTime(event) {
    const self = this
    const value = event.detail.value
    this.setData({
      time: /^[1-9]+.?[0-9]*$/.test(value) ? +value : 1000
    })
    clearInterval(this.customData.time)
    const deviceId = this.customData.deviceId // 设备ID
    const serviceId = this.customData.serviceId // 服务ID
    const characteristicId = this.customData.characteristicId // 特征值ID
    this.customData.time = setInterval(() => {
      const sendText = self.customData.sendText
      const sendPackage = app.subPackage(sendText) // 数据分每20个字节一个数据包数组
      if (app.globalData.connectState) {
        if (self.customData.canWrite) { // 可写
          self.writeData({
            deviceId,
            serviceId,
            characteristicId,
            sendPackage
          })
        }
      }
    }, self.data.time)
  },
  /**
   * 清除接收
   */
  clearReceiverText(event) {
    // this.customData.receiverText = ''
    this.setData({
      receiverText: '',
      receiverLength: 0,
      sendLength: 0
    })
  },
  /**
   * 清除发送
   */
  clearSendText(event) {
    this.customData.sendText = ''
    this.setData({
      sendText: '',
      sendLength: 0
    })
  },
  /**
   * 手动发送
   */
  manualSend(event) {
    const deviceId = this.customData.deviceId // 设备ID
    const serviceId = this.customData.serviceId // 服务ID
    const characteristicId = this.customData.characteristicId // 特征值ID
    const sendText = this.customData.sendText
    const sendPackage = app.subPackage(sendText) // 数据分每20个字节一个数据包数组
    if (app.globalData.connectState) {
      if (this.customData.canWrite) { // 可写
        this.writeData({
          deviceId,
          serviceId,
          characteristicId,
          sendPackage
        })
      }
    } else {
      wx.showToast({
        title: '已断开连接',
        icon: 'none'
      })
    }
  },
  /**
   * 自动发送
   */
  timeChange(event) {
    this.setData({
      timeSend: event.detail.value.length ? true : false
    })
    if (!this.data.timeSend) {
      clearInterval(this.customData.time)
    } else {
      const self = this
      const deviceId = this.customData.deviceId // 设备ID
      const serviceId = this.customData.serviceId // 服务ID
      const characteristicId = this.customData.characteristicId // 特征值ID
      this.customData.time = setInterval(() => {
        const sendText = self.customData.sendText
        const sendPackage = app.subPackage(sendText) // 数据分每20个字节一个数据包数组
        if (app.globalData.connectState) {
          if (self.customData.canWrite) { // 可写
            self.writeData({
              deviceId,
              serviceId,
              characteristicId,
              sendPackage
            })
          }
        }
      }, self.data.time)
    }
  },
  /**
   * 向特征值写数据(write)
   */
  writeData({
    deviceId,
    serviceId,
    characteristicId,
    sendPackage,
    index = 0
  }) {
    const self = this
    let i = index;
    let len = sendPackage.length;
    if (len && len > i) {
      wx.writeBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        value: app.string2buf(sendPackage[i]),
        success: (res) => {
          self.setData({
            sendLength: self.data.sendLength + sendPackage[i].length // 更新已发送字节数
          })
          i += 1;
          self.writeData({
            deviceId,
            serviceId,
            characteristicId,
            sendPackage,
            index: i
          }) // 发送成功，发送下一个数据包
        },
        fail: (res) => {
          self.writeData({
            deviceId,
            serviceId,
            characteristicId,
            sendPackage,
            index
          }) // 发送失败，重新发送
        }
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: 'BLE串口助手'
        })
      }, 2000)
    })
    return {
      title: 'BLE串口助手',
      path: '/page/search/search',
      promise
    }
  },
  naviMonitor(e){
    //const _id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'lishi/lishi',
     // url: 'lishi/lishi?id=' + _id
    })
  }
})
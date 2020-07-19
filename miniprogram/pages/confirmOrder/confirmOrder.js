// pages/confirmOrder/confirmOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carArray: [], //购物车
    totalPrice: 0,
    isSelectAddress: false,
    selectReceivingAddress: [], //选中的收货地址,
    isSelectReceivingAddress: false,
    order: {}
  },


  formatTime: function (date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },
  formatNumber: function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },



  selectAddress: function () {
    console.log("selectAddress")
    wx.navigateTo({
      url: '/pages/receivingAddress/receivingAddress',
    })
  },

  gotoPay: function () {
    if (this.data.selectReceivingAddress.length == 0) {
      wx.showToast({
        icon: "none",
        title: '请选择收货地址！',
      })
    } else {

      let time = this.formatTime(new Date());
      console.log(time);

      this.data.order.merchantsName = "小食代";
      this.data.order.merchantsImg = "/img/xiaoshidai.jpg";
      this.data.order.listTime = this.formatTime(new Date());
      this.data.order.foodsName = this.data.carArray[0].name;
      this.data.order.foodsCount = this.data.carArray.length;
      this.data.order.totalPrice = this.data.totalPrice;
      this.data.order.carArray = this.data.carArray;
      this.data.order.userInformation = this.data.selectReceivingAddress;

      const _this = this
      const db = wx.cloud.database()
      db.collection('order').add({
        data: {
          order: _this.data.order
        },
        success: res => {
          wx.showToast({
            title: '支付成功！',
          })
          wx.removeStorage({
            key: 'carArray',
            success(res) {
              console.log(res)
            }
          })
          wx.removeStorage({
            key: 'totalPrice',
            success(res) {
              console.log(res)
            }
          })
          wx.removeStorage({
            key: 'selectReceivingAddress',
            success(res) {
              console.log(res)
            }
          })
          wx.switchTab({
            url: '/pages/index/index',
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }

    // wx.showToast({
    //   title: '支付成功！',
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      carArray: wx.getStorageSync('carArray'),
      totalPrice: wx.getStorageSync('totalPrice'),
      selectReceivingAddress: wx.getStorageSync('selectReceivingAddress')
    })
    console.log("carArray: ", wx.getStorageSync('carArray'))
    if (this.data.selectReceivingAddress.length != 0) {
      this.setData({
        isSelectReceivingAddress: true
      })
    }
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
    this.setData({
      carArray: wx.getStorageSync('carArray'),
      totalPrice: wx.getStorageSync('totalPrice'),
      selectReceivingAddress: wx.getStorageSync('selectReceivingAddress')
    })
    if (this.data.selectReceivingAddress.length != 0) {
      this.setData({
        isSelectReceivingAddress: true
      })
    }
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
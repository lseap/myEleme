// pages/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
    totalPrice: 0,
    userInformation: [],
    _id: ""
  },

  //获取用户openid
  getOpenid() {
    let _this = this;
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        console.log('openid--', res.result)
        var openid = res.result.openid
        _this.setData({
          openid: openid
        })
        _this.onQuery();
      }
    })
  },

  //从云数据库获取订单列表
  onQuery: function () {
    const _id = wx.getStorageSync('selectOrderNo');
    const db = wx.cloud.database()
    db.collection('order').where({
      _id: _id
    }).get({
      success: res => {
        this.data.order.push(res.data[0].order);
        var totalPrice = res.data[0].order.totalPrice;
        this.setData({
          order: this.data.order.reverse(),
          totalPrice: totalPrice,
          _id: res.data[0]._id
        })
        console.log('[数据库] [查询记录] 成功: ', res)
        console.log('this.data.order: ', this.data.order)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var a = wx.getStorageSync('selectOrderNo')
    console.log("selectOrderNo: ", a);
    this.onQuery();
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
// pages/receivingAddress/receivingAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    receivingAddress: [],
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

  //从云数据库获取收获地址列表
  onQuery: function () {
    const db = wx.cloud.database()
    db.collection('receivingAddress').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        for (var i in res.data) {
          this.data.receivingAddress.push(res.data[i])
          // this.data.receivingAddress.push(res.data[i].confirmAddress)
        }
        this.setData({
          receivingAddress: this.data.receivingAddress
        })
        console.log('[数据库] [查询记录] 成功: ', res)
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

  selectReceivingAddress: function (e) {
    this.setData({
      _id: e.currentTarget.dataset.index
    })
    for (var i in this.data.receivingAddress) {
      if (this.data.receivingAddress[i]._id == this.data._id) {
        wx.setStorageSync('selectReceivingAddress', this.data.receivingAddress[i].confirmAddress)
      }
    }
    wx.navigateBack({
      url: '/pages/confirmOrder/confirmOrder',
    })
  },

  //删除收货地址
  delReceivingAddress: function (e) {
    this.setData({
      _id: e.currentTarget.dataset.index
    })
    const db = wx.cloud.database()
    db.collection('receivingAddress').doc(this.data._id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        for (var i in this.data.receivingAddress) {
          if (this.data.receivingAddress[i]._id == this.data._id) {
            this.data.receivingAddress.splice(i, 1);
          }
        }
        this.setData({
          receivingAddress: this.data.receivingAddress
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },

  //新增地址
  addAddress: function () {
    wx.navigateTo({
      url: '/pages/addAddress/addAddress',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
      receivingAddress: []
    })
    this.getOpenid();
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
// pages/addAddress/addAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: "详细地址",
    confirmAddress: {}
  },

  setName: function (e) {
    this.data.confirmAddress.name = e.detail.value
  },

  setPhoneNum: function (e) {
    this.data.confirmAddress.phoneNum = e.detail.value
  },

  setAddress: function (e) {
    this.data.confirmAddress.address = e.detail.value
  },

  addAddress: function () {
    const _this = this
    const db = wx.cloud.database()
    db.collection('receivingAddress').add({
      data: {
        confirmAddress: _this.data.confirmAddress
      },
      success: res => {
        wx.showToast({
          title: '新增记录成功',
        })
        wx.navigateBack({
          url: '/pages/receivingAddress/receivingAddress',
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
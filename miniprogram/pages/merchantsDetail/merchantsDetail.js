// pages/merchantsDetail/merchantsDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    toView: '0',
    scrollTop: 100,
    // foodCounts: 0,
    totalPrice: 0, // 总价格
    totalCount: 0, // 总商品数
    carArray: [], //购物车
    minPrice: 20, //起送价格
    payDesc: '',
    deliveryPrice: 4, //配送费
    fold: true,
    cartShow: 'none',
    listShow: false,
    status: 0,
  },

  //查询云数据库
  onQuery: function () {
    const _this = this;
    const db = wx.cloud.database()
    db.collection('goods').get({
      success: res => {
        _this.setData({
          goods: res.data[0].goods
        })
        console.log('[数据库] [查询记录] 成功: ', res.data)
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

  selectMenu: function (e) {
    var index = e.currentTarget.dataset.itemIndex;
    this.setData({
      toView: 'order' + index.toString()
    })
    console.log("toView: ", this.data.toView);
  },

  //移除商品
  decreaseCart: function (e) {
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    this.data.goods[parentIndex].foods[index].Count--;
    var num = this.data.goods[parentIndex].foods[index].Count;
    var mark = 'a' + index + 'b' + parentIndex;
    this.data.carArray.forEach(item => {
      if (item.mark == mark) {
        item.num--;
      }
    });
    var carArray1 = this.data.carArray.filter(item => item.num != 0);
    this.setData({
      carArray: carArray1,
      goods: this.data.goods
    })
    this.calTotalPrice()
    this.setData({
      payDesc: this.payDesc(),
    })
    //关闭弹起
    var count1 = 0
    for (let i = 0; i < carArray1.length; i++) {
      if (carArray1[i].num == 0) {
        count1++;
      }
    }
    if (count1 == carArray1.length) {
      if (num == 0) {
        this.setData({
          cartShow: 'none',
          listShow: false
        })
      }
    }
  },

  //添加到购物车
  addCart(e) {
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    this.data.goods[parentIndex].foods[index].Count++;
    var num = this.data.goods[parentIndex].foods[index].Count;
    var name = this.data.goods[parentIndex].foods[index].name;
    var mark = 'a' + index + 'b' + parentIndex;
    var flag = true;
    this.data.carArray.forEach(item => {
      if (item.mark == mark) {
        flag = false;
        item.num++;
      }
    });
    if (flag) {
      var price = this.data.goods[parentIndex].foods[index].price;
      var obj = {
        price: price,
        num: num,
        mark: mark,
        name: name,
        index: index,
        parentIndex: parentIndex
      };
      this.data.carArray.push(obj)
    }
    this.setData({
      carArray: this.data.carArray,
      goods: this.data.goods
    })
    this.calTotalPrice();
    this.setData({
      payDesc: this.payDesc()
    })
  },

  //计算总价
  calTotalPrice: function () {
    var carArray = this.data.carArray;
    var totalPrice = 0;
    var totalCount = 0;
    for (var i = 0; i < carArray.length; i++) {
      totalPrice += carArray[i].price * carArray[i].num;
      totalCount += carArray[i].num
    }
    this.setData({
      totalPrice: totalPrice,
      totalCount: totalCount,
      //payDesc: this.payDesc()
    });
  },

  //差几元起送
  payDesc() {
    if (this.data.totalPrice === 0) {
      return `￥${this.data.minPrice}元起送`;
    } else if (this.data.totalPrice < this.data.minPrice) {
      let diff = this.data.minPrice - this.data.totalPrice;
      return '还差' + diff + '元起送';
    } else {
      return '去结算';
    }
  },

  //結算
  pay() {
    if (this.data.totalPrice < this.data.minPrice) {
      return;
    }
    wx.setStorageSync('carArray', this.data.carArray);
    wx.setStorageSync('totalPrice', this.data.totalPrice);
    // window.alert('支付' + this.totalPrice + '元');
    //确认支付逻辑
    wx.navigateTo({
      url: "/pages/confirmOrder/confirmOrder"
    })
  },

  //弹起购物车
  toggleList: function () {
    if (!this.data.totalCount) {
      return;
    }
    this.setData({
      fold: !this.data.fold,
    })
    var fold = this.data.fold
    this.cartShow(fold)
  },

  cartShow: function (fold) {
    console.log(fold);
    if (fold == false) {
      this.setData({
        cartShow: 'block',
        listShow: true
      })
    } else {
      this.setData({
        cartShow: 'none',
        listShow: false
      })
    }
    console.log(this.data.cartShow);
  },

  hideList: function () {
    this.setData({
      fold: true,
      cartShow: 'none',
      listShow: false
    })
  },

  //清空购物车
  empty: function () {
    console.log("carArray: ", this.data.carArray)
    for (var i = 0; i < this.data.carArray.length; i++) {
      if (this.data.carArray[i].num > 0) {
        this.data.goods[this.data.carArray[i].parentIndex].foods[this.data.carArray[i].index].Count = 0;
      }
    }
    this.setData({
      carArray: [],
      goods: this.data.goods,
      totalCount: 0,
      totalPrice: 0,
      cartShow: 'none',
      listShow: false
    })
  },

  //选择 “商品”、“评论”、“商家”
  tabChange: function (e) {
    var showtype = e.target.dataset.type;
    this.setData({
      status: showtype,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let merchantsIndex = wx.getStorageSync('merchantsIndex');
    this.onQuery();
    this.setData({
      payDesc: this.payDesc()
    });
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
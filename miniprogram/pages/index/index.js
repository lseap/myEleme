//index.js
Page({
  data: {
    currentLocated: "广东省湛江市雷州市",
    classification: [{
      "classificationImg": "/img/t1.png",
      "classificationText": "凉拌",
    }, {
      "classificationImg": "/img/t2.png",
      "classificationText": "粤菜",
    }, {
      "classificationImg": "/img/t3.png",
      "classificationText": "热菜",
    }, {
      "classificationImg": "/img/t4.png",
      "classificationText": "川菜",
    }, {
      "classificationImg": "/img/t5.png",
      "classificationText": "湘菜",
    }, {
      "classificationImg": "/img/t6.png",
      "classificationText": "江浙菜",
    }, {
      "classificationImg": "/img/t7.png",
      "classificationText": "海鲜",
    }, {
      "classificationImg": "/img/t8.png",
      "classificationText": "肉食",
    }],
    //轮播图
    rotationChart: [{
        id: 1,
        "imgUrl": "/img/banner.jpg"
      },
      {
        id: 2,
        "imgUrl": "/img/banner.jpg"
      }
    ],
    merchantsList: []
  },

  //查询云数据库
  onQuery: function () {
    const _this = this;
    const db = wx.cloud.database()
    db.collection('merchantsList').get({
      success: res => {
        _this.setData({
          merchantsList: res.data[0].merchantsList
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

  gotoMerchants: function (e) {
    let merchantsIndex = e.currentTarget.dataset.index;
    wx.setStorageSync('merchantsIndex', merchantsIndex);
    wx.navigateTo({
      url: '/pages/merchantsDetail/merchantsDetail',
    })
  },

  search: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  onLoad: function () {
    this.onQuery();
  },
})
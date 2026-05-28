const BASE_URL = 'http://localhost:3000/api';

const request = (url, method = 'GET', data = {}, isMerchant = false) => {
  return new Promise((resolve, reject) => {
    const token = isMerchant ? wx.getStorageSync('merchantToken') : wx.getStorageSync('token');
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        if (res.data.code === 200) {
          resolve(res.data.data);
        } else {
          wx.showToast({ title: res.data.message, icon: 'none' });
          reject(res.data);
        }
      },
      fail: reject
    });
  });
};

module.exports = { request, BASE_URL };

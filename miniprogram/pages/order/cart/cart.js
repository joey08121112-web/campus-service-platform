const { request } = require('../../../utils/request');

const EMOJIS = ['🍜', '🍚', '🥗', '🍲', '🥘', '🍝', '🍛', '🥟', '🍱', '🥩'];

Page({
  data: {
    merchantName: '',
    items: [],
    totalAmount: '0.00',
    dormitory: '',
    room: '',
    phone: '',
    remark: ''
  },

  onLoad() {
    const cartItems = wx.getStorageSync('cartItems') || [];
    const merchantId = wx.getStorageSync('merchantId');
    const merchantName = wx.getStorageSync('merchantName') || '商家';

    this.merchantId = merchantId;
    this.cartItems = cartItems;

    this.setData({ merchantName });
    this.loadCartItems(cartItems);
  },

  async loadCartItems(cartItems) {
    try {
      const merchant = await request(`/merchants/${this.merchantId}`);
      const products = await request(`/merchants/${this.merchantId}/products`);

      let totalAmount = 0;
      const items = cartItems.map((ci, i) => {
        const product = products.find(p => p.id === ci.product_id);
        if (!product) return null;
        const subtotal = (product.price * ci.quantity).toFixed(2);
        totalAmount += parseFloat(subtotal);
        return {
          ...ci,
          name: product.name,
          price: product.price,
          subtotal,
          emoji: EMOJIS[i % EMOJIS.length]
        };
      }).filter(Boolean);

      this.setData({ items, totalAmount: totalAmount.toFixed(2) });
    } catch (err) {
      console.error('加载购物车失败', err);
    }
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  async submitOrder() {
    const { dormitory, room, phone, items, remark } = this.data;

    if (!dormitory || !room) {
      wx.showToast({ title: '请填写宿舍信息', icon: 'none' });
      return;
    }
    if (!phone || phone.length !== 11) {
      wx.showToast({ title: '请填写正确的手机号', icon: 'none' });
      return;
    }

    try {
      const address = `${dormitory} ${room}`;
      const orderItems = items.map(i => ({
        product_id: i.product_id,
        quantity: i.quantity
      }));

      await request('/orders', 'POST', {
        merchant_id: this.merchantId,
        items: orderItems,
        address,
        phone,
        remark
      });

      wx.showToast({ title: '下单成功', icon: 'success' });
      wx.removeStorageSync('cartItems');
      wx.removeStorageSync('merchantId');
      wx.removeStorageSync('merchantName');
      wx.removeStorageSync('totalAmount');

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (err) {
      wx.showToast({ title: '下单失败，请重试', icon: 'none' });
    }
  }
});

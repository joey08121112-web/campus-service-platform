const { request } = require('../../../utils/request');

// 菜品图片渐变色池
const IMG_COLORS = [
  'linear-gradient(135deg, #FFD4D4, #FFB8B8)',
  'linear-gradient(135deg, #FFE8CC, #FFD4A8)',
  'linear-gradient(135deg, #D4F5E9, #B8EDD8)',
  'linear-gradient(135deg, #D4E8FF, #B8D8FF)',
  'linear-gradient(135deg, #F0D4FF, #E8B8FF)',
  'linear-gradient(135deg, #FFF8D4, #FFF0B8)'
];

// 菜品 emoji 占位
const EMOJIS = ['🍜', '🍚', '🥗', '🍲', '🥘', '🍝', '🍛', '🥟', '🍱', '🥩'];

Page({
  data: {
    merchant: {},
    products: [],
    cart: {},
    totalCount: 0,
    totalAmount: '0.00',
    loading: false
  },

  onLoad(options) {
    this.merchantId = options.id;
    this.loadMerchant();
    this.loadProducts();
  },

  async loadMerchant() {
    try {
      const merchant = await request(`/merchants/${this.merchantId}`);
      this.setData({ merchant });
      wx.setNavigationBarTitle({ title: merchant.name });
    } catch (err) {
      console.error('加载商家信息失败', err);
    }
  },

  async loadProducts() {
    this.setData({ loading: true });
    try {
      const products = await request(`/merchants/${this.merchantId}/products`);
      const enriched = products.map((p, i) => ({
        ...p,
        imgBg: IMG_COLORS[i % IMG_COLORS.length],
        emoji: EMOJIS[i % EMOJIS.length],
        quantity: this.data.cart[p.id] || 0
      }));
      this.setData({ products: enriched, loading: false });
    } catch (err) {
      console.error('加载菜品失败', err);
      this.setData({ loading: false });
    }
  },

  addToCart(e) {
    const id = e.currentTarget.dataset.id;
    const cart = { ...this.data.cart };
    cart[id] = (cart[id] || 0) + 1;
    this.updateCart(cart);
  },

  minusFromCart(e) {
    const id = e.currentTarget.dataset.id;
    const cart = { ...this.data.cart };
    if (cart[id] > 0) {
      cart[id]--;
      if (cart[id] === 0) delete cart[id];
    }
    this.updateCart(cart);
  },

  updateCart(cart) {
    let totalCount = 0;
    let totalAmount = 0;

    const products = this.data.products.map(p => {
      const quantity = cart[p.id] || 0;
      totalCount += quantity;
      totalAmount += quantity * parseFloat(p.price);
      return { ...p, quantity };
    });

    this.setData({
      cart,
      products,
      totalCount,
      totalAmount: totalAmount.toFixed(2)
    });
  },

  goToCart() {
    const items = [];
    for (const [productId, quantity] of Object.entries(this.data.cart)) {
      if (quantity > 0) {
        items.push({ product_id: parseInt(productId), quantity });
      }
    }

    wx.setStorageSync('cartItems', items);
    wx.setStorageSync('merchantId', this.merchantId);
    wx.setStorageSync('merchantName', this.data.merchant.name);
    wx.setStorageSync('totalAmount', this.data.totalAmount);

    wx.navigateTo({ url: '/pages/order/cart/cart' });
  }
});

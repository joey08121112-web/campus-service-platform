const { request } = require('../../../utils/request');
const STATUS_MAP = { 0: { text: '待接单', class: 'status-pending' }, 1: { text: '配送中', class: 'status-accepted' }, 2: { text: '已完成', class: 'status-done' } };
const SIZE_MAP = { small: '小件', medium: '中件', large: '大件' };

Page({
  data: { orders: [], currentTab: 'pending', loading: false },
  onLoad() { this.loadOrders(); },
  onShow() { this.loadOrders(); },
  switchTab(e) { this.setData({ currentTab: e.currentTarget.dataset.tab }); this.loadOrders(); },
  async loadOrders() {
    this.setData({ loading: true });
    try {
      const url = this.data.currentTab === 'pending' ? '/express?status=0' : '/express/my';
      const orders = await request(url);
      const enriched = orders.map(o => ({ ...o, statusText: STATUS_MAP[o.status]?.text || '未知', statusClass: STATUS_MAP[o.status]?.class || '', sizeText: SIZE_MAP[o.package_size] || o.package_size }));
      this.setData({ orders: enriched, loading: false });
    } catch (err) { this.setData({ loading: false }); }
  },
  async acceptOrder(e) {
    try { await request(`/express/${e.currentTarget.dataset.id}/accept`, 'POST'); wx.showToast({ title: '接单成功', icon: 'success' }); this.loadOrders(); } catch (err) { wx.showToast({ title: '接单失败', icon: 'none' }); }
  },
  async completeOrder(e) {
    try { await request(`/express/${e.currentTarget.dataset.id}/complete`, 'POST'); wx.showToast({ title: '已完成', icon: 'success' }); this.loadOrders(); } catch (err) { wx.showToast({ title: '操作失败', icon: 'none' }); }
  },
  goToPublish() { wx.navigateTo({ url: '/pages/express/publish/publish' }); }
});

const { request } = require('../../../utils/request');
const STATUS_MAP = {
  0: { text: '待接单', class: 'status-pending' },
  1: { text: '配送中', class: 'status-accepted' },
  2: { text: '已完成', class: 'status-done' },
  3: { text: '已取消', class: '' }
};

Page({
  data: { orders: [], currentTab: 'pending', loading: false },
  onLoad() { this.loadOrders(); },
  onShow() { this.loadOrders(); },
  switchTab(e) { this.setData({ currentTab: e.currentTarget.dataset.tab }); this.loadOrders(); },
  async loadOrders() {
    this.setData({ loading: true });
    try {
      const url = this.data.currentTab === 'pending' ? '/takeout?status=0' : '/takeout/my';
      const orders = await request(url);
      const enriched = orders.map(o => ({ ...o, statusText: STATUS_MAP[o.status]?.text || '未知', statusClass: STATUS_MAP[o.status]?.class || '' }));
      this.setData({ orders: enriched, loading: false });
    } catch (err) { this.setData({ loading: false }); }
  },
  async acceptOrder(e) {
    const id = e.currentTarget.dataset.id;
    try {
      await request(`/takeout/${id}/accept`, 'POST');
      wx.showToast({ title: '接单成功', icon: 'success' });
      this.loadOrders();
    } catch (err) { wx.showToast({ title: '接单失败', icon: 'none' }); }
  },
  async completeOrder(e) {
    const id = e.currentTarget.dataset.id;
    try {
      await request(`/takeout/${id}/complete`, 'POST');
      wx.showToast({ title: '已完成', icon: 'success' });
      this.loadOrders();
    } catch (err) { wx.showToast({ title: '操作失败', icon: 'none' }); }
  },
  goToPublish() { wx.navigateTo({ url: '/pages/takeout/publish/publish' }); }
});

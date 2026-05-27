const { request } = require('../../../utils/request');

const DORMITORIES = ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7号楼', '8号楼', '9号楼', '10号楼'];

Page({
  data: {
    dormitories: DORMITORIES,
    dormitoryIndex: -1,
    selectedDormitory: '',
    fileName: '',
    filePath: '',
    pages: '',
    colorMode: 'bw',
    duplex: '0',
    pickupType: 'self',
    estimatedPrice: '0.00',
    canSubmit: false
  },

  onDormitoryChange(e) {
    const idx = e.detail.value;
    this.setData({
      dormitoryIndex: idx,
      selectedDormitory: DORMITORIES[idx]
    });
    this.checkCanSubmit();
  },

  chooseFile() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        const file = res.tempFiles[0];
        this.setData({
          fileName: file.name,
          filePath: file.path
        });
        this.checkCanSubmit();
      }
    });
  },

  removeFile() {
    this.setData({ fileName: '', filePath: '', pages: '' });
    this.checkCanSubmit();
  },

  onPagesInput(e) {
    this.setData({ pages: e.detail.value });
    this.calculatePrice();
    this.checkCanSubmit();
  },

  setColorMode(e) {
    this.setData({ colorMode: e.currentTarget.dataset.mode });
    this.calculatePrice();
  },

  setDuplex(e) {
    this.setData({ duplex: e.currentTarget.dataset.duplex });
    this.calculatePrice();
  },

  setPickupType(e) {
    this.setData({ pickupType: e.currentTarget.dataset.type });
    this.calculatePrice();
  },

  calculatePrice() {
    const { pages, colorMode, duplex, pickupType } = this.data;
    if (!pages || pages <= 0) {
      this.setData({ estimatedPrice: '0.00' });
      return;
    }

    let pricePerPage;
    if (colorMode === 'bw' && duplex === '0') pricePerPage = 0.3;
    else if (colorMode === 'bw' && duplex === '1') pricePerPage = 0.5;
    else if (colorMode === 'color' && duplex === '0') pricePerPage = 0.5;
    else pricePerPage = 1.0;

    let amount = pages * pricePerPage;
    if (pickupType === 'delivery') amount += 1;

    this.setData({ estimatedPrice: amount.toFixed(2) });
  },

  checkCanSubmit() {
    const { selectedDormitory, fileName, pages } = this.data;
    const canSubmit = selectedDormitory && fileName && pages > 0;
    this.setData({ canSubmit: !!canSubmit });
  },

  async submitPrintJob() {
    if (!this.data.canSubmit) return;

    const { selectedDormitory, filePath, fileName, pages, colorMode, duplex, pickupType } = this.data;

    try {
      wx.showLoading({ title: '提交中...' });

      const token = wx.getStorageSync('token');
      const BASE_URL = 'http://localhost:3000/api';

      wx.uploadFile({
        url: `${BASE_URL}/print/jobs`,
        filePath: filePath,
        name: 'file',
        formData: {
          dormitory: selectedDormitory,
          pages: pages,
          color_mode: colorMode,
          duplex: duplex,
          pickup_type: pickupType
        },
        header: { 'Authorization': `Bearer ${token}` },
        success: (res) => {
          wx.hideLoading();
          const data = JSON.parse(res.data);
          if (data.code === 200) {
            wx.showToast({ title: '提交成功', icon: 'success' });
            setTimeout(() => wx.navigateBack(), 1500);
          } else {
            wx.showToast({ title: data.message || '提交失败', icon: 'none' });
          }
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({ title: '网络错误', icon: 'none' });
        }
      });
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '提交失败', icon: 'none' });
    }
  }
});

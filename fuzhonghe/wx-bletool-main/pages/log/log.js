Page({
  data: {
    scoreRange: Array.from({ length: 10 }, (v, k) => k + 1),
    selectedScoreIndex: 0,
    showModal: false
  },
  showPicker: function() {
    this.setData({
      showModal: true
    })
  },
  hidePicker: function() {
    this.setData({
      showModal: false
    })
  },
  onPickerChange: function(e) {
    var score = this.data.scoreRange[e.detail.value];
    this.setData({
      selectedScoreIndex: e.detail.value,
      showModal: false
    });
    document.querySelector('#score').innerText = score;
  }
})
